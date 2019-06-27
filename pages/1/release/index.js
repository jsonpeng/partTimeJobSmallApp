// pages/release/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'day', value: '日' },
      { name: 'week', value: '周' },
      { name: 'mouth', value: '月' }
    ],
    genders: [
      { name: 'male', value: '男' },
      { name: 'female', value: '女'},
      { name: 'other', value: '不限' }
    ],
    jobsType:[
      { name: 'short', value: '短期兼职' },
      { name: 'middle', value: '中期兼职' },
      { name: 'long', value: '长期兼职' },
      { name: 'practice', value: '实习' }
    ],
    units:['小时','天','周','月'],
    charge:'',
    gender:'',
    post_images:[],
    address:'',
    charge:'',
    length_type:'',
    period:[],
    time_set:'',
    morning_start_time:'',
    afternoon_end_time :'',
    starttime:'',
    endtime:'',
    post_found:[],
    focus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前时间
    //获取当前时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);

    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时
    var h = date.getHours();
    //分
    var m = date.getMinutes();
    //秒
    var s = date.getSeconds();

    console.log("当前时间：" + Y +'-'+ M +'-'+ D +'   ' + h + ":" + m + ":" + s);


    //时间、时间戳加减 以加一天举例，聪明的你肯定触类旁通
    //加一天的时间戳：
    var tomorrow_timetamp = timestamp;
    //加一天的时间：
    var n_to = tomorrow_timetamp * 1000;
    var tomorrow_date = new Date(n_to);
    //加一天后的年份
    var Y_tomorrow = tomorrow_date.getFullYear();
    //加一天后的月份
    var M_tomorrow = (tomorrow_date.getMonth() + 1 < 10 ? '0' + (tomorrow_date.getMonth() + 1) : tomorrow_date.getMonth() + 1);
    //加一天后的日期
    var D_tomorrow = tomorrow_date.getDate() < 10 ? '0' + tomorrow_date.getDate() : tomorrow_date.getDate();
    //加一天后的时刻
    var h_tomorrow = tomorrow_date.getHours();
    //加一天后的分钟
    var m_tomorrow = tomorrow_date.getMinutes();
    //加一天后的秒数
    var s_tomorrow = tomorrow_date.getSeconds();


    //减一天的时间戳：
    var yesterday_timetamp = timestamp - 24 * 60 * 60;
    //减一天的时间：
    var n_to = yesterday_timetamp * 1000;
    var yesterday_date = new Date(n_to);
    //减一天后的年份
    var Y_yesterday =  yesterday_date.getFullYear();
    //减一天后的月份
    var M_yesterday = (yesterday_date.getMonth() + 1 < 10 ? '0' + (yesterday_date.getMonth() + 1) :  yesterday_date.getMonth() + 1);
    //减一天后的日期
    var D_yesterday = yesterday_date.getDate() < 10 ? '0' + yesterday_date.getDate() :  yesterday_date.getDate();
    //减一天后的时刻
    var h_yesterday =  yesterday_date.getHours();
    //减一天后的分钟
    var m_yesterday =  yesterday_date.getMinutes();
    //减一天后的秒数
    var s_yesterday =  yesterday_date.getSeconds();

    console.log("yesterday：" + Y_yesterday + '-' + M_yesterday + '-' + D_yesterday + '   ' + h_yesterday + ":" + m_yesterday + ":" + s_yesterday);
    console.log("tomorrow：" + Y_tomorrow + '-' + M_tomorrow + '-' + D_tomorrow + '   ' + h_tomorrow + ":" + m_tomorrow + ":" + s_tomorrow);
    var tomorrow = Y_tomorrow + '-' + M_tomorrow + '-' + D_tomorrow;
    var yesterday = Y_yesterday + '-' + M_yesterday + '-' + D_yesterday;
    this.WxValidate = app.WxValidate(
      {
        name: {
          required: true,
          minlength: 2,
          maxlength: 20,
        },

        price: {
          required: true,
          number: true,
          minlength: 1,
          maxlength: 10,
        },
        num: {
          required: true,
          digits: true,
          minlength: 1,
          maxlength: 10,
        },
        things: {
          required: true,
          minlength: 2,
          maxlength: 500,
        },
        add: {
          required: true,
          minlength: 2,
          maxlength: 120,
        },
        contact: {
          required: true,
          minlength: 1,
          maxlength: 10,
        },
        phone: {
          required: true,
          tel: true,
        }
      }
      , {
        name: {
          required: '请填写兼职名称',
        },
        price: {
          required: '请填写工资',
        },
        num: {
          required: '请填写所需人数',
        },
        things: {
          required: '请填写工作内容',
        },
        add: {
          required: '请填写工作地点',
        },
        contact: {
          required: '请填写联系人姓名',
        },
        phone: {
          required: '请填写联系人电话',
        }
      }
    );

    this.setData({
      type: app.app_type,
      address: '',
      nowDate: yesterday,
      tomorrow: tomorrow,
      focus:false
    });
    app.setTabBar(app.app_type, this);
    var myself = app.getStorageName('myself');
    this.setData({
      'myself': myself.user,
      'company': myself.company,
      phone: myself.user.mobile
    });
    var that=this;
    // 获取所有兼职类型
    app.request('/api/part_job/type_all', function (res) {
      if (res) {
        var arry = [];
        for (var i = 0; i < res.length; i++) {
          arry.push(res[i].name);
        }
        that.setData({
          "TypeList": res
        })
      }
    }, {});
  },
  // 地图选择地址
  chooseMap: function (e) {
    var that = this;
    var task = that.data.task;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        var lat = res.latitude;
        var lon = res.longitude;
        that.setData({
          address: res.address,
        })
      },
    })
  },
  back:function(){
    wx.switchTab({
      url: '../index/index',
    })
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
        // if (img_arr.length >= 6) {
        //   app.alert('已超过最大上传数量');
        //   return false;
        // }
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
  nokeybord:function(){
    this.setData({
      focus:false
    })
  },
  radioChange:function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      charge: e.detail.value
    })
  },
  jobsTypeChange:function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      length_type: e.detail.value
    })
  },
  TypeChange:function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var arry = e.detail.value;
    // for(var i=0;i<arry.length;i++){
    //   var strings;
    //   strings=strings+arry[i]+','
    // }
    // strings=strings.slice(9);
    // console.log(strings+'string');
    this.setData({
      period: e.detail.value
    })
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
  boxChange:function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      gender: e.detail.value
    })
  },
  unitChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      time_set: e.detail.value
    })
  },
  bindmorning_start_time:function(e){
    this.setData({
      morning_start_time: e.detail.value
    })
  },
  bindmorning_end_time: function (e) {
    this.setData({
      morning_end_time: e.detail.value
    })
  },
  bindafternoon_start_time: function (e) {
    this.setData({
      afternoon_start_time: e.detail.value
    })
  },
  bindafternoon_end_time: function (e) {
    this.setData({
      afternoon_end_time: e.detail.value
    })
  },
  // 点击发布兼职信息
  postForm: function (e) {

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
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
    };
    if (this.data.charge == '') {
      wx.showModal({
        title: '提示',
        content: '请选择结算周期',
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
    if (this.data.length_type == '') {
      wx.showModal({
        title: '提示',
        content: '请选择时间类型',
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
    if (this.data.gender==''){
      wx.showModal({
        title: '提示',
        content: '请选择性别要求',
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
    if (this.data.period == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择兼职类型',
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
    if (this.data.time_set == '') {
      wx.showModal({
        title: '提示',
        content: '请选择工资时间设置',
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
    if (this.data.morning_start_time == '') {
      wx.showModal({
        title: '提示',
        content: '请选择兼职开始日期',
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
    if (this.data.afternoon_end_time == '') {
      wx.showModal({
        title: '提示',
        content: '请选择兼职结束日期',
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
    if (this.data.starttime == '') {
      wx.showModal({
        title: '提示',
        content: '请选择上班时间',
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
    if (this.data.endtime == '') {
      wx.showModal({
        title: '提示',
        content: '请选择下班时间',
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
    var that = this;
    var token = app.getStorageName('token');
    var companyId = this.data.company.id;
    app.request('/api/part_job/auth_publish_project?token=' + token + '&name=' + e.detail.value.name + '&money=' + e.detail.value.price + '&time_type=' + this.data.charge + '&detail=' + e.detail.value.things + '&mobile=' + e.detail.value.phone + '&address=' + e.detail.value.add + '&rec_num=' + e.detail.value.num + '&project_images=' + this.data.post_images + '&sex_need=' + this.data.gender + '&start_time=' + this.data.morning_start_time + '&end_time=' + this.data.afternoon_end_time + '&morning_start_time=' + this.data.starttime + '&morning_end_time=' + this.data.endtime + '&afternoon_start_time=' + this.data.starttime + '&afternoon_end_time=' + this.data.endtime + '&type=' + this.data.myself.type + '&length_type=' + this.data.length_type + '&companyId=' + companyId + '&industries=' + this.data.period + '&time_set=' + this.data.time_set , function (res) {
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
          wx.switchTab({
            url: '../index/index'
          })
        }, 2200)
        that.setData({
          name: '',
          price: '',
          num: '',
          things: '',
          post_images: [],
          address: '',
          contact: '',
          morning_start_time: '',
          morning_end_time: '',
          afternoon_start_time: '',
          afternoon_end_time: '',
          phone: that.data.myself.mobile
        });
      }
    }, {}, true);
  },
  starttime: function (e) {
    this.setData({
      starttime: e.detail.value
    })
  },
  endtime: function (e) {
    this.setData({
      endtime: e.detail.value
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
    var that=this;
    app.meInfo();
    app.setTabBar(app.app_type, that);
    var myself = app.getStorageName('myself');
    this.setData({
      'myself': myself.user,
      'company': myself.company,
      phone: myself.user.mobile
    });
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