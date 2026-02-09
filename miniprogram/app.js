const ENV_ID = '请填写你的云环境ID';

App({
  globalData: {
    userInfo: null,
    sessionId: '',
    role: 'student',
    envId: ENV_ID
  },
  onLaunch() {
    if (!wx.cloud) {
      console.error('基础库低于 2.2.3，无法使用云开发');
      return;
    }
    wx.cloud.init({
      env: ENV_ID,
      traceUser: true
    });
    console.log('AI培效通小程序启动，使用云环境：', ENV_ID);
  }
});
