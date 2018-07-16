// pages/login_bind/login_bind.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js')
import WxValidate from '../../../utils/WxValidate'
import { req, req_form, validatemobile } from '../../../utils/api.js'


var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn_authcode_title:"获取验证码",
    btn_authcode_disabled:false,
    currentTime:60,
    identifier: "",
    pwd: "",
    mobile: "",
    authcode: "",
    idcard:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    //读取openid
    if (app.globalData.openid=='')
    {
      wx.getStorage({
      key: 'openid',
      success: function (res) {
        app.globalData.openid = res.data
        console.log('readed:'+app.globalData.openid)
        }
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
  
  },
  showModal(error) {
    wx.showModal({
      content: error,
      showCancel: false,
    })
  },
  /**
   * 用户名输入绑定
   */
  identifierInput: function (e) {
    this.setData({
      identifier: e.detail.value
    })
  },
  /**
  * 身份证输入绑定
  */
  idcardInput: function (e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  /**
  * 密码输入绑定
  */
  pwdInput: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  /**
  * 手机输入绑定
  */
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  /**
  * 验证码输入绑定
  */
  authInput: function (e) {
    this.setData({
      authcode: e.detail.value
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  getCode: function (options) {
    var that = this;
    that.setData({
      btn_authcode_disabled: true
    })
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        btn_authcode_title: currentTime + '秒后再获取'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          btn_authcode_title: '获取验证码',
          currentTime: 60,
          btn_authcode_disabled: false
        })
      }
    }, 1000)
  },
  SendSMS_AuthCode:function(e)
  {
    var that=this
    if (!validatemobile(this.data.form.mobile)) {

      wx.showModal({
        content: "请输入正确的手机号码!",
        showCancel: false,
        success: function (res) {
          clearInterval(interval)
          that.setData({
            btn_authcode_title: '获取验证码',
            currentTime: 60,
            btn_authcode_disabled: false
          })
        }
      })
      return
    }
    
    if (this.data.btn_authcode_disabled == true) {
      console.log('btn_authcode_disabled');
    }
    else {
      console.log('ok');
      this.getCode();
      //Todo获取验证码
      req_form(app.globalData.WebApiURL, "/api/common/SendVerify", { mobilephone: this.data.form.mobile }, "Post", true)
        .then(res => {
          console.log(res)
          if (res.statusCode == "200") {
          }
          else {
            wx.showModal({
              content: "请输入正确的手机号码",
              showCancel: false,
              success: function (res) {
                clearInterval(interval)
                that.setData({
                  btn_authcode_title: '获取验证码',
                  currentTime: 60,
                  btn_authcode_disabled: false
                })
              }
            })
          }
        })
        .catch(error => {
        })
        .finally(res => {
        })
    }
  },
  //绑定微信账号与ims账号
  DoLogin_Bind:function(e)
  {
    var that = this;
    // //账号
    // if (that.data.identifier=='')
    // {
    //   // wx.showToast({
    //   //   title: '请输入账号',
    //   //   image: '../../images/alert.png',
    //   //   duration: 2000
    //   // })
    //   this.showModal('请输入账号');
    //   return;
    // }

    // //密码
    // if (that.data.pwd == '') {
    //   // wx.showToast({
    //   //   title: '请输入密码',
    //   //   image: '../../images/alert.png',
    //   //   duration: 2000
    //   // })
    //   this.showModal('请输入密码');
    //   return;
    // }
    //身份证
    if (that.data.idcard == '') {
      this.showModal('请输入身份证');
      return;
    }
    //手机
    if (that.data.mobile == '') {
      // wx.showToast({
      //   title: '请输入手机',
      //   image: '../../images/alert.png',
      //   duration: 2000
      // })
      this.showModal('请输入手机');
      return;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(that.data.mobile)) {
      // wx.showToast({
      //   title: '手机格式不正确',
      //   image: '../../images/alert.png',
      //   duration: 2000
      // })
      this.showModal('手机格式不正确');
      return;
    }

    //验证码
    if (that.data.authcode == '') {
      // wx.showToast({
      //   title: '请输入验证码',
      //   image: '../../images/alert.png',
      //   duration: 2000
      // })
      this.showModal('请输入验证码');
      return;
    }
    wx.request({
      url: app.globalData.WebApiURL + '/api/auth/local/Login_BindWechat_idcard',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openid: app.globalData.openid,
        unionid: "",
        idcard: that.data.idcard,
        mobile: that.data.mobile,
        authcode: that.data.authcode
      },
      success: res => {
        //请求成功
        //0:绑定失败 1:绑定成功 2:该账号已经绑定了微信 3:该微信已绑定过账号 4:账号或者密码错误
                
        if(res.data.op_result==1)
        {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          })
        }
        else 
        {
          // wx.showToast({
          //   title: res.data.message,
          //   image: '../../images/error.png',
          //   duration: 2000
          // })
          this.showModal(res.data.message);
        }
        console.log(res.data);
      },
      fail: res => {
        console.log('DoLogin_Bind fail');
      },
      complete: res => {
        console.log('DoLogin_Bind complete');
      }
    })
  }
})