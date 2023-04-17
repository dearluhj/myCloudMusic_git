// pages/login/passwordlogin/login.js
Page({
  loginVerify() {
    let {
      phone,
      password
    } = this.data;
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'error',
        duration: 2000
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'error',
        duration: 2000
      })
      return;
    }
    let reg = /^1[3-9]\d{9}$/;
    if (!reg.test(phone)) {
      wx.showToast({
        title: '手机号格式有误',
        icon: 'error',
        duration: 2000
      })
      return;
    }
    wx.showToast({
      title: '验证成功',
      icon: 'success',
      duration: 2000
    })

  },
  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  },
  //空回调
  donotcare(){}
})