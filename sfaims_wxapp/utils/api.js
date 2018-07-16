var Promise = require('../plugin/es6-promise.js')
import { request } from '../plugin/wx-promise-request';

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}

/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function req_promise(header, method, url, data) {
  var getRequest = wxPromisify(wx.request)
  return getRequest({
    header: header,
    method: method,
    url: url,
    data: data
    
  })
}

// 封装请求接口
const req = (baseUrl, url, data, method) => {
  return new Promise(function (resolve, reject) {
    request({
      url: baseUrl + url,
      data: data,
      method: method,
      header: {
        'Authorization': "bearer " + wx.getStorageSync('jwt_bearer')
      }
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

const req_form = (baseUrl, url, data, method) => {
  return new Promise(function (resolve, reject) {
    request({
      url: baseUrl + url,
      data: data,
      method: method,
      header: {
        'Content-Type': "application/x-www-form-urlencoded"
      }
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

const validatemobile = (mobile)=> {
  if (mobile.length == 0) {
    // wx.showToast({
    //   title: '请输入手机号！',
    //   icon: 'success',
    //   duration: 1500
    // })
    return false;
  }
  if (mobile.length != 11) {
    // wx.showToast({
    //   title: '手机号长度有误！',
    //   icon: 'success',
    //   duration: 1500
    // })
    return false;
  }
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (!myreg.test(mobile)) {
    // wx.showToast({
    //   title: '手机号有误！',
    //   icon: 'success',
    //   duration: 1500
    // })
    return false;
  }
  return true;
}

module.exports = {
  req_promise: req_promise,
  req: req,
  req_form:req_form,
  validatemobile: validatemobile
}