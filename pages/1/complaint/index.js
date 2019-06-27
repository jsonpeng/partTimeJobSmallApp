// pages/1/complaint/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post_images:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options.id+'optionsid');
      console.log(options);
      var _myself = app.getStorageName('myself');
      this.setData({
        pastId: options.id,
        project_id: options.ProjectId,
        myself: _myself
      });
  },
  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })

  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        _this.setData({
          logo: res.tempFilePaths[0],
        });
        let img_arr = _this.data.post_images;
        if (img_arr.length >= 6) {
          app.alert('已超过最大上传数量');
          return false;
        }
        //上传图片请求
        app.upload_file('/api/mini_program/upload_images', res.tempFilePaths[0], function (res) {
          console.log(res);
          res = JSON.parse(res);

          img_arr.push(res.data.src);
          _this.setData({
            post_images: img_arr
          })
          //把数据动态传递到视图
        });
      }
    })
  },
  postForm:function(e){
    var that = this;
    if (e.detail.value.reason == '') {
      wx.showModal({
        title: '提示',
        content: '请填写投诉原因',
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
    if (e.detail.value.contents == '') {
      wx.showModal({
        title: '提示',
        content: '请填写投诉内容',
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
    var usertype = this.data.myself.user.type;
    if (usertype=='个人'){
      app.request('/api/part_job/auth_error_company/' + this.data.project_id + '?token=' + '&type=' + e.detail.value.reason + '&reason=' + e.detail.value.contents , function (res) {
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
    } else if (usertype == '企业'){
      app.request('/api/part_job/company_error_auth/' + this.data.pastId + '?token=' + '&type=' + e.detail.value.reason + '&reason=' + e.detail.value.contents + '&project_id=' + this.data.project_id, function (res) {
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