// pages/2/index/detail.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myTask:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof (options.index) == 'undefined') {
      app.alert('请选择任务');
      return;
    }
    var that = this;
    let tasks = app.getStorageName('tasks');
    that.setData({
      task: tasks[options.index],
    })
  },
  takeIn:function(){
    var task=this.data.task;
    var that=this;
    app.request('/api/errand/take_order_task/' + task.id,function(res){
      if(res){
        wx.showToast({
          title: '接单成功',
          icon: 'none',
          mask:true,
          success:function(){
            app.saveStorageName('curNavbar',3);
            wx.redirectTo({
              url: '../paotui/order',
            })
          }
        })
      }
    },{},'manage')
  },
  // pay: function () {
  //   var task = this.data.task;
  //   app.request('/api/errand/pay_task/' + task.id, function (res) {
  //     if (res) {
  //       // that.setData({
  //       //   wechat: wechat
  //       // });
  //       wx.requestPayment({
  //         'appId': wechat.appId,
  //         'timeStamp': wechat.timeStamp,
  //         'nonceStr': wechat.nonceStr,
  //         'package': wechat.package,
  //         'signType': wechat.signType,
  //         'paySign': wechat.paySign,
  //         'success': function (res) {
  //           console.log(res);
  //           console.log('调用成功');
  //           that.alert('支付成功');
  //           that.meInfo();
  //           wx.redirectTo({
  //             url: '../orders/orders',
  //           });
  //         },
  //         'fail': function (res) {
  //           that.alert('支付失败');
  //           console.log('调用失败');
  //         }
  //       });
  //     }
  //   }, {}, 'manage')
  // }, 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;

    var urls=[];
    var imgs = this.data.task.images;
    for(var i=0;i<imgs.length;i++){
      urls.push(imgs[i].url);
    }
    wx.previewImage({
      current: imgs[index].url,
      urls: urls
    })
  },
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