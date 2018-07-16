// pages/new_registerplayer/new_registerplayer.js
const app = getApp()
const util = require('../../../utils/util.js')
import WxValidate from '../../../utils/WxValidate'
import { req, req_form, validatemobile } from '../../../utils/api.js'
var owerId = '33aef7e0ac1b11e6af9f142d27fd7e9e';
var albumId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    org_id:"",
    org_name:"",
    invitecode:"",

    form: {
      id:"",
      mobile: '',         //手机
      authcode: '',       //验证码
      pwd: '',             //密码
      idcard: '',          //身份证
      username: '',        //用户名
      province: 0,  //省份
      district: 0,  //区县
      household: 0,  //户籍
      birthdate: util.formatDate(new Date()), //生日
      wechat: '',          //微信
      mail: '',            //邮件
      education: '',       //教育程度
      height: '',          //身高
      weight: '',          //体重
      isAgree: false,       //同意契约
      guardian_name:"",
      guardian_idcard:"",
      guardian_relation:""
    },
    household: [
      // { province_id: "0", province_name: '-请选择-' },
    ],
    //协议
    isAgree: false,
    //是否成年
    showguardian:false,
    provincesIndex: 0,  //省份index
    districtsIndex: 0,  //区县index
    householdIndex: 0,  //户籍index
    files2: [],
    files2_maxlen:3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
    //得到注册机构
    this.setData({
      org_id: options.org_id,
      org_name: options.org_name,
      invitecode: options.invitecode
    })

    //初始化户籍所在地选项
    this.GetHousehold()
    
    //获取缓存中的ims用户信息
    var value = wx.getStorageSync('ims_userinfo')
    if (value) {
      var date = new Date(value.birth);
     
      //缓存存在
      console.log(that.data.household[0]);
      //设定数据
      that.setData({
        form: value,
        "form.birth": date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        householdIndex: that.data.household.indexOf(that.data.household.find(e => e.province_id == value.province)),
        showguardian: value.user_age>=18?false:true
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
      content: error.msg,
      showCancel: false,
    })
  },
  //Form提交
  submitForm(e) {
    const params = e.detail.value
    var that=this;
    this.initValidate();
    console.log(that.data.files2);
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    //显示等待框
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    
    //进行用户注册是申请
    var data=
      {
          org_id:this.data.org_id,
          org_name: this.data.org_name,
          invitecode: this.data.invitecode,
          idcard: params.idcard,          //身份证
          username: params.username,      //姓名 
          household: this.data.household[params.household].province_id,   //户籍
          birth: params.birth,        //生日
          wechat: params.wechat,          //微信
          email: params.mail,             //邮件
          education: params.education,    //教育程度
          height: params.height,          //身高
          weight: params.weight,           //体重
          guardian_idcard: params.guardian_idcard,
          guardian_name: params.guardian_name,
          guardian_relation: params.guardian_relation
      }
    
    console.log(data);
    var userid = app.globalData.ims_userinfo.id;
    req(app.globalData.WebApiURL, "/api/service/Add_Recorderplayer/" + userid,data, "Post")
    .then(res => {
     
      if (res.statusCode == "200") {
        // 成功
        // 上传监护人附件
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var length = that.data.files2.length; //总共个数
        var i = 0; //第几个
        that.uploadDIY(that.data.files2, successUp, failUp, i, length);

        //消息框
        wx.showModal({
          title: '',
          content: '提交成功',
          showCancel: false,
          success: function (res) {
            

            //切换tab至我的信息
            wx.switchTab({
              url: '../myinfos/myinfos',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          }
        })
        
      }
      else {
        //其他错误
        console.log(res)
        // wx.showModal({
        //   title: '',
        //   content: res.data.message,
        //   showCancel: false
        // })
      }
    })
    .catch(error => {
      console.error(error)
      
    })
    .finally(res => {
      wx.hideLoading()
    })
    
  },
  //户籍变化
  bindHouseholdChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      householdIndex: e.detail.value
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
    var sdate = new Date(e.detail.value.replace(/-/g, "/"));
　　var now = new Date();
　　var days = now.getTime() - sdate.getTime();
　　var age = parseInt(days / (1000 * 60 * 60 * 24)/365); 

    console.log(age)
    this.setData({
      'form.birth': e.detail.value,
      showguardian: age<18?true:false
    })

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
        // for (var i = 0, len = value.length; i < len; i++) {
        //   that.data.household.push(value[i]);
        // }
        
        that.setData({
          household: value,
          householdIndex: value.indexOf(value.find(e => e.province_id == that.data.form.province))
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
              // for (var i = 0, len = res.data.length; i < len; i++) {
              //   that.data.household.push(res.data[i]);
              // }
              that.setData({
                household: res.data,
                householdIndex: res.data.indexOf(res.data.find(e => e.province_id == that.data.form.province))
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
  uploadDIY: function (filePaths, successUp, failUp, i, length) {
    console.log("uploadDIY")
    wx.uploadFile({
      url: app.globalData.WebApiURL +"/api/upload/upload_guardian",
      filePath: filePaths[i],
      name: 'fileData',
      formData: {
        'id': app.globalData.ims_userinfo.id,
        'attachname': "attach"+i+1
      },
      success: (res) => {
        console.log(res)
        successUp++;
      },
      fail: (res) => {
        console.log(res)
        failUp++;
      },
      complete: () => {
        console.log("upload complete")
        i++;
        if (i == length) {
          // wx.showToast({
          //   title: '总共' + successUp + '张上传成功,' + failUp + '张上传失败！',
          // })
        }
        else {  //递归调用uploadDIY函数
          this.uploadDIY(filePaths, successUp, failUp, i, length);
        }
      },
    })
  },
  chooseImage2: function (e) {
    var that = this;

    if (that.data.files2.length >= that.data.files2_maxlen)
    {
      wx.showModal({
        content: "最多只能上传3个附件!",
        showCancel: false,
      })
      return;
    }
    wx.chooseImage({
      count: 3 - this.data.files2.length,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有'original',
      sourceType: ['album', 'camera'],      // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files2: that.data.files2.concat(res.tempFilePaths)
        });
        // console.log(res.tempFilePaths)
        // var successUp = 0; //成功个数
        // var failUp = 0; //失败个数
        // var length = res.tempFilePaths.length; //总共个数
        // var i = 0; //第几个
        // that.uploadDIY(res.tempFilePaths, successUp, failUp, i, length);
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,  // 当前显示图片的http链接
      urls: this.data.files2        // 需要预览的图片http链接列表
    })
  },
  longTapImg:function(e)
  {
    //householdIndex: that.data.household.indexOf(that.data.household.find(e => e.province_id == value.province)),
    console.log(e.currentTarget.dataset.src)
    var that=this
    wx.showActionSheet({
      itemList: ['删除图片'],
      success: function (res) {
        let item_indx = that.data.files2.indexOf(that.data.files2.find(x => x == e.currentTarget.dataset.src));
        console.log(item_indx)
        that.data.files2.splice(item_indx,1)
        that.setData({
          files2: that.data.files2
        });
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //初始化验证
  initValidate() {
    console.log("this.showguardian-" + this.data.showguardian)
    // 验证字段的规则
    const rules = {
      idcard: {
        required: true,
        idcard: true
      },
      username: {
        required: true,
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
      guardian_name: {
        required: this.data.showguardian
      },
      guardian_idcard: {
        required: this.data.showguardian
      },
      guardian_relation: {
        required: this.data.showguardian
      },
      isAgree: {
        required: true
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {

      idcard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },
      username: {
        required: '请输入姓名'
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
      },
      guardian_name: {
        required: '请输入监护人姓名'
      },
      guardian_idcard: {
        required: '请输入监护人身份证'
      },
      guardian_relation: {
        required: '请输入监护人关系'
      }
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  }
})