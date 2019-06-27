// pages/1/opinion/index.js
var app = getApp();
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
    this.WxValidate = app.WxValidate(
      {
        email: {
          required: true,
          email: true
        },
        content: {
          required: true,
          minlength: 2,
          maxlength: 120,
        }
      }
      , {
        email: {
          required: '请填写正确邮箱',
        },
        content: {
          required: '请填写反馈内容',
        }
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 意见反馈提交
  postForm: function (e) {
    var that = this;
    // if (e.detail.value.email == '') {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请填您的收件邮箱',
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       } else {
    //         console.log('用户点击取消')
    //       }

    //     }
    //   })
    //   return false
    // };
    // if (e.detail.value.content == '') {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请填写您的反馈信息',
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       } else {
    //         console.log('用户点击取消')
    //       }

    //     }
    //   })
    //   return false
    // };
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0];
      // `${error.param} : ${error.msg} `
      wx.showModal({
        title: '提示',
        content: `${error.msg} `,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }

        }
      })
      return false
    }
    app.request('/api/mini_program/publish_feedback?token' + '&email=' + e.detail.value.email + '&content=' + e.detail.value.content, function (res) {
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
        });
        setTimeout(function () {
          //要延时执行的代码
          wx.navigateBack({
            url: '../../common/myself'
          })
        }, 2200)

      }
    }, {}, true);
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