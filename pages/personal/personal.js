// pages/personal/personal.js
import request from "../../utils/request"
let startCoordY = 0,
  offsetCoordY = 0;
Page({
  handlestart(e) {
    startCoordY = e.touches[0].clientY;
    this.setData({
      coverTransition: 0
    })
  },
  handlemove(e) {
    let currentY = e.touches[0].clientY;
    offsetCoordY = currentY - startCoordY;
    if (offsetCoordY < 0) {
      return;
    }
    if (offsetCoordY > 80) {
      offsetCoordY = 80
    }
    this.setData({
      coverTransform: offsetCoordY
    })

  },
  handlecancel() {
    this.setData({
      coverTransform: 0,
      coverTransition: 0.6
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 0,
    coverTransition: 0,
    userInfo: {},
    userPlayrecord: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取指定cookie
    let cookie = wx.getStorageSync('userCookie');
    if (cookie) {
      this.updateUsercurrentInfo();
    }
  },
  //更新用户信息
  async updateUsercurrentInfo() {
    let _this = this;
    let res = await request("/login/status", {
      timestamp: Date.now()
    }, {}, "post");
    if (res.data.profile) {
      //更新用户数据信息
      wx.setStorage({
        key: "userInfo",
        data: JSON.stringify(res.data.profile),
        encrypt: true,
        success() {}
      })
      //获取userInfo数据
      wx.getStorage({
        key: "userInfo",
        encrypt: true,
        success(res) {
          _this.setData({
            userInfo: JSON.parse(res.data)
          })
          //执行数据更新相关操作
          _this.getUserPlayrecord()
        }
      })
    }
  },
  //获取最近播放信息
  async getUserPlayrecord() {
    let uid = this.data.userInfo.userId;
    let recordres = await request("/user/record", {
      uid,
      type: 1
    }, {}, "post");
    recordres.weekData.splice(10);
    recordres.weekData.map((item, index) => {
      item.id = index
    })
    this.setData({
      userPlayrecord: recordres.weekData
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})