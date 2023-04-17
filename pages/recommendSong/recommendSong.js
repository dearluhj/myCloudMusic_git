// pages/recommendSong/recommendSong.js
import request from "../../utils/request"
import PubSub from "pubsub-js"
Page({
  async getrecommendSonglist() {
    let songList = await request("/recommend/songs", {}, {}, "post");
    this.setData({
      recommendSonglist: songList.data
    })
  },
  //跳转到音乐播放页面
  handletosongPlaydetail(e) {
    let {
      id,
      index
    } = e.currentTarget.dataset;
    //写入id信息到$map对象中
    wx.$map.set("currentPlayid", id);
    //将当前播放音乐列表的索引值存入data
    this.setData({
      musicIndex: index
    })
    wx.navigateTo({
      url: '/pages/songPlaydetail/songPlaydetail',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    today: new Date().getDate(),
    recommendSonglist: [],
    musicIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //判断是否已登录
    let cookie = wx.getStorageSync('userCookie');
    if (!cookie) {
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        success() {
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/login/passwordlogin/login',
            })
          }, 1000);
        }
      }, 1000)
    } else {
      this.getrecommendSonglist();
      //消息订阅，接收来自播放页面切换歌曲的信息
      PubSub.subscribe("musicSwitchtype", (msg, type) => {
        let {
          musicIndex,
          recommendSonglist
        } = this.data;
        //判断切换操作
        if (type === "next") {
          (musicIndex === recommendSonglist.dailySongs.length - 1) && (musicIndex = -1);
          musicIndex++;
        } else {
          (musicIndex === 0) && (musicIndex = recommendSonglist.dailySongs.length);
          musicIndex--;
        }
        //更新index
        this.setData({
          musicIndex,
        })
        //页面发送消息
        PubSub.publish("getMusicid", {
          id: recommendSonglist.dailySongs[musicIndex].id,
          index: musicIndex
        });
      })
    }
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

  }
})