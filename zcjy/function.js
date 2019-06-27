/**
 * 判断是否为空
 */
function empty(data) {
  if (data == '' || data == null || data == 0 || data == false || data == 'false' || data == 'null') {
    return true;
  } else {
    return false;
  }
}

/*
 * 自动拆分合并两个数组
 * 
 */
function autoContactArr(data, res_data) {
  //如果是数组就拆分
  if (Array.isArray(res_data)) {
    for (var i in res_data) {
      data.push(res_data[i]);
      // if (typeof res_data[0]['id'] !== 'undefined' && typeof data[0]['id'] !== 'undefined') {
      //   for(var k in data){
      //     if (res_data[i]['id'] == data[k]['id']) {
      //       data.splice(k,1);
      //     }
      //   }
      // }
    }

    //否则直接插入
  } else {
    if (Array.isArray(data)) {
      data.push(res_data);
    }
  }
  return data;
}

/**
 * 字符串中是否包含另一个字符串
 */
function isContains(str, substr) {
  if (str.indexOf(substr) >= 0) {
    return true;
  } else {
    return false;
  }
}

/**
 * 通过数组中的键获取对应的value
 * 通过name键值
 * Arr要找的数组
 * callback成功后的执行方法
 */
function getArrValueByKey(key, Arr, callback) {
  var val = null;
  if (Arr.length) {
    for (var i = Arr.length - 1; i >= 0; i--) {
      if (Arr[i]['name'] == key) {
        val = Arr[i]['value'];
      }
    }
  }
  callback(val);
}

/**
 * 计算长度
 */
function countLength(obj) {
  var length = 0;
  for (var i in obj) {
    length++;
  }
  return length;
}

/**
 * 购物结算使用
 */
//最多使用多少积分
function maxCredits(user_jifen, total, credits_max, creditRate){
  console.log(user_jifen, total, credits_max, creditRate);
  var maxCancel = total * credits_max ;
  return parseInt(user_jifen > maxCancel ? maxCancel : user_jifen);
}

/*获取当前页url*/
function getPageUrl() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  return urlWithArgs
}

module.exports = {
  empty: empty,
  autoContactArr: autoContactArr,
  isContains: isContains,
  getArrValueByKey: getArrValueByKey,
  countLength: countLength,
  maxCredits: maxCredits,
  getPageUrl: getPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs
}