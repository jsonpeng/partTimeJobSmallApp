// pages/2/release/pay.js
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  goBack:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that=this;
    app.request('/api/errand/task_detail/' + options.id,function(res){
      if(res){
        that.setData({
          task: res
        })
        // if (res.wait_buyer_enter==1){
        //   setTimeout(function(){
        //     app.saveStorageName('curNavbar',0);
        //     wx.navigateTo({
        //       url: '../paotui/order',
        //     })
        //   },1000)
        // }
      }
    })
  },
  takeIn:function(){
    var task=this.data.task;
    app.request('/api/errand/pay_task/'+task.id,function(res){
      if (res) {
        let wechat = JSON.parse(res);
        wx.requestPayment({
          'appId': wechat.appId,
          'timeStamp': wechat.timeStamp,
          'nonceStr': wechat.nonceStr,
          'package': wechat.package,
          'signType': wechat.signType,
          'paySign': wechat.paySign,
          'success': function (res) {
            console.log(res);
            console.log('调用成功');
            wx.showToast({
              title: '付款成功',
              icon: 'success',
              duration: 2000,
              mask: true,
              success: function () {
                setTimeout(function () {
                  app.saveStorageName('curNavbar', 0);
                  wx.redirectTo({
                    url: '../paotui/order',
                  })
                }, 1000)
              }
            })
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              icon:'none'
            })
          }
        })
      }
    },{},'manage')
  },  
  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;
    var urls = [];
    var imgs = this.data.task.images;
    for (var i = 0; i < imgs.length; i++) {
      urls.push(imgs[i].url);
    }
    wx.previewImage({
      current: imgs[index].url,
      urls: urls
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