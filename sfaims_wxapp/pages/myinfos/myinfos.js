// pages/myinfos/myinfos.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎使用SFA-IMS',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showBindView: false,
    showMyInfo:false,
    showBanHint:false,
    showBlackhint:false,
    username:'',
    age:'',
    recordplayer_status_name: '',
    registerplayer_status_name:'',
    coach_status_name: ''
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../matchs/matchs'
  //   })
  // },

  onLoad: function () {

    if (app.globalData.userInfo) {
      console.log('if1')
      this.doApiLoginByOpenid()

      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log('if2')
        this.doApiLoginByOpenid()

        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log('if3')
          this.doApiLoginByOpenid()

          app.globalData.userInfo = res.userInfo
          console.log(app.globalData.userInfo);
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow myinfo')
  },
  //获取微信用户信息
  getUserInfo: function (e) {
    this.doApiLoginByOpenid()
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //注册
  doReg: function (e) {
    wx.navigateTo({
      url: '../login/login/login'
    })
  },
  //使用opneid登陆
  doApiLoginByOpenid: function () {
    try {
      //显示loading框
      wx.showLoading({
        title: '请稍候...',
      })
      //从本地缓存中读取openid
      var value = wx.getStorageSync('openid')
      if (value) {
        //读取成功,进行登录
        app.requestByOpenid(value, this.reqOnsuccess, this.reqOnFail, this.reqOnComplete);
      }
    } catch (e) {
      //没读取到
      wx.hideLoading()
    }
  },
  //使用opneid登陆 成功回调
  reqOnsuccess: function (res) {
    //success
    if (res.statusCode == 200) {
      if (res.data.result == 1) {
        //登录成功
        //保存jwt_bearer token
        app.globalData.jwt_bearer = res.data.jwt_token
        wx.setStorageSync("jwt_bearer", res.data.jwt_token)

        //保存用户信息
        app.globalData.ims_userinfo = res.data.user
        wx.setStorageSync("ims_userinfo", res.data.user)
        console.log(res.data.user.birth_formatted)
        
        // let s_name=""
        // if (res.data.user.status == 0)
        // {
        //   s_name ="未备案"
        // }
        // else if (res.data.user.status == 1) {
        //   s_name = "已备案"
        // }
        // else if (res.data.user.status == 2) {
        //   s_name = "已提交注册"
        // }
        // else if (res.data.user.status == 3) {
        //   s_name = "审核中"
        // }
        // else if (res.data.user.status == 5) {
        //   s_name = "已注册"
        // }
        // else if (res.data.user.status == 6) {
        //   s_name = "已激活"
        // }
        // else if (res.data.user.status == 7) {
        //   s_name = "需修改"
        // }
        // else if (res.data.user.status == 8) {
        //   s_name = "未通过"
        // }
        // else if (res.data.user.status == 9) {
        //   s_name = "已封停"
        // }

        //备案球员状态
        let recordplayer_status_name=''
        if (res.data.user.recordplayer_status == 1){
          recordplayer_status_name ="信息已备案"
        }
        else{
          recordplayer_status_name = "信息未备案"
        }
        console.log(res.data.user.registerplayer_status)

        //注册球员状态
        //状态    1:一级机构审核中 2:二级机构审核中 3:三级机构审核中 4:审核拒绝 5:审核通过
        let registerplayer_status_name=''
        if (res.data.user.registerplayer_status == 5) {
          registerplayer_status_name = "已是注册球员"
        }
        else{
          registerplayer_status_name="还不是注册球员"
        }
       
        //显示我的信息页面
        this.setData({
          showMyInfo: true,
          showBindView:false,
          username: res.data.user.username,
          age: res.data.user.user_age,
          recordplayer_status_name: recordplayer_status_name,
          registerplayer_status_name: registerplayer_status_name,
        })
        
      }
      else if (res.data.result == 2) {
        //账号被封停
        wx.showModal({
          title: '',
          content: res.data.message,
          showCancel: false
        })
        this.setData({
          showMyInfo: false,
          showBindView: false,
          showBanHint:true,
          showBlackhint:false,
        })
      }
      else if (res.data.result == 3) {
        //未绑定过账号
        this.setData({
          showMyInfo:false,
          showBindView: true,
          showBanHint: false,
          showBlackhint: false,
        })
      }
      else {
        this.setData({
          showBanHint: false,
          showBlackhint: true
        })
        
        wx.showModal({
          title: '',
          content: res.data.message,
          showCancel: false
        })
      }

    }
    else if (res.statusCode == 403) {

    }
  },
  //使用opneid登陆 失败回调
  reqOnFail: function (res) {
    //fail
  },
  //使用opneid登陆 完成回调
  reqOnComplete: function (res) {
    //complete
    wx.hideLoading()
  }

})
