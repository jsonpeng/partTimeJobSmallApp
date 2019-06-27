// pages/2/paotui/my-wallet.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['收入明细', '支出明细','提现记录'],
    curNavbar:0,
  },
  toCash:function(){
    wx.navigateTo({
      url: '../paotui/cash',
    })
  },
  switchTab: function (e) {
    var curNavbar = e.currentTarget.dataset.index;
    var that = this;
    that.setData({
      curNavbar: curNavbar
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user=app.getStorageName('myself').user;
    var that=this;
    app.request('/api/errand/my_task_log',function(res){
      if(res){
        console.log(res);
        that.autoContactArr(res.errand_log,res.refund_log);
        // var publish_time=that.data.publish_time;
        // for(var i=0;i<res.publish_log.length;i++){
        //   publish_time.push(res.publish_log[i].updated_at);
        // }
        that.cycle(res.publish_log);
        that.cycle(res.errand_log);
        that.cycle(res.withdraw_log);
        console.log(res.errand_log);
        that.setData({
          publish_log:res.publish_log,
          errand_log:res.errand_log,
          withdraw_log: res.withdraw_log,
          user:user
        })
      }
    },{},'manage')
  },
  autoContactArr:function(data, res_data) {
    //如果是数组就拆分
    if(Array.isArray(res_data)) {
      for (var i in res_data) {
        data.push(res_data[i]);
      }
      //否则直接插入
    } else {
      if(Array.isArray(data)){
        data.push(res_data);
      }
    }
    return data;
  },
  cycle:function(obj){
    var low = 0;
    var high = obj.length - 1;
    var tmp, i;
    while (0 < high) {
      for (var i = 0; i < high; ++i) {
        if (new Date(obj[i].updated_at.replace(/-/g, "\/")) < new Date(obj[i + 1].updated_at.replace(/-/g, "\/"))) {
          tmp = obj[i]; obj[i] = obj[i + 1]; obj[i + 1] = tmp;
        }
      }
      --high;
      for (i = high; i > low; --i) {
        if (new Date(obj[i].updated_at.replace(/-/g, "\/")) > new Date(obj[i - 1].updated_at.replace(/-/g, "\/"))) {
          tmp = obj[i]; obj[i] = obj[i - 1]; obj[i - 1] = tmp;
        }
      }
      ++low;
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
    // var that = this;
    // var curNavbar=that.data.curNavbar;
    // var publish_log = that.data.publish_log;
    // var errand_log = that.data.errand_log;
    // var withdraw_log = that.data.withdraw_log;
    // var refund_log = that.data.refund_log;
    // var skip;
    // if (curNavbar==0){
    //   skip = publish_log.length + refund_log.length;
    // } else if (curNavbar == 1){
    //   skip=errand_log.length;
    // }else{
    //   skip = withdraw_log.length;
    // }
    // if (skip % 10 == 0) {
    //   app.request('/api/errand/my_task_log', function (res) {
    //     if (res) {
    //       console.log(res);
    //       that.setData({
    //         publish_log: res.publish_log,
    //         errand_log: res.errand_log,
    //         withdraw_log: res.withdraw_log,
    //         refund_log: res.refund_log
    //       })
    //     }
    //   }, { skip: skip, take: 10 }, 'manage')
    // } else {
    //   that.setData({
    //     reachBottom: false
    //   })
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})