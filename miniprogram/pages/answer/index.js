const { getMockQuestions } = require('../../utils/mock');

Page({
  data: {
    sessionId: '',
    questions: [],
    submitting: false
  },

  onLoad(options) {
    const sessionId = options.sessionId || 'DEMO-SESSION';
    this.setData({ sessionId, questions: getMockQuestions() });
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
