// pages/2/paotui/feedback.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opinion:{},
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
    
  },
  opinion:function(e){
    app.input(e,this);
  },
  send:function(){
    var opinion=this.data.opinion;
    if (!opinion.email) {
      wx.showToast({
        title: '邮箱不能为空',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    else if (!opinion.content) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 1000
      });
      return false
    }
    else if (this.checkEmail(opinion.email)){
      app.request('/api/mini_program/publish_feedback', function (res) {
        if (res) {
          wx.showToast({
            title: '成功',
            icon: 'succes',
            duration: 5000,
            mask: true,
            complete:function(){
              wx.navigateBack({
                delta: 1
              })
            }
          })
          
        }
      }, opinion, 'manage')
    }
  },
  checkEmail: function (email) {
    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (str.test(email)) {
      return true
    } else {
      app.alert('请填写正确的邮箱')
      return false
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