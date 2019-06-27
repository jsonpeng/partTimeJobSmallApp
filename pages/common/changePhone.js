// pages/common/changePhone.js
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
  
  },
  mobileInput: function (e) {
    app.input(e, this);
  },
  save:function(){
    var mobile = this.data.mobile;
    if(app.empty(mobile)){
      wx.showToast({
        title: '号码不能为空',
        icon: 'none',
        duration: 1000
      });
      return false;
    } 
    if(!app.empty(mobile) && mobile['mobile'].length != 11){
      wx.showToast({
        title: '号码长度有误',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    app.request('/api/mini_program/change_mobile', function (res) {
      if (res) {
        app.meInfo();
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },1000)
        
      }
    }, mobile, 'manage')
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