// pages/start/start.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputMobile:true,
    user:'',
    hidden:false,
    dialog:false
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let that = this;
    var login_data = app.globalData.login_data;
    if (!app.empty(app.getStorageName('myself'))){
      that.setData({
        user: app.getStorageName('myself').user,
        hidden: true
      })
    }
    wx.login({
      success: function (loginCode) {
        
        console.log(loginCode);
        login_data.code=loginCode.code;
        app.request('/api/mini_program/login', function (res) {
          if (res) {
            console.log(res);
            app.globalData.token = res.token;
            app.saveStorageName('token', app.globalData.token);
            if (app.empty(app.getStorageName('myself'))) {
              wx.showLoading({
                title: '加载中',
                mask: true
              })
              that.meInfo();
            }
            // var pages = getCurrentPages();
            // var currPage = pages[pages.length - 1];
            // currPage.setData({
            //   hidden: true
            // })
            //登陆成功
            app.saveStorageName('school', res.school);
            app.saveStorageName('address', res.address);
            let cities = res.cities;
            for (var i = cities.length - 1; i >= 0; i--) {
              if (app.isContains(res.address, cities[i]['name'])) {
                cities[i]['selected'] = true;
                app.saveStorageName('selCity', cities[i]['name']);
              }
            }
            app.saveStorageName('cities', cities);
            app.globalData.hasLogin = true;
            
          }
        }, login_data);
      }
    })
  },
  meInfo: function (obj = null, callback = null) {
    var that = this;
    // that.loading();
    wx.request({
      url: app.conf.server + '/api/mini_program/me?token=' + app.globalData.token,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        app.saveStorageName('myself', res.data.data);
        app.conf.user = res.data.data;
        console.log(res.data.data);
        that.setData({
          user: res.data.data.user,
          hidden: true
        })
        wx.hideLoading();
      }
    });
  },
  errand:function(e){
    let type = e.currentTarget.dataset.type;
    app.app_type = type;
    if (type == 1) {
      wx.switchTab({
        url: '../1/index/index',
      })
    } else {
      wx.navigateTo({
        url: '../2/index/sel-school',
      })
    }
  },
  getPhoneNumber: function (e) {
    
    var that=this;
    if (e.detail.errMsg != 'getPhoneNumber:ok'){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        mask:true,
        success: function (res) {
          that.setData({
            inputMobile:false
          })
        }
      })
    }else{
      var login_data = app.globalData.login_data;
      wx.login({
        success: function (loginCode) {
          console.log(loginCode);
          login_data['code'] = loginCode.code;
          login_data['encryptedData'] = e.detail.encryptedData;
          login_data['iv'] = e.detail.iv;
          app.request('/api/mini_program/login', function (res) {
            if (res) {
              console.log(res);
              app.globalData.token = res.token;
              app.saveStorageName('token', app.globalData.token);
              app.meInfo();
              let type = e.currentTarget.dataset.type;
              app.app_type = type;
              if (type == 1) {
                wx.switchTab({
                  url: '../1/index/index',
                })
              } else {
                wx.navigateTo({
                  url: '../2/index/sel-school',
                })
              }
            }
          }, login_data);
        }
      })
    }
  } , 
  mobileInput:function(e){
    app.input(e,this);
  },
  confirm: function (e) {
    var mobile=this.data.mobile;
    if (app.empty(mobile)) {
      wx.showToast({
        title: '号码不能为空',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    if (!app.empty(mobile) && mobile['mobile'].length != 11) {
      wx.showToast({
        title: '号码长度有误',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    let that=this;
    app.request('/api/mini_program/change_mobile',function(res){
      if(res){
        app.meInfo();
        that.setData({
          inputMobile: false
        })
        let type = app.app_type;
        if (type == 1) {
          wx.switchTab({
            url: '../1/index/index',
          })
        } else {
          wx.navigateTo({
            url: '../2/index/sel-school',
          })
        }
      }
    },mobile,'manage')
  },
  hidePop:function(){
    if (this.data.inputMobile==false){
      this.setData({
        inputMobile:true
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
    // var user = app.getStorageName('myself').user;
    // this.setData({
    //   user: user,
    //   hidden: true
    // })
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
  
  }
})