// pages/2/paotui/pay.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  goBack: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var wufei_task=app.getStorageName('wufei_task');
    this.setData({
      wufei_task:wufei_task,
      item_cost:wufei_task.item_cost
    })
  },
  wufeiInput:function(e){
    app.input(e,this);
  },
  save:function(e){
    var wufei_id=this.data.wufei_task.id;
    var item_cost=this.data.item_cost;
    if(app.empty(item_cost)||item_cost<=0){
      wx.showToast({
        title: '请输入有效金额',
        icon:'none',
        mask:false
      })
    }else{
      app.request('/api/errand/enter_item_cost_task/' + wufei_id, function (res) {
        if (res) {
          wx.navigateBack({
            delta: 1
          })
        }
      }, { item_cost: item_cost }, 'manage')
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