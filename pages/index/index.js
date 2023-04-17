import request from "../../utils/request"
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    personalList: [],
    toprankList: [],
    toprankIndex: 0,
    toprankTotal: 5
  },

  aclick: function () {
    console.log(123456);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerData, personalData;
    try {
      [bannerData, personalData] = await Promise.all([request('/banner', {
        type: 1
      }), request('/personalized', {
        limit: 10
      })])
    } catch (error) {
      console.log(error);
    }

    this.setData({
      bannerList: bannerData,
      personalList: personalData
    })
    let toprankData = [],
      arr;

    arr = await request('/toplist/detail')
    //取前六个数据
    arr.list.splice(6);
    arr.list.forEach(async item => {
      let res;
      res = await request("/playlist/detail", {
        id: item.id
      })
      //留前三个
      res.playlist.tracks.splice(3)
      toprankData.push(res.playlist);
      this.setData({
        toprankList: toprankData
      })
    })


  },
  //测试函数
  handletest() {
    // wx.checkSession({
    //   success(res) {
    //     console.log(res);
    //   }
    // })
    wx.login({
      success: (res) => {
        console.log(res);
      },
    })
    let app = wx.getAccountInfoSync()
    // console.log(app);
    // wx.getUserProfile({
    //   desc: '完善用户信息',
    //   success(res) {
    //     console.log(res);
    //   }
    // })
    wx.scanCode({
      success(res){
        console.log(res);
      }
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