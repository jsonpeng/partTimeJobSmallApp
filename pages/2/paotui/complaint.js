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
    var user=app.getStorageName('myself').user;
    var navbar=this.data.navbar;
    var currentTab=this.data.currentTab;
    var send_type=navbar[currentTab];
    var that=this;
    var platform_type;
    if(app.app_type=2){
      platform_type = 'errand';
    }
    app.request('/api/mini_program/publish_and_receive_error/'+platform_type,function(res){
      if(res){
        that.setData({
          complaint:res,
          user:user
        })
      }
    }, {'send_type': send_type},'manage')
  },
  navbarTap: function (e) {
    let index = parseInt(e.currentTarget.dataset.idx);
    var that = this;
    var navbar = that.data.navbar;
    var send_type = navbar[index];
    console.log(send_type);
    if (index == 0) {
      app.request('/api/mini_program/publish_and_receive_error/errand', function (res) {
        if (res) {
          that.setData({
            complaint: res,
            currentTab: index
          })
        }
      }, { 'send_type': send_type }, 'manage')
    } else {
      app.request('/api/mini_program/publish_and_receive_error/errand', function (res) {
        if (res) {
          that.setData({
            complaint: res,
            currentTab: index
          })
        }
      }, { 'send_type': send_type}, 'manage')
    }
  },
  toDetail:function(e){
    var complaint=this.data.complaint;
    app.saveStorageName('complaint_task', complaint);
    var index=e.currentTarget.dataset.index;
    console.log(index);
    wx.navigateTo({
      url: '../paotui/complaint-detail?index='+index
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