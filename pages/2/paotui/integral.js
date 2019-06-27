// pages/1/integral/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    switchDate:'本月',
    types:['全部','获得','扣除'],
    default_type:'全部',
  },
  toCalender:function(){
    wx.navigateTo({
      url: '../paotui/calender',
    })
  },
  goBack: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user=app.getStorageName('myself').user;
    app.removeCache(['switchDate']);
    var that=this;
    var huode=0,
        kouchu=0;
    app.request('/api/mini_program/credit_logs',function(res){
      if(res){
        for(var i=0;i<res.length;i++){
          if(res[i].type=='获得'){
            huode+=res[i].num
          }else{
            kouchu += res[i].num
          }
        }
        that.setData({
          creditsList: res,
          user: user,
          huode:huode,
          kouchu:kouchu
        })
      }
    },{skip:0,take:10},'manage')
  },
  showList: function () {
    if(this.data.showPopup){
      this.setData({
        showPopup: false
      })
    }else{
      this.setData({
        showPopup: true
      })
    }
  },
  hideList: function (e) {
    var type=e.currentTarget.dataset.cont;
    var that=this;
    var huode=0,
      kouchu=0;
    var switchDate = that.data.switchDate;
    if(that.data.switchDate=='本月'){
      app.request('/api/mini_program/credit_logs' , function (res){
        if(res){
          for (var i = 0; i < res.length; i++) {
            if (res[i].type == '获得') {
              huode += res[i].num
            } else {
              kouchu += res[i].num
            }
          }
          that.setData({
            creditsList:res,
            default_type:type,
            showPopup: false,
            huode: huode,
            kouchu: kouchu
          })
        }
      }, { type: type},'manage')
    } else if (app.isContains(switchDate,'至')){
      var dateArr = switchDate.split('至');
      app.request('/api/mini_program/credit_logs', function (res) {
        if (res) {
          for (var i = 0; i < res.length; i++) {
            if (res[i].type == '获得') {
              huode += res[i].num
            } else {
              kouchu += res[i].num
            }
          }
          that.setData({
            creditsList: res,
            default_type: type,
            showPopup: false,
            huode: huode,
            kouchu: kouchu
          })
        }
      }, { type: type, time_type: 'custom', time_start: dateArr[0], time_end: dateArr[1]}, 'manage')
    }else if(switchDate.length>7){
      app.request('/api/mini_program/credit_logs', function (res) {
        if (res) {
          for (var i = 0; i < res.length; i++) {
            if (res[i].type == '获得') {
              huode += res[i].num
            } else {
              kouchu += res[i].num
            }
          }
          that.setData({
            creditsList: res,
            default_type: type,
            showPopup: false,
            huode: huode,
            kouchu: kouchu
          })
        }
      }, { type: type, time_type: 'day'}, 'manage')
    }else{
      console.log(1);
      app.request('/api/mini_program/credit_logs', function (res) {
        if (res) {
          for (var i = 0; i < res.length; i++) {
            if (res[i].type == '获得') {
              huode += res[i].num
            } else {
              kouchu += res[i].num
            }
          }
          that.setData({
            creditsList: res,
            default_type: type,
            showPopup: false,
            huode: huode,
            kouchu: kouchu
          })
        }
      }, { type: type, time_type: 'custom', time_start: switchDate}, 'manage')
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
    if (!app.empty(app.getStorageName('switchDate'))) {
      this.setData({
        switchDate: app.getStorageName('switchDate'),
      })
    }
    var that=this;
    var huode=0,
      kouchu=0;
    var switchDate=that.data.switchDate;
    var type=that.data.default_type;
    if (that.data.switchDate == '本月') {
      app.request('/api/mini_program/credit_logs', function (res) {
        if (res) {
          for (var i = 0; i < res.length; i++) {
            if (res[i].type == '获得') {
              huode += res[i].num
            } else {
              kouchu += res[i].num
            }
          }
          that.setData({
            creditsList: res,
            default_type: type,
            showPopup: false,
            huode: huode,
            kouchu: kouchu
          })
        }
      }, { type: type }, 'manage')
    } else if (app.isContains(switchDate, '至')) {
      var dateArr = switchDate.split('至');
      app.request('/api/mini_program/credit_logs', function (res) {
        if (res) {
          for (var i = 0; i < res.length; i++) {
            if (res[i].type == '获得') {
              huode += res[i].num
            } else {
              kouchu += res[i].num
            }
          }
          that.setData({
            creditsList: res,
            default_type: type,
            showPopup: false,
            huode: huode,
            kouchu: kouchu
          })
        }
      }, { type: type, time_type: 'custom', time_start: dateArr[0], time_end: dateArr[1] }, 'manage')
    } else if (switchDate.length > 7) {
      app.request('/api/mini_program/credit_logs', function (res) {
        if (res) {
          for (var i = 0; i < res.length; i++) {
            if (res[i].type == '获得') {
              huode += res[i].num
            } else {
              kouchu += res[i].num
            }
          }
          that.setData({
            creditsList: res,
            default_type: type,
            showPopup: false,
            huode: huode,
            kouchu: kouchu
          })
        }
      }, { type: type, time_type: 'day' }, 'manage')
    } else {
      app.request('/api/mini_program/credit_logs', function (res) {
        if (res) {
          for (var i = 0; i < res.length; i++) {
            if (res[i].type == '获得') {
              huode += res[i].num
            } else {
              kouchu += res[i].num
            }
          }
          that.setData({
            creditsList: res,
            default_type: type,
            showPopup: false,
            huode: huode,
            kouchu: kouchu
          })
        }
      }, { type: type, time_type: 'custom', time_start: switchDate }, 'manage')
    }
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