const { getMockQuestions } = require('../../utils/mock');
const ADMIN_SECRET = '123456';

const newQuestion = () => ({
  id: `q_${Date.now()}`,
  title: '请输入题干',
  type: 'single',
  typeLabel: '单选',
  options: [
    { label: '选项A', value: 'a' },
    { label: '选项B', value: 'b' }
  ],
  value: ''
});

Page({
  data: {
    authed: false,
    password: '',
    saving: false,
    loadingList: false,
    sessions: [],
    session: {
      name: '',
      code: '',
      start: '',
      end: '',
      status: 'draft'
    },
    questions: getMockQuestions(),
    currentStatus: 'draft'
  },

  onPwdInput(e) {
    this.setData({ password: e.detail.value });
  },

  doLogin() {
    if (this.data.password === ADMIN_SECRET) {
      this.setData({ authed: true });
      wx.showToast({ title: '登录成功', icon: 'success' });
      this.fetchSessions();
    } else {
      wx.showToast({ title: '口令错误', icon: 'none' });
    }
  },

  onFieldChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [`session.${key}`]: e.detail.value });
  },

  onDateChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [`session.${key}`]: e.detail.value });
  },

  async fetchSessions() {
    this.setData({ loadingList: true });
    try {
      const res = await wx.cloud.callFunction({ name: 'listSessions' });
      const result = res && res.result;
      if (result && result.ok) {
        this.setData({ sessions: result.list || [] });
      }
    } catch (err) {
      console.error('listSessions error', err);
    } finally {
      this.setData({ loadingList: false });
    }
  },

  loadSession(e) {
    const { code } = e.currentTarget.dataset;
    const target = this.data.sessions.find((s) => s.code === code);
    if (!target) return;
    this.setData({
      session: {
        name: target.name,
        code: target.code,
        start: target.start || '',
        end: target.end || '',
        status: target.status || 'draft'
      },
      questions: target.questions || [],
      currentStatus: target.status || 'draft'
    });
  },

  updateQuestionTitle(e) {
    const { qid } = e.currentTarget.dataset;
    const questions = this.data.questions.map((q) =>
      q.id === qid ? { ...q, title: e.detail.value } : q
    );
    this.setData({ questions });
  },

  updateQuestionType(e) {
    const { qid } = e.currentTarget.dataset;
    const idx = Number(e.detail.value);
    const types = ['single', 'multi', 'score', 'text'];
    const type = types[idx] || 'single';
    const typeMap = {
      single: '单选',
      multi: '多选',
      score: '评分',
      text: '主观题'
    };
    const questions = this.data.questions.map((q) =>
      q.id === qid ? { ...q, type, typeLabel: typeMap[type], options: type === 'score' || type === 'text' ? [] : q.options } : q
    );
    this.setData({ questions });
  },

  updateQuestionOptions(e) {
    const { qid } = e.currentTarget.dataset;
    const raw = e.detail.value || '';
    const options = raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t, idx) => ({ label: t, value: String.fromCharCode(97 + idx) }));
    const questions = this.data.questions.map((q) =>
      q.id === qid ? { ...q, options } : q
    );
    this.setData({ questions });
  },

  removeQuestion(e) {
    const { qid } = e.currentTarget.dataset;
    const questions = this.data.questions.filter((q) => q.id !== qid);
    this.setData({ questions });
  },

  addQuestion() {
    const questions = [...this.data.questions, newQuestion()];
    this.setData({ questions });
  },

  async saveSession(evtOrAction = 'save') {
    if (!this.data.authed) {
      wx.showToast({ title: '请先输入口令登录', icon: 'none' });
      return;
    }
    if (!wx.cloud) {
      wx.showToast({ title: '当前基础库不支持云开发', icon: 'none' });
      return;
    }

    const action = typeof evtOrAction === 'string'
      ? evtOrAction
      : (evtOrAction?.currentTarget?.dataset?.action || 'save');

    const hasQuestions = this.data.questions.length > 0;
    if (action === 'publish' && !hasQuestions) {
      wx.showToast({ title: '发布前请先添加题目', icon: 'none' });
      return;
    }

    // 发布后不允许再改题目
    if (this.data.currentStatus === 'published' && action === 'save') {
      wx.showToast({ title: '已发布的场次不可再改题目', icon: 'none' });
      return;
    }

    const payload = {
      session: this.data.session,
      questions: this.data.questions,
      action
    };

    wx.setStorageSync('sessionPayload', payload);

    this.setData({ saving: true });
    try {
      const res = await wx.cloud.callFunction({
        name: 'upsertSession',
        data: { ...payload, adminSecret: this.data.password }
      });
      const result = res && res.result;
      if (result && result.ok) {
        this.fetchSessions();
        this.setData({ currentStatus: result.status || 'draft' });
        wx.showToast({ title: action === 'publish' ? '已发布' : '已保存', icon: 'success' });
      } else {
        wx.showToast({
          title: (result && result.message) || '云端失败，已保存在本地',
          icon: 'none'
        });
      }
    } catch (err) {
      console.error('saveSession error', err);
      wx.showToast({ title: '云同步失败，已保存在本地', icon: 'none' });
    } finally {
      this.setData({ saving: false });
    }
  }
});
