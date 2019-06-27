// pages/2/paotui/detail.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var curNavbar=app.getStorageName('curNavbar');
    var user=app.getStorageName('myself').user;
    if (!curNavbar) {
      curNavbar = 0
    }
    var that=this;
    app.request('/api/errand/task_detail/' + options.id,function(res){
      if(res){
        that.setData({
          task:res,
          curNavbar:curNavbar,
          user:user
        })
      }
      else{
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },2500);
      }
    },{},'manage')
  },
  phoneCall:function(e){
    // console.log(e.currentTarget.dataset.replyphone);
    // var num = e.currentTarget.dataset.replyphone;
    // console.log(num.toString());
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.replyphone,
      success: function () {
        console.log("成功拨打电话")
      },
    })
  },
  toComplaint:function(e){
    var complaint_task=e.currentTarget.dataset.content;
    app.saveStorageName('complaint_task',complaint_task);
    wx.navigateTo({
      url: '../paotui/complaint_detail'
    })
  },
  pay:function () {
    var that=this;
    var task = that.data.task;
    app.request('/api/errand/pay_task/' + task.id, function (res) {
      if (res) {
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
              console.log('调用成功');
              wx.showToast({
                title: '付款成功',
                icon: 'success',
                duration: 2000,
                mask: true,
                success: function () {
                  setTimeout(function () {
                    if(task.status=="已发布"){
                      app.saveStorageName('curNavbar', 0);
                    }else{
                      app.saveStorageName('curNavbar', 1);
                    }
                    wx.navigateTo({
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
      }
    }, {}, 'manage')
  },  
  cancel_task: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '您确定要取消吗？',
      success: function (res) {
        if (res.confirm) {
          app.request('/api/errand/cancle_order_task/' + id, function (res) {
            if (res) {
              app.meInfo();
              wx.navigateBack({
                delta:1
              })
            }
          }, {}, 'manage')
        } else {
          console.log('用户点击取消')
        }
      }
    })
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
    this.onLoad();
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