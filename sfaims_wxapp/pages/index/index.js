//index.js  
// var wxRequest = require('../../utils/api')
// import { request } from '../../plugin/wx-promise-request';
// import { req } from '../../utils/api'

//获取应用实例  
var app = getApp()
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    clientHeight:0,
    // tab切换  
    currentTab: 0,
    movies: [
      { pid: 1, url: 'http://img04.tooopen.com/images/20130712/tooopen_17270713.jpg' },
      { pid: 2, url: 'http://img04.tooopen.com/images/20130617/tooopen_21241404.jpg' },
      { pid: 3, url: 'http://img04.tooopen.com/images/20130701/tooopen_20083555.jpg' },
      { pid: 4, url: 'http://img02.tooopen.com/images/20141231/sy_78327074576.jpg' }
    ]
  },
  onLoad: function () {
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          clientHeight: res.windowHeight
        });
      }
    });
    // req(app.globalData.WebApiURL, "/api/organization?level=4", [], "GET", true)
    // .then(res => console.log(res))
    // .catch(error => console.error(error))
    // .finally(res=>{console.log('finally')})

    // request({
    //   url: app.globalData.WebApiURL + "/api/organization",
    //   data: [],
    //   header: {
    //     'content-type': 'application/json',
    //   },
    //   method:'GET'
    // })
    //   .then(res => console.log(res))
    //   .catch(error => console.error(error))
    //   .finally(res => console.log(res))

    // wxRequest.req_promise(
    //   {'Content-Type': 'application/json'},
    //   "get",
    //   app.globalData.WebApiURL+"/api/organization",
    //   []).then(res => {
    //     console.log(res)
    //   }).catch(res => {
    //     console.log(res)
    //   }).finally(res=>
    //   {console.log('finallys')})


  },
 
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
}) 