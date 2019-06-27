// pages/index/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reachBottom:true
  },
  toSel:function(){
    wx.navigateTo({
      url: '../index/sel-school',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTabBar(app.app_type, this);
    // wx.showLoading({
    //   title: '加载中',
    //   success:function(){
    //     setTimeout(function(){
    //       wx.hideLoading();
    //     },1500)
    //   }
    // })
    var selSchool=app.getStorageName('selSchool');
    var that=this;
    app.request('/api/errand/school_tasks',function(res){
      if(res){
        app.saveStorageName('tasks',res);
        that.setData({
          selSchool:selSchool,
          tasks:res
        })
      }
    }, { school_name: selSchool.name,skip:0,take:10},'manage')
  },
  toDetail:function(e){
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../index/detail?index=' + index,
    })
  },
  goBack:function(){
    wx.navigateTo({
      url: '../../start/start',
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
    var selSchool = app.getStorageName('selSchool');
    var that = this;
    app.setTabBar(app.app_type, that);
    app.request('/api/errand/school_tasks', function (res) {
      if (res) {
        app.saveStorageName('tasks', res);
        that.setData({
          selSchool: selSchool,
          tasks: res,
          reachBottom:true
        })
      }
    }, { school_name: selSchool.name, skip: 0, take: 10 }, 'manage')
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
    var selSchool = app.getStorageName('selSchool');
    var that = this;
    var tasks=that.data.tasks;
    var skip=tasks.length;
    if(skip%10==0){
      app.request('/api/errand/school_tasks', function (res) {
        if (res) {
          if(app.empty(res)){
            that.setData({
              reachBottom: false
            })
          }else{
            app.autoContactArr(tasks, res);
            app.saveStorageName('tasks', tasks);
            that.setData({
              selSchool: selSchool,
              tasks: tasks
            })
          }
        }
      }, { school_name: selSchool.name, skip: skip, take: 10 }, 'manage')
    }else{
      that.setData({
        reachBottom:false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})