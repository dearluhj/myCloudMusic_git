// pages/video/video.js
import request from "../../utils/request";
let videoMap = new Map(); //记录视频播放信息
Page({
  // 初始化页面信息
  async getInitializeMsg() {
    let cookie = wx.getStorageSync('userCookie');
    if (cookie) {
      let tabres = await request("/video/category/list", {
        timestamp: Date.now()
      }, {}, "post");

      this.setData({
        videoTablist: tabres.data,
        navId: tabres.data[0].id
      });
      this.getVideolist(this.data.navId);
    } else {
      wx.showToast({
        title: '您还未登录',
        icon: 'error',
        success() {
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/login/passwordlogin/login',
            })
          }, 1000);
        }
      }, 1000)
    }
  },
  //标签栏id绑定
  handleNav(e) {
    let navId = e.target.dataset.id;
    if (e.target.dataset.name == "text") {
      this.setData({
        navId,
        videoList: [],
        videoOffset: 0 //分页信息归零
      });
      this.getVideolist(navId);
    }
  },
  async getVideolist(id, offset = 0, addlist = false) {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    let videolistres = await request("/video/group", {
      id,
      offset,
      timestamp: Date.now()
    });
    videolistres.datas.forEach(item => {
      item.id = item.data.vid || item.data.id;
    });

    let videofewlist = this.data.videoList;
    //当前是否为累加视频请求
    (offset && addlist) ? videofewlist.push(...videolistres.datas): videofewlist = videolistres.datas;
    //获取视频地址
    for (let i = 0; i < videofewlist.length; i++) {
      let videoUrl;
      //mv视频的url获取地址与其他的不同,MV的id为1000
      if (id === 1000) {
        videoUrl = await request("/mv/url", {
          id: videofewlist[i].data.id
        })
        videofewlist[i].urls = videoUrl.data;
      } else {
        videoUrl = await request("/video/url", {
          id: videofewlist[i].data.vid
        })
        videofewlist[i].urls = videoUrl.urls[0];
      }
    }
    this.setData({
      videoList: videofewlist,
      isTriggered: false //下拉刷新已完成
    })
    wx.hideLoading();
  },
  //点击视频或图片时更改当前data内播放视频id
  changeVideostatus(e) {
    this.setData({
      videoPlayid: e.currentTarget.dataset.id
    });
  },
  //记录视频播放时间信息
  videoTimerecord(e) {
    videoMap.set(e.currentTarget.dataset.id, e.detail.currentTime);
    this.setData({
      videoTimerecordlist: videoMap
    })
  },
  handleVideopalytime(e) {
    let playtime = this.data.videoTimerecordlist ? this.data.videoTimerecordlist.get(e.currentTarget.dataset.id) : 0;
    if (!playtime) playtime = 0;
    let videoObj = wx.createVideoContext(e.currentTarget.dataset.id);
    videoObj.seek(playtime);
  },
  //视频列表下拉刷新
  updateScrollview() {
    this.getVideolist(this.data.navId);
  },
  //下拉加载更多视频
  addScrollviewvideo() {
    this.setData({
      videoOffset: this.data.videoOffset + 1
    });
    this.getVideolist(this.data.navId, this.data.videoOffset, true);
  },
  /**
   * 页面的初始数据
   */
  data: {
    videoTablist: [],
    navId: 0,
    videoList: [], //视频总数据
    videoOffset: 0, //视频页数
    videoPlayid: '',
    videoTimerecordlist: '',
    isTriggered: false //当前下拉刷新是否已完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInitializeMsg();
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
  onShareAppMessage(from) {
    return {
      title:"网易云音乐",
      path:"/pages/video/video",
      imageUrl:"/static/image/video/logo.png"
    }
  }
})