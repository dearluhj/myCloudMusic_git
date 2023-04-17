// pages/login/qrlogin/qrlogin.js
import request from "../../../utils/request"
let timer;
Page({
  getcurrentTime() {
    return Date.now()
  },
  async getqrimage() {
    let date = new Date();
    let key = await request("/login/qr/key", {
      timestamp: this.getcurrentTime()
    }, {});
    key = key.data.unikey;
    let qrimgbase = await request("/login/qr/create", {
      key,
      qrimg: true,
      timestamp: this.getcurrentTime()
    }, {});
    qrimgbase = qrimgbase.data.qrimg;
    this.setData({
      imageUrl: qrimgbase
    })
    if (timer) {
      clearInterval(timer)
    }
    this.checkqrStatus(key);
  },
  checkqrStatus(key) {
    let date = new Date();
    timer = setInterval(async () => {
      let res = await request("/login/qr/check", {
        key,
        timestamp: this.getcurrentTime(),
        isLogin: true
      }, {});

      if (res.code == 802) {
        this.setData({
          qrstatueMsg: "扫码成功，请在手机上确认",
          currentqrStatus: false
        })
      } else if (res.code == 800) {
        clearInterval(timer);
        this.setData({
          qrstatueMsg: "二维码已过期，请点击二维码刷新",
          imageUrl: "/static/image/waiting.png",
          currentqrStatus: true
        })
      } else if (res.code == 803) {
        clearInterval(timer);
        this.setData({
          qrstatueMsg: "授权登录成功",
          currentqrStatus: false
        });

        let statusres = await request("/login/status", {
          timestamp: this.getcurrentTime()
        }, {}, "post");
        wx.setStorage({
          key: "userInfo",
          data: JSON.stringify(statusres.data.profile),
          encrypt: true,
          success() {
            wx.showToast({
              title: '页面即将跳转',
              icon: 'success'
            }, 2000);
          }
        })
        let redirectTime = setTimeout(() => {
          clearTimeout(redirectTime);
          wx.reLaunch({
            url: '/pages/personal/personal',
          })
        }, 2000);
      }
    }, 1000);
  },
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: "",
    currentqrStatus: true,
    qrstatueMsg: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getqrimage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearInterval(timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})