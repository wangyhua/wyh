// pages/login/login/login.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBtnView:true,
    showBindView: false,
    showBindBView2:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    //showView: (options.showView == "true" ? true : false)

    // var time = util.formatTime(new Date())
    // console.log(time);
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
    
    // wx.request({
    //   url: app.globalData.WebApiURL+'/api/auth/local',
    //   data: {
    //     openid: ''
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })  
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
  
  },
  /**
   * 用户点击右上角分享
   */
  doBind: function (e) {
    wx.navigateTo({
      url: '../login_bind/login_bind'
    })
  },
  doReg: function (e) {
    wx.navigateTo({
      url: '../login_regnew/login_regnew'
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  }
})