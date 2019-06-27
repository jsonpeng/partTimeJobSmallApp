var cache = require('cache.js');

function countries(app_obj, api_url, callback, api_data = {}, token = false, method = 'GET', form = false){
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

module.exports = {
  countries: countries
}