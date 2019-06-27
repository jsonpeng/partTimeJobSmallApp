// pages/1/integral/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup:false,
    chooesList:[
      {name:'全部'},
      {name:'获得'},
      {name:'扣除'}
    ]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var  that=this;
    var myself = app.getStorageName('myself');
    that.setData({
      credits: myself.user.credits
    });
    app.request('/api/mini_program/credit_logs?' + 'token=' + '&skip=0' + '&take=10' +'&time_type='+'month', function (res) {
      if (res) {
        that.setData({
          creditsList: res
        });
      }
    }, {}, true);
  },
  toCalender: function () {
    wx.navigateTo({
      url: '../integral/calender',
    })
  },
  showList:function(){
    var state = this.data.showPopup
    if(state==false){
      this.setData({
        showPopup: true
      })
    }else{
      this.setData({
        showPopup: false
      })
    }

  },
  hideList:function(e){
    console.log(e.currentTarget.dataset.type+'积分类型获取');
    var that=this;
    var _type = e.currentTarget.dataset.type;
    this.setData({
      showPopup: false
    });
    app.request('/api/mini_program/credit_logs?' + 'token=' + '&skip=0' + '&take=10' + '&time_type=' + 'month' + '&type=' + _type, function (res) {
      if (res) {
        that.setData({
          creditsList: res
        });
      }
    }, {}, true);
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
    var that = this;
    var huode = 0,
      kouchu = 0;
    var switchDate = that.data.switchDate;
    var type = that.data.default_type;
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
      }, { type: type, time_type: 'month' }, 'manage')
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