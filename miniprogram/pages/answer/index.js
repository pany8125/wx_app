const { getMockQuestions } = require('../../utils/mock');

Page({
  data: {
    sessionId: '',
    questions: [],
    submitting: false,
    loading: true,
    source: 'cloud'
  },

  onLoad(options) {
    const sessionId = options.sessionId || 'DEMO-SESSION';
    this.setData({ sessionId });
    this.initQuestions(sessionId);
  },

  async initQuestions(sessionId) {
    this.setData({ loading: true });

    if (wx.cloud) {
      try {
        const res = await wx.cloud.callFunction({
          name: 'getSession',
          data: { code: sessionId }
        });
        const result = res && res.result;
        if (result && result.ok && result.questions) {
          this.setData({
            questions: result.questions,
            loading: false,
            source: 'cloud'
          });
          return;
        }
      } catch (err) {
        console.error('getSession error', err);
      }
    }

    const saved = wx.getStorageSync('sessionPayload');
    if (saved && saved.session && saved.session.code === sessionId) {
      this.setData({
        questions: saved.questions || [],
        loading: false,
        source: 'local'
      });
    } else {
      this.setData({
        questions: getMockQuestions(),
        loading: false,
        source: 'mock'
      });
    }
  },

  onSelectSingle(e) {
    const { qid, val } = e.currentTarget.dataset;
    this.updateQuestion(qid, val);
  },

  onSelectMulti(e) {
    const { qid, val } = e.currentTarget.dataset;
    const checked = e.detail.value.includes(val);
    const next = this.data.questions.map((q) => {
      if (q.id !== qid) return q;
      const set = new Set(q.value);
      if (checked) set.add(val);
      else set.delete(val);
      return { ...q, value: Array.from(set) };
    });
    this.setData({ questions: next });
  },

  onInputText(e) {
    const { qid } = e.currentTarget.dataset;
    this.updateQuestion(qid, e.detail.value);
  },

  onScore(e) {
    const { qid, val } = e.currentTarget.dataset;
    this.updateQuestion(qid, Number(val));
  },

  updateQuestion(id, value) {
    const updated = this.data.questions.map((q) =>
      q.id === id ? { ...q, value } : q
    );
    this.setData({ questions: updated });
  },

  onSubmit() {
    if (this.data.submitting) return;
    this.setData({ submitting: true });

    // 模拟提交
    setTimeout(() => {
      wx.showToast({ title: '提交成功', icon: 'success' });
      wx.navigateTo({ url: `/pages/report/index?sessionId=${this.data.sessionId}` });
      this.setData({ submitting: false });
    }, 600);
  }
});
