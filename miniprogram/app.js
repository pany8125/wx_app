const ENV_ID = 'cloudbase-8gkmuei9c5912973';

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
