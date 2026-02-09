const demoQuestions = [
  { id: 'q1', title: '培训主题是否清晰？', typeLabel: '单选', value: '' },
  { id: 'q2', title: '需要改进的环节', typeLabel: '多选', value: [] },
  { id: 'q3', title: '整体打分', typeLabel: '评分', value: 0 }
];

const ADMIN_SECRET = '123456';

Page({
  data: {
    authed: false,
    password: '',
    saving: false,
    session: {
      name: 'AI赋能实践班',
      code: 'DEMO-SESSION',
      start: '',
      end: ''
    },
    questions: demoQuestions
  },

  onPwdInput(e) {
    this.setData({ password: e.detail.value });
  },

  doLogin() {
    if (this.data.password === ADMIN_SECRET) {
      this.setData({ authed: true });
      wx.showToast({ title: '登录成功', icon: 'success' });
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

  async saveSession() {
    if (!this.data.authed) {
      wx.showToast({ title: '请先输入口令登录', icon: 'none' });
      return;
    }
    if (!wx.cloud) {
      wx.showToast({ title: '当前基础库不支持云开发', icon: 'none' });
      return;
    }

    const payload = {
      session: this.data.session,
      questions: this.data.questions
    };

    // 先本地备份，防止云端失败导致数据丢失
    wx.setStorageSync('sessionPayload', payload);

    this.setData({ saving: true });
    try {
      const res = await wx.cloud.callFunction({
        name: 'upsertSession',
        data: { ...payload, adminSecret: this.data.password }
      });
      const result = res && res.result;
      if (result && result.ok) {
        wx.showToast({ title: '已同步云端', icon: 'success' });
      } else {
        wx.showToast({
          title: (result && result.message) || '云端同步失败，已保存在本地',
          icon: 'none'
        });
      }
    } catch (err) {
      console.error('saveSession error', err);
      wx.showToast({ title: '云同步失败，已保存在本地', icon: 'none' });
    } finally {
      this.setData({ saving: false });
    }
  },

  addQuestion() {
    wx.showToast({ title: '可跳转到题库编辑页面', icon: 'none' });
  }
});
