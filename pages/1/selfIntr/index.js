// pages/1/selfIntr/index.js
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
    var txt = app.getStorageName('selfIntr');
    var ID = app.getStorageName('applyID');
    var phone = app.getStorageName('mobile');
    var state = app.getStorageName('state');
    this.setData({
      intr:txt,
      id:ID,
      mobile: phone,
      state: state
    })
  },
  pass:function(){
    var id=this.data.id;
    app.request('/api/part_job/auth_update_project_sign/' + id + '?token'+ '&status='+'已录用', function (res) {
      if (res) {
        wx.showToast({
          title: '已同意报名申请',
          icon: 'success',
          // image: '',
          duration: 2000,
          mask: true,
          success: function (res) {},
          fail: function (res) { },
          complete: function (res) { 
            wx.navigateTo({
              url: '../ask/ask',
            })
          },
        });
      }
    }, {}, true);
  },
  refuse:function(){
    var id = this.data.id;
    app.request('/api/part_job/auth_update_project_sign/' + id + '?token'+ '&status='+'已拒绝' , function (res) {
      if (res) {
        wx.showToast({
          title: '已拒绝报名申请',
          icon: 'success',
          // image: '',
          duration: 2000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) {
            wx.navigateTo({
              url: '../ask/ask',
            })
          },
        });
      }
    }, {}, true);
  },
  phoneCall:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.replyPhone,
      success: function () {
        console.log("成功拨打电话")
      },
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