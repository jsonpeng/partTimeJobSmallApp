// pages/demo/demo.js
let City = require('../../../utils/allcity.js');
var app=getApp();
Page({

  data: {
    city:City
  },
  onLoad: function (options) {
    //console.log(options.city);
  },
  bindtap(e){
    var selCity=e.detail.name;
    app.saveStorageName('selCity', selCity);
    // wx.setStorageSync('city', e.detail.name);
    wx.showModal({
      title: '提示',
      content: '是否切换到当前选中城市',
      success: function (res) {
        if (res.confirm) {
          app.request('/api/part_job/get_province_id_by_name?name='+selCity,function(pid){
            if(pid){
              app.request('/api/part_job/cities_list?pid='+pid,function(part){
                if(part){
                  app.saveStorageName('cities',part);
                }
              })
              wx.switchTab({
                url: '../index/index'
              })
            }
          })
          
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },
  input(e){
    this.value = e.detail.value
  },
  searchMt(){
    // 当没有输入的时候，默认inputvalue 为 空字符串，因为组件 只能接受 string类型的 数据 
    if(!this.value){
      this.value = '';
    }
    this.setData({
      value:this.value
    })
  }
  
})