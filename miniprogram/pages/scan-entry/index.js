Page({
  data: {
    sessionId: ''
  },

  onSessionInput(e) {
    this.setData({ sessionId: e.detail.value.trim() });
  },

  handleScan() {
    wx.scanCode({
      success: (res) => {
        const id = res.result || '';
        this.setData({ sessionId: id });
        this.navigateToSession(id);
      },
      fail: () => {
        wx.showToast({ title: '扫码失败，请重试', icon: 'none' });
      }
    });
  },

  handleJoin() {
    const { sessionId } = this.data;
    if (!sessionId) return;
    this.navigateToSession(sessionId);
  },

  navigateToSession(sessionId) {
    wx.navigateTo({
      url: `/pages/answer/index?sessionId=${sessionId}`
    });
  }
});
