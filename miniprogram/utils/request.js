const BASE_URL = '';

export function request({ url, method = 'GET', data = {}, header = {} }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header,
      success: (res) => resolve(res.data),
      fail: reject
    });
  });
}

export function withAuth(headers = {}) {
  // 可在此注入登录态（如云开发 token 或后端 session）
  return {
    ...headers
  };
}
