
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
    var myself = app.getStorageName('myself');
    var add = app.getStorageName('address');
    this.setData({
      'myself': myself.user,
      type: app.app_type,
      'add': add
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
            'post_images': img_arr
          })
          //把数据动态传递到视图
        });
      }
    })
  },
  postForm:function(e){
    var that=this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
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
    if (e.detail.value.address == '') {
      wx.showModal({
        title: '提示',
        content: '请填写企业地址',
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
        content: '请填写联系人',
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
    if (e.detail.value.phone == '') {
      wx.showModal({
        title: '提示',
        content: '请填写联系电话',
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
    if (!myreg.test(e.detail.value.phone)){
      wx.showModal({
        title: '提示',
        content: '请填写正确手机号',
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
    if (e.detail.value.info == '') {
      wx.showModal({
        title: '提示',
        content: '请填写企业信息',
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
    var strings = this.data.add;
    var token = app.getStorageName('token');
    app.request('/api/part_job/auth_apply_company?token=' + token + '&name=' + e.detail.value.company + '&contact_man=' + e.detail.value.name + '&mobile=' + e.detail.value.phone + '&intro=' + e.detail.value.info + '&company_images=' + this.data.post_images + '&detail=' + this.data.add + '&province=' + this.data.myself.province + '&city=' + this.data.myself.city, function (res) {
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
  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;
    var imageindex = e.currentTarget.dataset.imageindex;
    var image_arr = this.data.post_images;
    var image_new_arr = [];
    console.log(image_arr);
    console.log(image_new_arr);
    //处理image_arr
    for (var i in image_arr) {
      image_new_arr.push(image_arr[i]);
    }
    app.previewImage(image_new_arr, imageindex);
  },
  delImage: function (e) {
    var that = this;
    var imgs = that.data.post_images;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    that.setData({
      post_images: imgs
    });
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