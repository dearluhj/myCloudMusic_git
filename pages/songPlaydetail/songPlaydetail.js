// pages/songPlaydetail/songPlaydetail.js
import request from "../../utils/request"
import PubSub from "pubsub-js"
import dayjs from "dayjs"
//记录进度条坐标
let barX, barY;
Page({
  //获取音乐详细信息
  async getMusicdetail() {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    let musicDetail = await request("/song/detail", {
      ids: this.data.musicId
    });
    this.setData({
      musicDetail,
      currentPlaytime: dayjs(0).format("mm:ss"),
      musicTotaltime: dayjs(musicDetail.songs[0].dt).format("mm:ss"),
      progressBarlength: 0
    })
    this.getMusicurl();
  },
  //初始化音乐实例
  initMusicmanager() {
    //创建音乐播放实例
    this.musicManager = wx.getBackgroundAudioManager();
    //挂在监听器
    this.musicManager.onPlay(() => {
      this.setData({
        isPlay: true
      })
    })
    this.musicManager.onPause(() => {
      this.setData({
        isPlay: false
      })
    })
    this.musicManager.onStop(() => {
      this.setData({
        isPlay: false
      })
    })
    this.musicManager.onEnded(() => {
      this.handleSwitchmusic();
    })
    this.musicManager.onTimeUpdate(() => {
      //更改进度条长度
      let progressBarlength;
      progressBarlength = (this.musicManager.currentTime / this.musicManager.duration * 420).toFixed(2);
      this.setData({
        currentPlaytime: dayjs(this.musicManager.currentTime * 1000).format("mm:ss")
      });
      if (!this.data.progressIsmove) {
        this.setData({
          progressBarlength
        });
      }
    })
  },
  //获取音乐播放地址
  async getMusicurl() {
    let musicUrl = await request("/song/url", {
      id: this.data.musicId
    })
    this.setData({
      musicUrl: musicUrl.data
    })

    //播放音乐
    this.musicManager.src = this.data.musicUrl[0].url;
    this.musicManager.title = this.data.musicDetail.songs[0].name;
    //修改isplay状态
    this.setData({
      isPlay: true
    });
    wx.hideLoading()
  },
  //切换歌曲/上一首或下一首
  handleSwitchmusic(e = "next") {
    PubSub.publish("musicSwitchtype", e.currentTarget ? e.currentTarget.dataset.name : e);
    PubSub.subscribe("getMusicid", (msg, data) => {
      //修改当前播放音乐id
      wx.$map.set("currentPlayid", data.id)
      this.setData({
        musicId: data.id
      });
      //获取音乐信息
      this.getMusicdetail();
      PubSub.unsubscribe("getMusicid");
    })
  },
  // 更改音乐播放状态
  handleMusicPlay() {
    this.setData({
      isPlay: !this.data.isPlay
    })
    if (this.data.isPlay) {
      this.musicManager.play();
    } else {
      this.musicManager.pause();
    }
  },
  //进度条滑动
  handleProgressin(e) {
    barX = (e.currentTarget.offsetLeft) * 2;
    this.setData({
      progressIsmove: true
    })
  },
  handleProgressmove(e) {
    let currentX = (e.touches[0].clientX) * 2;
    let barWidth = currentX - barX;

    (barWidth > 420) && (barWidth = 420);
    (barWidth < 0) && (barWidth = 0);
    this.setData({
      progressBarlength: barWidth
    });
  },
  handleProgressout(e) {
    let seektime = parseInt((this.data.progressBarlength / 420) * this.musicManager.duration);
    this.musicManager.seek(seektime);
    this.setData({
      progressIsmove: false
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //音乐是否播放中
    musicId: 0,
    musicDetail: {},
    musicUrl: [],
    currentMusicindex: 0, //当前播放列表索引值
    currentPlaytime: "", //当前播放时长、
    musicTotaltime: "", //音乐总时长
    progressBarlength: 0, //进度条长度
    progressIsmove: false //进度条拖动中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      musicId: wx.$map.get("currentPlayid")
    });
    this.getMusicdetail();
    this.initMusicmanager();
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