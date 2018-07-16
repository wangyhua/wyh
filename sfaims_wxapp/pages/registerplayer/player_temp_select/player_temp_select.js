//registerplayer/player_temp_select/player_temp_select.js
const app = getApp()
const util = require('../../../utils/util.js')
import WxValidate from '../../../utils/WxValidate'
import { req } from '../../../utils/api.js'
import { req_form } from '../../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      invitecode: ''         //邀请码
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //显示等待框
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    //判断是否提交过注册申请
    //获取缓存中的ims用户信息
    var value = wx.getStorageSync('ims_userinfo')
    if (value) {
     
      if (value.registerplayer != null && value.registerplayer!="")
      {
        wx.showModal({
          content: "已提交过注册申请，无需重复提交",
          showCancel: false,
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    }

    //判断是是否在窗口期
    req(app.globalData.WebApiURL, "/api/common/GetTimewindow", [], "GET", true)
      .then(res => {
        console.log(res)
        if (res.statusCode == "200") {
          
        }
        else if (res.statusCode == "204") {
      
          wx.showModal({
            content:"当前不在窗口期，无法成为注册球员",
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
        else {
          //其他错误
          this.showModal({ msg: "其他错误:" + res.errMsg })
        }
      })
      .catch(error => {
        console.error(error)
      })
      .finally(res => {
        wx.hideLoading()
      })

    this.initValidate()
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
  
  },
  //初始化验证
  initValidate() {
    // 验证字段的规则
    const rules = {
      invitecode: {
        required: true,
        minlength: 6
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      invitecode: {
        required: '请输入邀请码',
        minlength: '邀请码长度不少于6位'
      }
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  //Form提交
  submitForm(e) {

    const params = e.detail.value

    // console.log(params)
    // console.log(app.globalData.openid);


    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    //显示等待框
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })

    //判断邀请码
    req(app.globalData.WebApiURL, "/api/organization?invitecode=" + params.invitecode, [], "GET", true)
    .then(res => {
      console.log(res)
      if (res.statusCode == "200") {
        //邀请码存在
        console.log(res.data[0].org_id);
        wx.navigateTo({
          // url: '../new_registerplayer/new_registerplayer'
          url: '/pages/registerplayer/new_registerplayer/new_registerplayer'
              + '?org_id=' + res.data[0].org_id 
              + '&org_name=' + res.data[0].org_name
              + '&invitecode=' + params.invitecode
        })
      }
      else if (res.statusCode=="204")
      {
        //邀请码不存在
        this.showModal({ msg: "邀请码不存在!" })
      }
      else{
        //其他错误
        this.showModal({ msg: "其他错误:"+res.errMsg })
      }
    })
    .catch(error =>{
      console.error(error)
    })
    .finally(res=>{
      console.log('finally')
      wx.hideLoading()
    })

  },
})