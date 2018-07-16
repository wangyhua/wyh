//app.js
App({
  globalData: {
    userInfo: null,
    WebApiURL: "https://localhost:44303",
    //WebApiURL: "https://www.wyhdmc.club",
    openid: '',
    unionid: '',
    jwt_bearer: '',
    ims_userinfo:null
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  // "appid": "wxd5d4b667ba7b7272",
  // "appsecret":"a4e96c63ba92caabccad604104583119",
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求,获取openid
          wx.request({
            url: this.globalData.WebApiURL + '/api/auth/local/GetOpenID',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              code: res.code
            },
            success: res => {

              try {
                wx.setStorageSync('openid', res.data.openid)
              } catch (error) {
                  console.log('openid storage error')
              }
                this.globalData.openid = res.data.openid
                console.log('GetOpenID success:' + res.data.openid);
            },
            fail: res => {
              console.log(res);
              console.log('GetOpenID fail');
            },
            complete: res => {
              console.log('GetOpenID complete');
            }  
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //根据openid登陆
  requestByOpenid: function (openid, successCallback, errorCallback, completeCallback)
  {
     wx.request({
       url: this.globalData.WebApiURL +'/api/auth/local/LoginByWechat',
      data: {
        openid: openid,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log('requestByOpenid success')
        successCallback(res)
      },
      fail: function (res) {
        //console.log('requestByOpenid fail')
        errorCallback(res);
      },
      complete: function (res) {
        //console.log('requestByOpenid complete')
        completeCallback(res);
      }
    })  
  }
})