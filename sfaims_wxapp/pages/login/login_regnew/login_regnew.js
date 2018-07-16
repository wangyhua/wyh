// pages/login/login_regnew/login_regnew.js
const app = getApp()
const util = require('../../../utils/util.js')
import WxValidate from '../../../utils/WxValidate'
import { req, req_form, validatemobile } from '../../../utils/api.js'


validatemobile
var interval = null //倒计时函数

Page({

  /**
   * 页面的初始数据
   */
  data: {
      //Form字段
      form: {
        mobile: '',         //手机
        authcode: '',       //验证码
        pwd:'',             //密码
        idcard:'',          //身份证
        username:'',        //用户名
        provinces: 0,  //省份
        districts: 0,  //区县
        household: 0,  //户籍
        provincesIndex: 0,  //省份
        districtsIndex: 0,  //区县
        householdIndex: 0,  //户籍
        birth: util.formatDate(new Date()), //生日
        wechat:'',          //微信
        mail:'',            //邮件
        education:'',       //教育程度
        height:'',          //身高
        weight:'',          //体重
        isAgree:false       //同意契约
      },
      
      

      //获取验证码按钮
      btn_authcode_title: "获取验证码",
      btn_authcode_disabled: false,
      currentTime: 60,

      //协议
      isAgree:false,

      //省份
      provinces: [
        { province_id: '0', province_name: '-请选择省市-' },
        { province_id: '310', province_name: '上海' }
      ],

      //区县
      districts: [
        { district_id: '0', province_id: '0', district_name: '-请选择区县-' }
      ],
      
      //户籍
      household: [
        { province_id: '0', province_name: '-请选择-' },
      ],
      read_only:false,
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    //初始化省份选项
    //this.GetProv();
    this.initValidate()
    console.log(this.WxValidate)

    //初始化户籍所在地选项
    this.GetHousehold();

    if (options.readonly=="1")
    {
      this.setData({
        read_only:true
      })

      //获取缓存中的ims用户信息
      var value = wx.getStorageSync('ims_userinfo')
      if (value) {
        var date = new Date(value.birth);

        //缓存存在
        console.log(that.data.household[0]);
        //设定数据
        this.GetDistrictByProv(value.province)

        that.setData({
          form: value
        })

        that.setData({
          "form.birth": date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
          "form.provincesIndex": that.data.provinces.indexOf(that.data.provinces.find(e => e.province_id == value.province)),
          "form.districtsIndex": that.data.districts.indexOf(that.data.districts.find(e => e.district_id == value.district)),
          "form.householdIndex": that.data.household.indexOf(that.data.household.find(e => e.province_id == value.household)),
        })
        
      }
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
      title: '提交中...',
      mask:true
    })

    //进行用户注册
    wx.request({
      url: app.globalData.WebApiURL + '/api/auth/local/WechatReg',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: app.globalData.openid,
        unionid:'',
        account: params.mobile,         //账号(同手机)
        mobilephone: params.mobile,     //手机
        authcode: params.authcode,      //验证码
        password: params.pwd,           //密码
        idcard: params.idcard,          //身份证
        username: params.username,      //姓名
        province: this.data.provinces[this.data.form.provincesIndex].province_id,    //省份
        district: this.data.districts[this.data.form.districtsIndex].district_id,    //区县
        household: this.data.household[this.data.form.householdIndex].province_id,   //户籍
        birth: params.birth,        //生日
        wechat: params.wechat,          //微信
        email: params.mail,             //邮件
        education: params.education,    //教育程度
        height: params.height,          //身高
        weight: params.weight           //体重
      },
      success: res => {
        //1:写入成功 2:该账号已存在 3:身份证已在黑名单 4:写入失败 9:异常错误

        //成功
        if (res.data.op_result == 1) {
          //保存jwt token
          app.globalData.jwt_bearer = res.data.jwt_token;
          //保存用户信息
          app.globalData.ims_userinfo = res.data.user;
          wx.setStorageSync("ims_userinfo", res.data.user);
          //提示框
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000,
          })
          wx.showModal({
            title: '恭喜',
            content: '注册成功!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../myinfos/myinfos',
                  success: function (e) {
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  } 
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        else {
          //失败
          //清理jwt token
          app.globalData.jwt_bearer = "";
          //清理用户信息
          app.globalData.ims_userinfo = [];
          wx.setStorageSync("ims_userinfo", []);
          //提示框
          wx.showModal({
            content: res.data.message,
            showCancel: false,
          })
        }
        console.log(res.data);
      },
      fail: res => {
        //清理jwt token
        app.globalData.jwt_bearer = "";
        //清理用户信息
        app.globalData.ims_userinfo = [];
        wx.setStorageSync("ims_userinfo", []);
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  },
  /**
   * 绑定界面输入
   */
  //手机变化
  bindinput_mobile:function(e)
  {
    this.setData({
      'form.mobile': e.detail.value
    })
  },
  //省份变化
  bindProviceChange: function (e) {
    this.setData({
      'form.provincesIndex': e.detail.value
    })
    this.GetDistrictByProv(this.data.provinces[e.detail.value].province_id)
  },
  //区县变化
  bindDistrictChange: function (e) {
    this.setData({
      'form.districtsIndex': e.detail.value
    })
  },
  //户籍变化
  bindHouseholdChange: function (e) {
    this.setData({
      'form.householdIndex': e.detail.value
    })
  },
  //协议变化
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  //生日变化
  bindDateChange: function (e) {
    this.setData({
      'form.birth': e.detail.value
    })
  },
  //获取验证码倒计时
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
  //获取验证码
  SendSMS_AuthCode: function (e) {
    var that = this
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
            success: function (res)
            {
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
  //获取省份
  GetProv: function () {
    var that = this;      
    //首先从缓存读取
    try {
      var value = wx.getStorageSync('allprov')
      if (value) {
        //缓存存在
        console.log('read province from cache')
        for (var i = 0, len = value.length; i < len; i++) {
          that.data.provinces.push(value[i]);
        }
        that.setData({
          provinces: that.data.provinces
        })
      }
      else
      {
        //缓存不存在，从网络读取
        console.log('read province from server')
        wx.request({
          url: app.globalData.WebApiURL + '/api/common/GetAllProv',
          method: 'Get',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            if (res.data.length>0)
            {
              //保存至缓存
              wx.setStorageSync('allprov', res.data)

              //设置省份数据
              for (var i = 0, len = res.data.length; i < len; i++) {
                that.data.provinces.push(res.data[i]);
              }
              that.setData({
                provinces: that.data.provinces
              })
            }
          },
          fail: function (res) {

          },
          complete: function (res) {

          }
        })
      }
    } catch (e) {

    }
  },
  //获取区县
  GetDistrictByProv: function (province_id){
    console.log('dist_' + province_id);
    var that = this;
    //首先从缓存读取
    try {
      var value = wx.getStorageSync('dist_' + province_id)
      if (value) {
        //缓存存在
        console.log('read dictrict from cache')
        for (var i = 0, len = value.length; i < len; i++) {
          that.data.districts.push(value[i]);
        }
        that.setData({
          districts: that.data.districts
        })
      }
      else {
        //缓存不存在，从网络读取
        console.log('read dictrict from server')
        wx.request({
          url: app.globalData.WebApiURL + '/api/common/GetDistByProv/' + province_id,
          method: 'Get',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.length > 0) {
              //保存至缓存
              wx.setStorageSync('dist_' + province_id, res.data)

              //设置省份数据
              for (var i = 0, len = res.data.length; i < len; i++) {
                that.data.districts.push(res.data[i]);
              }
              that.setData({
                districts: that.data.districts
              })
            }
          },
          fail: function (res) {

          },
          complete: function (res) {

          }
        })
      }
    } catch (e) {

    }
  },
  //获取户籍所在地
  GetHousehold: function () {
    var that = this;
    //首先从缓存读取
    try {
      var value = wx.getStorageSync('household')
      if (value) {
        //缓存存在
        console.log('read household from cache')
        for (var i = 0, len = value.length; i < len; i++) {
          that.data.household.push(value[i]);
        }
        that.setData({
          household: that.data.household
        })
      }
      else {
        //缓存不存在，从网络读取
        console.log('read household from server')
        wx.request({
          url: app.globalData.WebApiURL + '/api/common/GetAllProv',
          method: 'Get',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            if (res.data.length > 0) {
              //保存至缓存
              wx.setStorageSync('household', res.data)

              //设置省份数据
              for (var i = 0, len = res.data.length; i < len; i++) {
                that.data.household.push(res.data[i]);
              }
              that.setData({
                household: that.data.household
              })
            }
          },
          fail: function (res) {

          },
          complete: function (res) {

          }
        })
      }
    } catch (e) {

    }
  },
  //初始化验证
  initValidate() {
    // 验证字段的规则
    const rules = {
      mobile: {
        required: true,
        tel: true
      },
      authcode: {
        required: true,
      },
      pwd: {
        required: true,
        minlength: 6,
        maxlength: 15,
      },
      idcard:{
        required: true,
        idcard: true
      },
      username: {
        required: true,
      },
      province: {
        required: true,
        min: 1,
      },
      district: {
        required: true,
        min: 1,
      },
      household: {
        required: true,
        min: 1,
      },
      birth: {
        required: true,
        dateISO: true
      },
      mail: {
        email: true,
      },
      height: {
        min: 20,
        max: 500
      },
      weight: {
        min: 20,
        max: 500
      },
      isAgree: {
        required: true
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      mobile: {
        required: '请输入手机号',
      },
      authcode: {
        required: '请输入验证码',
      },
      pwd: {
        required: '请输入密码',
        minlength: '密码长度不少于6位',
        maxlength: '密码长度不多于15位',
      },
      idcard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },
      username: {
        required: '请输入姓名'
      },
      province: {
        required: '请选择省份',
        min:'请选择省份'
      },
      district: {
        required: '请选择区县',
        min: '请选择区县'
      },
      household: {
        required: '请选择户籍',
        min: '请选择户籍'
      },
      birth: {
        required: '请输入生日',
        dateISO: '请输入正确的生日日期'
      },
      mail: {
        email: '请输入正确的邮箱'
      },
      height: {
        min: '请输入正确的身高',
        max: '请输入正确的身高'
      },
      weight: {
        min: '请输入正确的体重',
        max: '请输入正确的体重'
      },
      isAgree: {
        required: '请同意我们的条款',
      }
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  }
})