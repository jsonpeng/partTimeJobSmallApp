var requests = require('request.js');
var cache = require('cache.js');
var functions =require('function.js');
var countries=require('countries.js');

/**
 * 网络请求方式请求
 * 传入参数(app的js对象,请求地址url,成功回调,请求的发送数据,是否需要token,http请求方式默认是get,是否以form的方式)
 */
function request(app_obj, api_url, callback, api_data = {}, token = false, form = false) {
  return requests.request(app_obj, api_url, callback, api_data , token , form);
}


/**
 * 获取对应缓存的名称
 */
function getStorageName(name) {
  return cache.getStorageName(name);

}

/**
 * 存入任意缓存
 */
function saveStorageName(name, value) {
  return cache.saveStorageName(name, value);
}


/**
 * 根据小时序列化当前时间
 */
function formatTimeByHour(hour){
  var dates = new Date();
  var year = dates.getFullYear();
  var month = dates.getMonth() + 1;
  var day = dates.getDate();
  return year + '-' + month + '-' + day + ' ' + hour + ':' + '00';
}

/*
 * 自动拆分合并两个数组
 * 
 */
function autoContactArr(data, res_data){
  return functions.autoContactArr(data,res_data);
}

/**
 * 判断是否为空
 */
function empty(data){
  return functions.empty(data);
}

/**
 * 排序相减
 */
function sortNum(a, b) {
  return a - b;
}

//商品规格相关
/**
 * 整理出选中状态的规格商品的key
 */
function autoCombSpecKey(specs) {
  var specArr = [];
  for (var i in specs) {
    for (var k in specs[i]) {
      if (specs[i][k]['status']) {
        specArr.push(specs[i][k]['item_id']);
      }
    }
  }
  var key = specArr.sort(this.sortNum).join('_');
  console.log(key);
  return key;
}

/**
 * 通过key找到对应的规格商品的数组位置
 * 传入参数[specprice,key]
 * 返回[int index](数组的位置)
 */
function findSpecPriceIndex(specprice, key) {
    var index = 0;
    for (var i in specprice) {
      if (specprice[i]['key'] == key) {
        index = i;
      }
    }
    return index;
}

/**
 * 切换规格的状态
 */
function switchSpecStatus(specs, index1, index2){
  index2 = parseInt(index2);
  for (var k in specs[index1]) {
    //先重置
    specs[index1][k]['status'] = false;
  }
  specs[index1][index2]['status'] = true;
  return specs;
}

/**
 * 整理规格信息 并把第一个自动置为active
 */
function autoCombileSpec(specs) {
  for (var i in specs) {
    for (var k in specs[i]) {
      specs[i][k]['status'] = false;
    }
  }
  for (var i in specs) {
    specs[i][0]['status'] = true;
  }
  //console.log(specs);
  return specs;
}

/**
 * 整理列表 加上状态位
 */
function autoAttachStatusForData(data) {
  for (var i in data) {
    data[i]['status_state'] = false;
  }
  return data;
}

/**
 * 计算长度
 */
function countLength(obj) {
  return functions.countLength(obj);
}

/**
 * 验证是true还是false
 */
function varifyDefault(status) {
  if (status == 'true' || status == true) {
    status = true;
  } else {
    status = false;
  }
  return status;
}

/**
 * 获取单个地址
 */
function getSingeAddress(that,address_id) {
  var address = {};
  address_id = parseInt(address_id);
  var address_list = this.getStorageName('addressList');
  for (var i = 0; i < address_list.length; i++) {
    if (parseInt(address_list[i]['id']) == address_id) {
      address = address_list[i];
    }
  }
  return address;
}

//购物车相关的
/**
 * 整理购物车相同的商品
 */
function mergeCart(cart_list, one_item){
  var status = false;
  console.log(cart_list.length);
  for (var i = 0; i < cart_list.length; i++) {
    console.log("cart_list:" + cart_list[i]['id']);
    console.log("one_item:" + one_item['id']);
    if (cart_list[i]['id'] == one_item['id']) {
      status = true;
      cart_list[i]['qty'] = cart_list[i]['qty'] + one_item['qty'];
      cart_list[i]['price'] = one_item['price'];
      cart_list[i]['total'] = cart_list[i]['qty'] * one_item['price'];
    }
  }
  if (!status) {
    cart_list.push(one_item);
    console.log('之前没加过');
  }
  return cart_list;
}

function mergeProducts(products,new_products){
  for (var i = 0; i < products.length; i++) {
    if (typeof (products[i]) != 'undefined' && typeof (new_products[i]) != 'undefined'){
      if (products[i]['id'] == new_products[i]['id'] ){
        new_products.splice(i,1);
      }
    }
  }
  for (var i in new_products){
  products.push(new_products[i]);
  }
  return products;
}

/**
* 根据购物车列表对象
* 计算购物车的总价及数量[shopCartList OBJECT](购车车列表对象)
*/
function countAllNumAndPrice(obj, shopCartList) {
  var allNum = 0;
  var allCount = 0;
  for (var i = 0; i < shopCartList.length; i++) {
    //只有选中的才算入
    if (shopCartList[i]['selected']) {
      allNum += shopCartList[i]['qty'];
      allCount += shopCartList[i]['qty'] * shopCartList[i]['price'];
      //再算一次综合
      shopCartList[i]['total'] = shopCartList[i]['qty'] * shopCartList[i]['price'];
    }
  }
  obj.setData({
    allNum: allNum,
    allCount: allCount,
    shopCartList: shopCartList
  });
}

//地址 城市设置相关的
/**
 * 自动返回设置成默认收货的地址或者第一个地址
 */
function autoReturnAddress(address_list){
  var that = this;
  if (address_list.length == 0) {
    return [];
  }
  var status = false;
  for (var i = 0; i < address_list.length; i++) {
    //如果有默认的就选默认的
    if (that.varifyDefault(address_list[i]['default'])) {
      address_list = address_list[i];
      status = true;
    }
  }
  if (status) {
    return address_list;
  } else {
    return address_list[0];
  }
}

/**
 * 整理成name列表
 */
function mergeCities(cities_list) {
  var city_list = ['请选择'];//
  for (var i = 0; i < cities_list.length; i++) {
    city_list.push(cities_list[i]['name']);
  }
  return city_list;
}

/**
 * 获取城市的位置通过id
 */
function getCitiesIndexById(cities_list, id) {
  id = parseInt(id);
  var index = 0;
  for (var i = 0; i < cities_list.length; i++) {
    if (parseInt(cities_list[i]['id']) == id) {
      index = i+1;
    }
  }
  console.log("index:" + index);
  return index;
}

/**
 * 删除指定的缓存
 */
function removeCache(cache_arr) {
  return cache.removeCache(cache_arr);
}

/**
 * 通过数组中的键获取对应的value
 * 通过name键值
 * Arr要找的数组
 * callback成功后的执行方法
 */
function getArrValueByKey(key,Arr,callback){
  return functions.getArrValueByKey(key,Arr,callback);
}

/**
 * 验证缓存在不在 并且可以根据callback的返回值做对应的处理
 */
function AutoVarifyCache(cache_name,callback){
  return cache.AutoVarifyCache(cache_name, callback);
}

/**
 * 字符串中是否包含另一个字符串
 */
function isContains(str,substr){
  return functions.isContains(str, substr);
}

/*获取当前页url*/
function getPageUrl() {
  return functions.getPageUrl();
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  return functions.getCurrentPageUrlWithArgs();
}

module.exports = {
  request: request,
  getStorageName: getStorageName,
  saveStorageName: saveStorageName,
  autoContactArr:autoContactArr,
  empty:empty,
  sortNum: sortNum,
  autoCombSpecKey: autoCombSpecKey,
  findSpecPriceIndex: findSpecPriceIndex,
  switchSpecStatus: switchSpecStatus,
  autoCombileSpec: autoCombileSpec,
  autoAttachStatusForData: autoAttachStatusForData,
  countLength: countLength,
  varifyDefault: varifyDefault,
  getSingeAddress: getSingeAddress,
  mergeCart: mergeCart,
  countAllNumAndPrice:countAllNumAndPrice,
  autoReturnAddress: autoReturnAddress,
  mergeCities: mergeCities,
  getCitiesIndexById: getCitiesIndexById,
  formatTimeByHour: formatTimeByHour,
  removeCache: removeCache,
  getArrValueByKey: getArrValueByKey,
  AutoVarifyCache: AutoVarifyCache,
  isContains: isContains,
  getPageUrl: getPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
  mergeProducts: mergeProducts
};