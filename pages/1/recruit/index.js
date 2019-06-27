// pages/1/recruit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['已发布', '已报名', '已录用','已结算'],
    currentTab: 0,
    hasChoose:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  navbarTap: function (e) {
    let index = parseInt(e.currentTarget.dataset.idx);
    // if (index == 3) {
    //   wx.redirectTo({
    //     url: '../orders/orders?order_id=2',
    //   })
    // }
    // app.getServices(this, this.data.themeData.navbar[index]);
    this.setData({
      currentTab: index
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