// pages/registerplayer/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ims_userinfo:[],
    status_name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取缓存中的ims用户信息
    var value = wx.getStorageSync('ims_userinfo')
    if (value) {
      //缓存存在
      this.data.ims_userinfo = value;
      console.log(this.data.ims_userinfo)

      //注册球员状态
      //状态    1:一级机构审核中 2:二级机构审核中 3:三级机构审核中 4:审核拒绝 5:审核通过
      let status_name = ''
      if (value.registerplayer_status == 1) {
        status_name = "一级机构审核中"
      }
      else if (value.registerplayer_status == 2) {
        status_name = "二级机构审核中"
      }
      else if (value.registerplayer_status == 3) {
        status_name = "三级机构审核中"
      }
      else if (value.registerplayer_status == 4) {
        status_name = "审核被拒"
      }
      else if (value.registerplayer_status == 5) {
        status_name = "已是注册球员"
      }
      
      //设定数据
      this.setData({
        status_name: status_name
      })
    }
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