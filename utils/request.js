import config from "./config";
export default (url, data = {}, headerres = {}, method = 'GET') => {
  let cookie = wx.getStorageSync('userCookie'),
    header;
  if (cookie) {
    header = {
      cookie,
      ...headerres
    }
  } else {
    header = {
      ...headerres
    }
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header,
      success: (res) => {
        if (data.isLogin && res.cookies.length) {
          wx.setStorage({
            key: "Cookies",
            data: JSON.stringify(res.cookies),
            encrypt: false
          })
          wx.setStorage({
            key: "userCookie",
            data: res.cookies.find((item) => item.indexOf("MUSIC_U=") >= 0)
          })
        }
        if (res.statusCode.toString()[0] != '2') {
          reject(res.statusCode);
        } else {
          resolve(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}