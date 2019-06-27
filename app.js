var zcjy = require('zcjy/index.js');
import WxValidate from 'utils/WxValidate';
App({
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
  onLaunch: function () {
    //获取系统的宽高度
    // this.getSystemHeightAndWidth();
    // this.getUserInfo();
  },
  onShow: function () {
    //再次回来
    console.log('onShow');
  },
  //加入删除列表
  joinDeleteItems:function(id){
    let items = this.empty(this.getStorageName('items')) ? [] : this.getStorageName('items');
    let status = true;
    if(items.length > 0){
      for(var i = items.length -1 ;i >=0;i--){
        if(id == items[i]){
          status = false;
        }
      }
    }
    if (status){
      items.push(parseInt(id));
    }
    this.saveStorageName('items',items);
  },
  //为数据加上标识
  varifyItems:function(items){
    let delete_items = this.getStorageName('items');
    if (items.length > 0){
      for(var i = items.length -1 ; i>=0 ; i--){
        items[i]['show'] = 1;
        if (delete_items.length > 0){
          for(var k = delete_items.length -1 ; k>=0;k--){
              if (parseInt(items[i]['id']) ==  parseInt(delete_items[k])){
                items[i]['show'] = 0;
              }
          }
        }
      }
    }
    return items;
  },
  onHide: function () {
    //用户退出小程序
    //this.AutoCacheSet();
    console.log('onHide');
  },
  isContains: function (str, substr) {
    return zcjy.isContains(str, substr);
  },
  autoDisShowItems:function(items){
        if(items.length > 0){
          for(var i = items.length-1;i>=0;i--){
             items[i]['show']  = 1;
             var old_time = new Date(items[i]['end_time']).getTime();
             var now_time = new Date().getTime();
             console.log(old_time);
             console.log(now_time);
             if (old_time < now_time){
              items[i]['show'] = 0;
            }
          }
        }
        return items;
  },
  count:function(data){
    return zcjy.countLength(data);
  },
  varifyType:function(list){
    if (zcjy.countLength(list)){
      for(var i = list.length-1;i>=0;i--){
        if(typeof (list[i]['type']) != 'undefined' ){
          //list[i]['type'] = list[i]['type'].replace("\","");
          list[i]['type'] = eval('('+list[i]['type']+')');
        }
      }
    }
    return list;
  },
  //判断主题是否存在
  getFileWhetherHas: function (obj = null, theme) {
    var that = this;
    wx.getFileInfo({
      filePath: 'template/' + theme,
      success: function (res) {
        // res.errMsg//接口调用结果
        // res.createTime//文件的保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
        // res.size//文件大小，单位B
      },
      complete: function (res) {
        console.log(theme);
        console.log(res);
        if (that.isContains(res.errMsg, 'fail file not exist')) {
          theme = that.ext.theme.parent;
        }
        if (!that.empty(obj)) {
          obj.setData({
            'themeData.theme': theme
          });
        }
      }
    });
  },
  removeCache(cache_arr) {
    return zcjy.removeCache(cache_arr);
  },
  getSetting:function() {
    var that=this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          that.globalData.canIUse = true;
        } else {
          that.globalData.canIUse = false;
        }
      }
    })
  },
  /**
   * 定时任务
   */
  autoTask: function (types, times, task_name = 'cache_task') {
    var that = this;
    times = parseInt(times);
    if (types == "sec") {
      times = times * 1000;
    }
    if (types == "min") {
      times = times * 1000 * 60;
    }
    if (types == "hour") {
      times = times * 1000 * 60 * 60;
    }
    var timer = setInterval(function () {
      if (task_name == 'token_task') {
        that.getUserInfo();
      } else if (task_name == 'cache_task') {
        that.AutoCacheSet();
      }
    }, times);
    return timer;
  },
  /**
   * 获取对应缓存的名称
   */
  getStorageName: function (name) {
    return zcjy.getStorageName(name);
  },
  //previewImage 预览图片
  previewImage: function (urls, index = 0) {
    wx.previewImage({
      current: urls[index],
      urls: urls
    });
  },
  /**
   * 存入任意缓存
   */
  saveStorageName: function (name, value) {
    return zcjy.saveStorageName(name, value);
  },
  save: function (obj) {
    if (this.isContains(obj.name,'undefined')) {
      wx.showToast({
        title: '任务名称不全',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else if (!obj.address) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else if (!obj.mobile) {
      wx.showToast({
        title: '号码不能为空',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else if (!this.empty(obj.mobile) && obj.mobile.length != 11){
      wx.showToast({
        title: '号码长度有误',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else if (!obj.give_price) {
      wx.showToast({
        title: '打赏金额不能为空',
        icon: 'none',
        duration: 1000
      });
      return false;
    } // else if (obj.give_price && obj.give_price<1) {
    //   wx.showToast({
    //     title: '打赏金额不能少于1元',
    //     icon: 'none',
    //     duration: 1000
    //   });
    //   return false;
    // }
    else if (obj.current_remain_time=='请输入任务截止时间') {
      wx.showToast({
        title: '任务截止时间不能为空',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else if (obj.current_wish_time == '请输入期望送达时间') {
      wx.showToast({
        title: '期望送达时间不能为空',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else if (new Date(obj.current_remain_time.replace(/-/g, '/')) <= new Date()) {
      wx.showToast({
        title: '任务截至时间不能比当前时间早',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else if (new Date(obj.current_wish_time.replace(/-/g, '/')) <= new Date(obj.current_remain_time.replace(/-/g, '/'))) {
      wx.showToast({
        title: '期望送达时间不能比任务截至时间早',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    else {
      return true;
    }
  },
  
  alert: function (title, success = 'success') {
    wx.showToast({
      title: title,
      icon: success,
      duration: 1000
    });
  },
  autoContactArr:function(data,res_data){
    return zcjy.autoContactArr(data,res_data)
  },
  /**
   *获取用户信息及注册用户信息登录到系统
   */
  getUserInfo: function (parent_id = null, callback = null,phone_decode = null) {
    var that = this;
    var login_data;
    console.log(2);
    //调用登录接口
    wx.login({
      success: function (loginCode) {  
        console.log(loginCode);
        wx.getUserInfo({
          lang: 'zh_CN',
          success: function (res) {
            var userInfo = res.userInfo;
            that.globalData.userInfo = userInfo;
            wx.getLocation({
              success: function (res) {
                that.globalData.latitude = res.latitude;
                that.globalData.longitude = res.longitude;
                login_data = {
                  userInfo: {
                    nickname: that.globalData.userInfo.nickName,
                    head_image: that.globalData.userInfo.avatarUrl,
                    sex: that.globalData.userInfo.gender == 1 ? '男' : '女',
                    province: that.globalData.userInfo.province,
                    city: that.globalData.userInfo.city,
                  },
                  code: loginCode.code,
                  parent_id: parent_id,
                  jindu: that.globalData.longitude,
                  weidu: that.globalData.latitude,
                };
                that.globalData.login_data=login_data;
                wx.redirectTo({
                  url: '../start/start',
                })
              },
              fail: function (res) {
                wx.showModal({
                  title: '温馨提醒',
                  content: '需要获取您的地理位置才能使用小程序',
                  showCancel: false,
                  success: function (res) {
                    wx.getSetting({
                      success:function(res){
                        var status=res.authSetting;
                        if(!status['scope.userLocation']){
                          wx.showModal({
                            title:'是否授权当前位置',
                            content:'需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                            success:function(tip){
                              if(tip.confirm){
                                wx.openSetting({
                                  success:function(data){
                                    if (data.authSetting["scope.userLocation"] === true) {
                                      wx.showToast({
                                        title: '授权成功',
                                        icon: 'success',
                                        duration: 1000
                                      })
                                    } else {
                                      wx.showToast({
                                        title: '授权失败',
                                        icon: 'success',
                                        duration: 1000
                                      })
                                    }
                                  }
                                })
                              }
                            }
                          })
                        }
                      }
                    })
                  }
                })
              }
            })
          },
          fail: function (res) {
            wx.showModal({
              title: '温馨提醒',
              content: '需要获取您的用户信息(昵称、头像等)',
              showCancel: false,
            })
            // wx.showToast({
            //   title:'用户未授权',
            //   icon:'none'
            // })
            console.log('用户未授权');
          }
        })
      }
    });
  },
  empty: function (data) {
    return zcjy.empty(data);
  },
  errorRes: function (wx_response, obj = '') {
    var that = this;
    var status_code = parseInt(wx_response.data.status_code);
    var status = false;
    if (status_code == 401) {
      //存在401就重新拿一次token
      this.getUserInfo();
      status = true;
      if (!that.empty(obj)) {
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
        confirmColor: that.conf.themeColor,
        success: function (res) {
          if (res.confirm) {
            // wx.navigateBack({
            //   delta: 1
            // });
          }
        },
      });
    }
    //console.log("response code:" + status_code);
    //后台发送过来的话就报错显示提示
    if (status_code == 1) {
      wx.showModal({
        // title: '芸来商城提示',
        content: wx_response.data.data,
        showCancel: false,
        confirmColor: that.conf.themeColor,
      });
      return true;
    }
    return status;
  },
  meInfo: function (obj = null, callback = null) {
    var that = this;
    // that.loading();
    wx.request({
      url: that.conf.server + '/api/mini_program/me?token=' + that.globalData.token,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.saveStorageName('myself', res.data.data);
        that.conf.user = res.data.data;
      }
    });
  },

  //通用请求方式 对应处理逻辑在对应js页面实现
  request: function (request_url, callback = null, request_data = {}, token = false, method = 'GET', form = false) {
    let that = this;
    zcjy.request(that, request_url, function (res) {
      if (!that.errorRes(res)) {
        if (typeof (callback) == 'function') {
          callback(res.data.data);
        }
        else {
          callback(false);
        }
      }
      else{
        callback(false);
      }
    }, request_data, token, method, form);
  },
  input: function (e, obj) {
    let type = e.currentTarget.dataset.type;
    if (type == 'tem_word1' || type == 'tem_word2' || type == 'tem_word3'){
      var index=e.currentTarget.dataset.index;
      var input=obj.data.input;
      input[index]=e.detail.value;
    }
    if(type=='item_cost'||type=='give_price'||type=='cash'){
      var regStr = [['^(\\d+\\.\\d{2}).+', '$1'], ['\\.(\\d?)\\.+', '.$1']]
      for (var i = 0; i < regStr.length; i++) {
        var reg = new RegExp(regStr[i][0]);
        e.detail.value = e.detail.value.replace(reg, regStr[i][1]);
      }
    }
    let model = e.currentTarget.dataset.model;
    var model_name = model + '.' + type;
    typeof (model) == 'undefined' ?
      obj.setData({
        [type]: e.detail.value
      })
      :
      obj.setData({
        [model_name]: e.detail.value
      })
  },
  empty: function (data) {
    return zcjy.empty(data);
  },
  //通过要遍历的图像对象及获取的参数来缓加载图片
  varifyImageLazyLoaded: function (foreach_element, src, image_word, callback, types = null) {
    var that = this;
    if (typeof (foreach_element) !== 'undefined' && foreach_element.length > 0) {
      for (var i = 0; i < foreach_element.length; i++) {
        if (foreach_element[i][image_word] == src) {
          foreach_element[i]['loaded'] = true
          if (types == 'allProduct') {
            that.conf.index.allProduct[i]['loaded'] = true
          }
        }
      }
      callback(foreach_element);
    }
  },
  //同时发起多张图片缓加载
  startManyImagesLoad: function (loaded_element, obj) {
    //同时发起全部图片的加载
    loaded_element.forEach(
      item => {
        obj.imgLoader.load(item.image)
      }
    );
  },
  //地图中打开 通过经纬度
  openMap: function (jindu, weidu) {
    wx.openLocation({
      longitude: Number(jindu),
      latitude: Number(weidu),
    })
  },
  //打电话
  phone: function (number) {
    wx.makePhoneCall({
      phoneNumber: number,
      success: function () {
        console.log('拨打电话' + number + '成功');
      }
    });
  },
  //上传文件
  upload_file(url, filePath, success, fail, name = 'file', formData = {}) {
    let that = this;
    console.log('a=' + filePath)
    wx.uploadFile({
      url: that.conf.server + url + '?token=' + that.globalData.token,
      filePath: filePath,
      name: name,
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      formData: formData, // HTTP 请求中其他额外的 form data
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200 && !res.data.result_code) {
          typeof success == "function" && success(res.data);
        } else {
          typeof fail == "function" && fail(res);
        }
      },
      fail: function (res) {
        console.log(res);
        typeof fail == "function" && fail(res);
      }
    })
  },
  setTabBar: function (tab_theme_name, obj) {
    wx.hideTabBar();
    var that = this;
    //从配置中读取对应主题的tabbar
    var tabbar = that.tabBar[0][tab_theme_name];

    that.tabBar[0][tab_theme_name] = tabbar;
    // console.log(that.tabBar[0]);
    var list = tabbar['list'];
    for (var i = tabbar['list'].length - 1; i >= 0; i--) {
      //如果tabbar中配置的路径和当前的路径一致就加上active状态
      if (that.isContains(tabbar['list'][i]['pagePath'], that.getPageUrl())) {
        tabbar['list'][i]['active'] = true;
        //console.log('tabbar:'+i+'高亮');
      }//然后把其他的tabbar重置下
      else {
        tabbar['list'][i]['active'] = false;
      }
    }

    obj.setData({
      tabBar: tabbar
    });
  },
  /*获取当前页url*/
  getPageUrl: function () {
    return zcjy.getPageUrl();
  },
  /*获取当前页带参数的url*/
  getCurrentPageUrlWithArgs: function () {
    return zcjy.getCurrentPageUrlWithArgs();
  },
  // 获取所有兼职列表
  getAlljobsList: function (obj,request_data={}){
    var that = this;
    zcjy.request(that, '/api/part_job/list_all/', function (res) {
      if (!that.errorRes(res)) {
        // res.data.data
        obj.setData({
          jobsList: res.data.data,
          hidden:true
        });
      }
    }, request_data);
  },
  // 积分商城获取商品
  // 根据积分商品id获取对应商品的商品详情  
  //系统宽度
  winWidth: '',
  //系统高度
  winHeight: '',
  load: false,
  conf: {
    version: 'local',
    //公司芸来商城
    //亲爱的全球GO
    name: '兼职系统',
    //略缩图
    default_img: '../../images/default.png',
    //用户可用的优惠券
    coupons: [],
    //用户个人信息
    user: {
      
    },
    //加载动画延迟时间
    delay_time: 800,
    //缓存时间[购物车 用户中心 地址 用缓存] 单位分钟
    cachetime: 15,
    //地址列表
    addressList: [],
    //每页显示数量
    pageTake: 12,
    //是否马上结算
    checknow: false,
    theme: 'social',
    //主题状态
    themeStatus: true,
    themeParent: 'default',
    //主题颜色
    themeColor: '#ff4e44',
    //token定时取时间
    tokenTime: 30,
    //服务器请求基本地址 'http://10.10.6.6/ShangDianV5.5/public'
    //公司商城地址: 'https://shop-model.yunlike.cn'
    // 亲爱的全球购地址:'https://quanqiugo.club',
    // 兼职： https://jianzhi.book.kaimusoft.xyz
    // 校购 https://www.n6time.com
    server: 'https://www.n6time.com',
    //小程序appid  'wx02c2a117dc439ac3'
    //公司  wx51ab71ac2b03db3c
    //全球购  wx5669b891f3e907a7
    // 到店   wx2c93c8c281c6fa3c
    // 兼职   wx2b639e48fc3a83aa
    // 校缘行动  wx2ed3ddf296233320
    appid: 'wx2ed3ddf296233320',
    //小程序secret 'cbea2a5a385b72c0cfaf4708e17c4b7f',
    //公司a2061cd4ddd846c22161939f08e6b25b
    // 全球购secret 59d28e294ceadc925ecdb31891795f81
    // 到店系统secret 9351f24fece0e6f7772448464f50bf8f
    // secret: '9351f24fece0e6f7772448464f50bf8f',
    //服务器请求超时时间
    "networkTimeout": {
      "request": 20000,
      "connectSocket": 20000,
      "uploadFile": 20000,
      "downloadFile": 20000
    }
  },
  shopCartList: [],
  //常用数据
  globalData: {
    hasLogin: false,
    userOpenId: null,
    userInfo: null,
    token: null,
    userUnionId: null,
    shop_id: 0,
    canIUse:null,
    login_time:0,
    login_data:null
  },
  //略缩图:
  imgThumb: 'http://storage.360buyimg.com/mtd/home/lion1483683731203.jpg',
  ext: {},
  tabBar: [
    {
      1: {
        "name": "兼职",
        "color": "#999",
        "selectedColor": "#ff580a",
        "borderStyle": "white",
        "backgroundColor": "#fff",
        "position": "bottom",
        "list": [
          {
            "text": "首页",
            "pagePath": "/pages/1/index/index",
            "iconPath": "/images/default1.png",
            "selectedIconPath": "/images/t1.png",
            "active": false
          },
          {
            "text": "发布",
            "pagePath": "/pages/1/release/index",
            "iconPath": "/images/default2.png",
            "selectedIconPath": "/images/t2.png",
            "active": false
          },
          {
            "text": "我的",
            "pagePath": "/pages/common/myself",
            "iconPath": "/images/default3.png",
            "selectedIconPath": "/images/t3.png",
            "active": false
          }
        ],
        "num": 0
      },
      2: {
        "name" : "校购",
        "color": "#999",
        "selectedColor": "#ff580a",
        "borderStyle": "white",
        "backgroundColor": "#fff",
        "position": "bottom",
        "list": [
          {
            "text": "首页",
            "pagePath": "/pages/2/index/index",
            "iconPath": "/images/default1.png",
            "selectedIconPath": "/images/t1.png",
            "active": false
          },
          {
            "text": "发布",
            "pagePath": "/pages/2/release/index",
            "iconPath": "/images/default2.png",
            "selectedIconPath": "/images/t2.png",
            "active": false
          },
          {
            "text": "我的",
            "pagePath": "/pages/common/myself",
            "iconPath": "/images/default3.png",
            "selectedIconPath": "/images/t3.png",
            "active": false
          }
        ],
        "num": 0
      }
    }],
    app_type:1,
    userInfo:{
      province:'',
      city:''
    }
})