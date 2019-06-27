// pages/jianzhi/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menus1: [
      { name: '已发布', src: '../../images/menu1.png' },
      { name: '待收货', src: '../../images/menu2.png' },
      { name: '已收货', src: '../../images/menu3.png' },
      { name: '待送达', src: '../../images/menu4-d.png' },
      { name: '已收款', src: '../../images/menu5-d.png' },
    ],
    menus2: [
      { name: '已发布', src: '../../images/menu1-d.png' },
      { name: '待收货', src: '../../images/menu2-d.png' },
      { name: '已收货', src: '../../images/menu3-d.png' },
      { name: '待送达', src: '../../images/menu4.png' },
      { name: '已收款', src: '../../images/menu5.png' },
    ],
    myType: '买家',
    notVip:false,
    navbar: [
      [{ src: '../../../images/c1.png', name: '已报名' }, { src: '../../../images/c2.png', name: '已报名' }, { src: '../../../images/c3.png', name: '已结算'}],
      [{ src: '../../../images/menu1.png', name: '已发布' },{ src: '../../../images/c1.png', name: '已报名' }, { src: '../../../images/c2.png', name: '已报名' }, { src: '../../../images/c3.png', name: '已结算' }]
    ],
  },
  toWallet: function () {
    wx.navigateTo({
      url: '../paotui/my-wallet',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTabBar(app.app_type,this);
    var type = app.app_type;
    var myself = app.getStorageName('myself');
    if(type==2){
      app.meInfo();
      this.setData({
        user: myself.user,
        type: type
      })
    }else{
      app.meInfo();
      this.setData({
        myself: myself,
        type: type
      });
    }
  },
  navigateTo: function (e) {
    var curNavbar = e.currentTarget.dataset.index;
    console.log(curNavbar);
    app.saveStorageName('curNavbar', curNavbar);
    wx.navigateTo({
      url: '../2/paotui/order',
    })
  },
  look_integral: function () {
    wx.navigateTo({
      url: '../2/paotui/integral',
    })
  },
  toWallet: function () {
    wx.navigateTo({
      url: '../2/paotui/my-wallet',
    })
  },
  selType: function (e) {
    if (this.data.myType == '买家') {
      this.setData({
        myType: '买手'
      })
    } else {
      this.setData({
        myType: '买家'
      })
    }
  },
  changePhone:function(){
    wx.navigateTo({
      url: '../common/changePhone',
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