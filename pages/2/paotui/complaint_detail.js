// pages/2/paotui/complaint.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  goBack:function(){
    wx.navigateBack({
      delta:1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var complaint_task = app.getStorageName('complaint_task');
    this.setData({
      complaint_task:complaint_task
    });
    
  },
  complaint:function(e){
    app.input(e,this);
  },
  save:function(){
    var complaint_task = this.data.complaint_task;
    var complaint_type;
    var curNavbar=app.getStorageName('curNavbar');
    if(curNavbar==1||curNavbar==2){
      complaint_type = 'publisher';
    }else{
      complaint_type = 'errander';
    }
    if (this.verify(this)){
      var type = this.data.type;
      var reason = this.data.reason;
      app.request('/api/errand/error_task/' + complaint_task.id + '/' + complaint_type, function (res) {
        if (res) {
          wx.showToast({
            title: '投诉成功',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta:1
                })
              }, 1000)
            }
          })
        }
      }, { type: type, reason: reason }, 'manage')
    }
  },
  verify:function(obj){
    if (app.empty(obj.data.type)) {
      wx.showToast({
        title: '投诉原因不能为空',
        icon: 'none'
      })
      return false;
    }
    else if (app.empty(obj.data.reason)) {
      wx.showToast({
        title: '投诉内容不能为空',
        icon: 'none'
      })
      return false;
    }
    else{
      return true;
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