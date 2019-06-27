// pages/1/enterpriseInfo/index.js
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
    var myself = app.getStorageName('myself');
    that.setData({
      myself: myself
    });
  },
  postForm:function(e){
    var that = this;
    var myself = app.getStorageName('myself');

    if (e.detail.value.company == '') {
      wx.showModal({
        title: '提示',
        content: '请填写企业名称',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }

        }
      })
      return false
    };
    if (e.detail.value.name == '') {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }

        }
      })
      return false
    };
    if (e.detail.value.mobile == '') {
      wx.showModal({
        title: '提示',
        content: '请填写联系人电话',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }

        }
      })
      return false
    };
    if (e.detail.value.add == '') {
      wx.showModal({
        title: '提示',
        content: '请填写地址',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }

        }
      })
      return false
    };
    if (e.detail.value.intr == '') {
      wx.showModal({
        title: '提示',
        content: '请填写企业简介',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }

        }
      })
      return false
    };
    app.request('/api/part_job/auth_complete_company_info/' + myself.company.id + '?token=' + '&name=' + e.detail.value.company + '&mobile=' + e.detail.value.mobile + '&contact_man=' + e.detail.value.name + '&detail=' + e.detail.value.add + '&intro=' + e.detail.value.intr, function (res) {
      if (res) {
        wx.showToast({
          title: '信息已提交',
          icon: 'success',
          // image: '',
          duration: 2000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        setTimeout(function () {
          //要延时执行的代码
          wx.switchTab({
            url: '../../common/myself'
          })
        }, 2200)
      }
    }, {}, true);
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
    var that=this;
    that.setData({
      myself: ''
    });
    var myself = app.getStorageName('myself');
    that.setData({
      myself: myself
    })
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