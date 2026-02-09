const demoQuestions = [
  { id: 'q1', title: '培训主题是否清晰？', typeLabel: '单选' },
  { id: 'q2', title: '需要改进的环节', typeLabel: '多选' },
  { id: 'q3', title: '整体打分', typeLabel: '评分' }
];

Page({
  data: {
    session: {
      name: 'AI赋能实践班',
      code: 'DEMO-SESSION',
      start: '',
      end: ''
    },
    questions: demoQuestions
  },

  onFieldChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [`session.${key}`]: e.detail.value });
  },

  onDateChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [`session.${key}`]: e.detail.value });
  },

  saveSession() {
    wx.showToast({ title: '保存占位，可接后端/云函数', icon: 'none' });
  },

  addQuestion() {
    wx.showToast({ title: '可跳转到题库编辑页面', icon: 'none' });
  }
});
