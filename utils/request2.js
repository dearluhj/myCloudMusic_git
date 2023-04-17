import config from "./config";

function request(url, data = {}, method = 'GET') {
  let res;
  (async function () {
    res = await new Promise((resolve, reject) => {
      wx.request({
        url: config.host + url,
        data,
        method,
        success: (res) => {
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
  })()
  return res;
}
export default (url, data = {}, method = 'GET') => {
  return request(url, data, method)
}