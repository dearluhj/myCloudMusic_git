// pages/search/search.js
import request from "../../utils/request"
let suggestTimer; //防抖
Page({
  handleInput(e) {
    this.getSearchsuggest();
  },
  //获取热搜榜数据
  async getTopsearchlist() {
    let list = await request("/search/hot/detail");
    this.setData({
      topSearchlist: list.data
    })
  },
  //获取默认搜索
  async getDefaultsearch() {
    let res = await request("/search/default");
    this.setData({
      defaultSearch: res.data.showKeyword
    })
  },
  //获取搜索建议
  async getSearchsuggest() {
    //防抖
    if (suggestTimer) {
      clearTimeout(suggestTimer);
    }
    suggestTimer = setTimeout(async () => {
      if (this.data.searchValue) {
        let suggestList = await request("/search/suggest", {
          keywords: this.data.searchValue,
          type: 'mobile'
        });
        this.setData({
          searchSuggestlist: suggestList.result
        });
      } else {
        this.setData({
          searchSuggestlist: {}
        });
      }
    }, 300);
  },
  //搜索
  goSearch() {
    //写入搜索记录
    let historyList = this.data.searchHistorylist || [],
      index;
    index = historyList.findIndex((item) => {
      return item.value === this.data.searchValue;
    })
    if (index !== -1) {
      historyList.splice(index, 1);
    }

    historyList.unshift({
      value: this.data.searchValue,
      timeStamp: Date.now()
    });
    this.setData({
      searchHistorylist: historyList
    })
    wx.setStorageSync('search_history', historyList);
  },
  //删除历史记录
  clearHistory() {
    wx.showModal({
      title: '删除历史记录提醒',
      content: '是否确认删除所有？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            searchHistorylist:[]
          });
          wx.removeStorageSync('search_history');
        }
      }
    })
  },
  //获取搜索历史记录
  getsearchHistory() {
    let reslist = wx.getStorageSync('search_history');
    this.setData({
      searchHistorylist: reslist
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    topSearchlist: [],
    defaultSearch: '',
    searchSuggestlist: {},
    searchHistorylist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTopsearchlist();
    this.getDefaultsearch();
    this.getsearchHistory();
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