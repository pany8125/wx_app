const { getMockReport } = require('../../utils/mock');

Page({
  data: {
    sessionId: '',
    report: getMockReport()
  },

  onLoad(options) {
    const sessionId = options.sessionId || 'DEMO-SESSION';
    this.setData({ sessionId });
  },

  onExport() {
    wx.showToast({ title: '导出占位，可接入云函数生成 PDF/图片', icon: 'none' });
  },

  onShare() {
    wx.showToast({ title: '可接入分享/复制链接', icon: 'none' });
  }
});
