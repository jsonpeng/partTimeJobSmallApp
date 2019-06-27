// pages/2/index/sel-school.js
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
    var that=this;
    var schools=app.getStorageName('school');
    that.setData({
      schools:schools
    })
  },
  selSchool:function(e){
    var selSchool=e.currentTarget.dataset.school;
    var add_school={};
    add_school.name = selSchool.name;
    add_school.province = selSchool.province;
    add_school.city = selSchool.city;
    add_school.district = selSchool.area;
    add_school.address = selSchool.address;
    add_school.lon = selSchool.location.lng;
    add_school.lat = selSchool.location.lat;
    app.saveStorageName('selSchool',selSchool);
    app.request('/api/errand/select_and_add_school',function(res){
      if(res){
        wx.switchTab({
          url: '../index/index',
        })
      }
    },add_school,'manage')
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