// pages/2/paotui/calender.js
var dateTimePicker = require('../../../zcjy/dateTimePicker.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchDate:'按日选择',
    startYear: 2000,
    endYear: 2050,
    month: '',
    startDate:'',
    endDate:'结束日期',
  },
  goBack:function(){
    wx.navigateBack({
      delta:1
    })
  },
  // switchDate:function(){
  //   if (this.data.switchDate=='按月选择'){
  //     this.setData({
  //       switchDate: '按日选择',
  //     })
  //   }else{
  //     this.setData({
  //       switchDate: '按月选择',
  //     })
  //   }
  // },
  finish:function(){
    var switchDate=this.data.switchDate;
    var month=this.data.month;
    var startDate=this.data.startDate;
    var endDate=this.data.endDate;
    if (switchDate=='按月选择'){
      app.saveStorageName('switchDate', month);
      wx.navigateBack({
        delta:1
      })
    }
    else if(this.data.endDate=='结束日期'||endDate==startDate){
      app.saveStorageName('switchDate', startDate);
      wx.navigateBack({
        delta: 1
      })
    }else{
      app.saveStorageName('switchDate', startDate+'至'+endDate);
      wx.navigateBack({
        delta: 1
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var newDate = new Date();
    var year = this.withData(newDate.getFullYear()),
    mont = this.withData(newDate.getMonth() + 1),
    date = this.withData(newDate.getDate());
    this.setData({
      month:year+'-'+mont,
      startDate: year + '-' + mont + '-'+ date
    })
  },
  withData:function(param){
    return param < 10 ? '0' + param : '' + param;
  },
  changeMonth(e) {
    this.setData({ month: e.detail.value });
  },
  changeDate1(e){
    this.setData({ startDate: e.detail.value });
  },
  changeDate2(e) {
   
    // new Date(res[i].arrive_time.replace(/-/g, "\/")) > new Date(res[i + 1].arrive_time.replace(/-/g, "\/"))
    console.log(e.detail.value < this.data.startDate);
    if(e.detail.value<this.data.startDate){
      this.setData({
        endDate: this.data.startDate
      })
    }else{
      this.setData({ 
        endDate: e.detail.value 
      });
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