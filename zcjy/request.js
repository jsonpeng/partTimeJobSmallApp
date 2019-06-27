var cache = require('cache.js');

/**
 * 网络请求方式请求
 * 传入参数(app的js对象,请求地址url,成功回调,请求的发送数据,是否需要token,http请求方式默认是get,是否以form的方式)
 */
function request(app_obj, api_url, callback, api_data = {}, token = false, method = 'GET',form = false) {
  if (token) {
    api_data['token'] = app_obj.globalData.token
  }
  var header = !form ? {
    'content-type': 'application/json'
  } : {
      "Content-Type": "application/x-www-form-urlencoded"
    };
  wx.request({
    url: app_obj.conf.server + api_url,
    data: api_data,
    header: header,
    method: method,
    complete: function (res) {
      callback(res);
    }
  });
}

/**
 * 根据request返回的status_code处理401错误500错误(请求频率过高,高并发,服务器等问题)
 * 用户个人中心带token验证的用得到 
 * 传入参数:[wx_response object,obj object](reques返回的参数,js对象[列表页建议传入])
 **/
function errorRes(wx_response, obj = '') {
  var that = this;
  var status_code = parseInt(wx_response.data.status_code);
  var status = false;
  var themeColor ="ff4e44";
  cache.AutoVarifyCache('theme',function(e){
      if(e){
        themeColor = e.maincolor
      }
  });
  if (status_code == 401) {
    if (status_code == 401) {
      //存在401就重新拿一次token
      this.getUserInfo();
    }
    status = true;
    if (!index.empty(obj)) {
      //重载页面
      setTimeout(function () {
        obj.onLoad();
      }, 1000);
    }
  }
  if (status_code == 500) {
    wx.showModal({
      // title: '芸来商城提示',
      content: '服务器开了小差,请再等等',
      showCancel: false,
      confirmColor: themeColor,
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          });
        }
      },
    });
  }

  //后台发送过来的话就报错显示提示
  if (status_code == 1) {
    wx.showModal({
      // title: '芸来商城提示',
      content: wx_response.data.data,
      showCancel: false,
      confirmColor: themeColor,
    });
  }
  return status;
}


module.exports = {
  request: request,
  errorRes: errorRes
}