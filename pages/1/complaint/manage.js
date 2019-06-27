// pages/1/complaint/manage.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['发起', '收到'],
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var _myself = app.getStorageName('myself');
    that.setData({
      myself:_myself
    });
    app.request('/api/mini_program/publish_and_receive_error/part_job?' + 'token='  + '&skip=0' + '&take=12' + '&send_type=' + '发起', function (res) {
      if (res) {
        that.setData({
          list:res
        })
      }
    }, {}, true);
  },
  navbarTap: function (e) {
    let index = parseInt(e.currentTarget.dataset.idx);
    var that = this;
    // if (index == 3) {
    //   wx.redirectTo({
    //     url: '../orders/orders?order_id=2',
    //   })
    // }
    // app.getServices(this, this.data.themeData.navbar[index]);
    this.setData({
      currentTab: index,
      list:[]
    })
    app.request('/api/mini_program/publish_and_receive_error/part_job?' + 'token=' + '&skip=0' + '&take=12' + '&send_type=' + this.data.navbar[index], function (res) {
      if (res) {
        that.setData({
          list: res
        })
      }
    }, {}, true);
  },
  saveinfo:function(e){
    var reason = e.currentTarget.dataset.reason;
    var txt = e.currentTarget.dataset.txt;
    app.saveStorageName('why', reason);
    app.saveStorageName('txt', txt);
    wx.navigateTo({
      url: '../complaint/detail',
    })
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