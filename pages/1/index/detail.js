// pages/1/index/detail.js
var app=getApp();
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var types;
var times;
var currents;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifShow:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options.from +'state');

    if (typeof options.currentClass !== 'undefined'){
      types = options.currentClass
    }

    if (typeof options.currentClass !== 'undefined') {
      times = options.type
    }

    if (typeof options.current !== 'undefined') {
      currents = options.current
    }

    var _source = options.from; 
    var _myself = app.getStorageName('myself');
    that.setData({
      myself: _myself,
      mobile: _myself.user.mobile,
      source: _source
    });
    app.request('/api/part_job/detail/' + options.josId, function (res) {
      if (res) {
        for(var i=0;i<res.length;i++){
          res[i].start_time.splice(0,10);
          console.log(res[i].start_time);
        }
        var lat = parseFloat(res.company.lat);
        var lng = parseFloat(res.company.lon);
        console.log(res+'详情');
        that.setData({
          details: res,
          lat: lat,
          lng: lng
        })
        if (res.jianzhi.show_commit) {
          wx.showModal({
            title: '提示',
            content: '您已被录用请及时联系商家哟',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
        var address = that.data.details.jianzhi.address;
        console.log(address +'address');
        // 实例化API核心类
        var showMap = new QQMapWX({
          key: 'HEBBZ-QV3CI-33AGU-535Y5-HN6PF-XSBQK' // 必填
        });
        showMap.geocoder({
          address: address,
          success: function (res) {
            console.log(res);
            that.setData({
              lat: res.result.location.lat,
              lng: res.result.location.lng
            })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      }
    }, {},'manage');

  },
  // 报名按钮
  showForm:function(){
      this.setData({
        ifShow:true
      })
  },
  hideForm:function(){
    this.setData({
      ifShow: false
    })
  },
  submit:function(){
    // 验证表单填写完整
    this.setData({
      ifShow: false
    });
    wx.showToast({
      title: '信息已提交',
      icon: 'success',
      // image: '',
      duration: 2000,
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 发起报名
  postForm:function(e){
    var that=this;
    // 验证表单填写完整
    if (e.detail.value.name==''){
      wx.showModal({
        title: '提示',
        content: '请填写您的姓名',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }
        }
      })
      return
    };
    if (e.detail.value.mobile == '') {
      wx.showModal({
        title: '提示',
        content: '请填写您的电话',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }
        }
      })
      return
    };
    if (e.detail.value.intr == '') {
      wx.showModal({
        title: '提示',
        content: '请填写您的个人描述',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }

        }
      })
      return
    };
    var token = app.getStorageName('token');
    console.log();
    app.request('/api/part_job/auth_publish_sign?token=' + token + '&project_id=' + that.data.details.jianzhi.id + '&name=' + e.detail.value.name + '&self_des=' + e.detail.value.intr + '&mobile=' + e.detail.value.mobile, function (res) {
      if (res) {
        that.setData({
          ifShow: false
        });
        wx.showToast({
          title: '信息已提交',
          icon: 'success',
          // image: '',
          duration: 2000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        });
        setTimeout(function () {
          //要延时执行的代码
          wx.switchTab({
            url: '../../common/myself'
          })
        }, 2200)
      }
    }, 'POST');
  },
  //定位 导航
  showMap:function(){


    wx.openLocation({
      latitude: this.data.lat,
      longitude: this.data.lng,
      scale: 18,
      name: this.data.details.company.name,
      address: this.data.details.jianzhi.address
    })
  },
  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgs = this.data.details.jianzhi.images;
    var image_new_arr = [];
    console.log(imgs);
    for (var i in imgs) {
      image_new_arr.push(imgs[i].url);
    }
    app.previewImage(image_new_arr, index);
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
      //console.log('a');
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        'request_data.type_id':types,
        'request_data.length_type':times,
         currentClass: currents,
         triger:false
      });
      // setTimeout(function(){
      //   wx.pageScrollTo({
      //     scrollBottom: 450,
      //     duration: 300
      //   })
      // },300)
      // setTimeout(function(){
      //   prevPage.onReachBottom();
      // },1500);
   
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