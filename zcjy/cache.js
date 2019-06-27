var functions = require('function.js');
/**
 * 获取对应缓存的名称
 */
function getStorageName(name) {
  var storage_name = wx.getStorageSync(name) || false;
  return storage_name;
}

/**
 * 存入任意缓存
 */
function saveStorageName(name, value) {
  return wx.setStorageSync(name, value);
}

/**
 * 验证缓存在不在 并且根据callback的返回值做对应的处理
 */
function AutoVarifyCache(cache_name, callback) {
  //读取缓存
  var attribute = this.getStorageName(cache_name);
  //不在的话在对应页面执行操作
  callback(attribute);
}


/**
 * 删除指定的缓存
 */
function removeCache(cache_arr) {
  if (!functions.empty(cache_arr)){
    for (var i in cache_arr) {
      this.AutoVarifyCache(cache_arr[i], function (e) {
        //存在缓存才删除 不存在不打印
        if (e) {
          wx.removeStorageSync(cache_arr[i]);
          console.log('清理' + cache_arr[i] + '缓存');
        }
      });
    }
  }
}

module.exports = {
  getStorageName:getStorageName,
  saveStorageName:saveStorageName,
  AutoVarifyCache:AutoVarifyCache,
  removeCache: removeCache


}


