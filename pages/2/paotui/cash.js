// pages/2/paotui/cash.js
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
    var user=app.getStorageName('myself').user;
    this.setData({
      user:user
    })
  },
  cashAll:function(){
    var user=this.data.user;
    this.setData({
      cash:user.user_money
    })
  },
  cashInput:function(e){
    app.input(e,this);
  }, 
  confirm:function(){
    var cash=this.data.cash;
    var accout = this.data.accout;
    var cash_money=this.data.user.user_money;
    if(app.empty(cash)){
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
      })
      return;
    }
    if(app.empty(accout)){
      wx.showToast({
        title: '请输入提现账号',
        icon: 'none',
      })
      return;
    }
    if(cash<1||cash>20000){
      wx.showToast({
        title: '提现金额最低为1元,最多不超过两万',
        icon: 'none',
      })
    }else if(cash>cash_money){
      wx.showToast({
        title: '提现金额不得超过所剩余额',
        icon: 'none',
      })
    }else{
      app.request('/api/errand/publish_withdraw', function (res) {
        if (res) {
          app.meInfo();
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      }, { price: cash, alipay_num: accout }, 'manage')
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
    app.meInfo();
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