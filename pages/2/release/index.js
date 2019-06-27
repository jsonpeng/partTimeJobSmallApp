// pages/release/index.js
var dateTimePicker = require('../../../zcjy/dateTimePicker.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected:false,
    saveHidden:true,
    cust_type:['无需额外费用','需支付物品费用'],
    sel_cust_type:'无需额外费用',
    radios:['物品费用','待买手确认'],
    no_pay:true,
    saveHidden1:true,
    wait_buyer_enter:0,
    startYear: 2000,
    endYear: 2050,
    current_remain_time:'请输入任务截止时间',
    current_wish_time:'请输入期望送达时间',
    task:{},
    post_images:[],
    is_first_sub:true
  },
  goBack:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  sel_tem:function(){
    this.setData({
      saveHidden:false,
      selected:false
    })
  },
  selTem:function(e){
    var selTem=this.data.selTem;
    var input=selTem.split('_');
    if(selTem[0]=='_'){
      input.splice(0,1);
    }
    if(selTem[selTem.length-1]=='_'){
      input.splice(-1,1);
    }
    this.setData({
      input:input,
    })
    console.log(input);
  },
  radioChange1: function (e) {
    var selTem = e.detail.value;
    var tems=this.data.tems;
    var tem_id;
    for(var i=0;i<tems.length;i++){
      if(tems[i].content==selTem){
        tem_id=tems[i].id
      }
    }
    if (!app.empty(this.data.task.tem_word1)){
      delete this.data.task.tem_word1;
    }
    if (!app.empty(this.data.task.tem_word2)) {
      delete this.data.task.tem_word2;
    }
    if (!app.empty(this.data.task.tem_word3)) {
      delete this.data.task.tem_word3;
    }
    this.setData({
      task:this.data.task,
      selTem: selTem,
      tem_id:tem_id
    })
  },
  chooseImageTap: function (e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album', index)
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera', index)
          }
        }
      }
    })
  },
  chooseWxImage: function (type, index) {
    let _this = this;
    var task = _this.data.task;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        // product.image = res.tempFilePaths[0]
        let img_arr = _this.data.post_images;
        if (img_arr.length > 6) {
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
          // img_arr.splice(index,1,(res.data.src));
          
          //把数据动态传递到视图
        });
      }
    })
  },
  delImage: function (e) {
    var that=this;
    var imgs =that.data.post_images;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    that.setData({
      post_images: imgs
    });
  },
  previewImage:function(e){
    var index = e.currentTarget.dataset.index;
    var imgs = this.data.post_images;
    wx.previewImage({
      current: imgs[index],
      urls: imgs
    })
  },
  confirm:function(){
    this.selTem();
    // this.getWidth();
    
    this.setData({
      saveHidden:true,
      selected:true,
    })
  },
  pull:function(){
    if(this.data.saveHidden1==true){
      this.setData({
        saveHidden1: false
      })
    }else{
      this.setData({
        saveHidden1: true
      })
    }
  },
  radioChange:function(e){
    console.log(e.detail.value);
    if(e.detail.value=='物品费用'){
      this.setData({
        no_pay:false,
        wait_buyer_enter: 0
      })
    }else{
      this.data.task.item_cost='';
      this.setData({
        no_pay: true,
        task:this.data.task,
        wait_buyer_enter:1
      })
    }
  },
  sel_custType:function(e){
    if (e.currentTarget.dataset.type=='无需额外费用'){
      this.data.task.item_cost='';
      this.setData({
        sel_cust_type: e.currentTarget.dataset.type,
        wait_buyer_enter: 0,
        saveHidden1: true,
        task:this.data.task
      })
    }else{
      this.setData({
        sel_cust_type: e.currentTarget.dataset.type,
        saveHidden1: true
      })
    }
  },
  chooseMap: function (e) {
    var that=this;
    var task=that.data.task;
    wx.chooseLocation({
      success: function (res) {
        task['lat']=res.latitude;
        task['lon']=res.longitude;
        task['address'] = res.address;
        that.setData({
          task: task
        })
      }
    })
  },
  taskInput:function(e){
    app.input(e,this);
  },
  // taskInput0:function(e){
  //   let temWidth1 = this.data.temWidth1;
  //   let l = e.detail.value.length;
  //   console.log(e.detail.value.length);
  //   if (l > 7) {
  //     temWidth1 += 16;
  //   }
  //   this.setData({
  //     temWidth1: temWidth1
  //   })
  // },
  submit:function(e){
    var task=this.data.task;
    var sel_cust_type = this.data.sel_cust_type;
    var input = this.data.input;
    var taskName = '';
    var images = this.data.post_images;
    if (sel_cust_type == '需支付物品费用' && app.empty(task.item_cost) && this.data.wait_buyer_enter!=1){
      wx.showToast({
        title: '请输入物品费用',
        icon:'none',
      })
      return
    }
    for(var i=0;i<input.length;i++){
      if(input[i]==''){
        taskName +='undefined';
      }else{
        taskName += input[i];
      }
    }
    console.log(taskName);
    task.name=taskName;
    if (!app.isContains(taskName,'undefined') && app.empty(task.tem_word2)){
      task.tem_word2=task.tem_word1;
    }
    if (app.empty(task.mobile)) {
      task.mobile = this.data.user.mobile;
    }
    if(images.length>0){
      var str = '';
      for (var i = 0; i < images.length; i++) {
        if (i == 0) {
          str += images[i];
        } else {
          str += ',' + images[i];
        }
      }
      task.images = str;
    }
    task.tem_id=this.data.tem_id;
    task.school_name=app.getStorageName('selSchool').name;
    task.wait_buyer_enter = this.data.wait_buyer_enter;
    task.price_type = this.data.sel_cust_type;
    task['current_remain_time']=this.data.current_remain_time;
    task['current_wish_time']= this.data.current_wish_time;
    var that=this;
    if(app.save(task) && that.data.is_first_sub==true){
      that.setData({
        is_first_sub: false
      })
      app.request('/api/errand/publish_task', function (res) {
        if (res) {
          that.setData({
            task: { lat: app.globalData.latitude, lon: app.globalData.longitude, address: app.getStorageName('address') },
            address: '',
            current_remain_time: '请输入截止任务时间',
            current_wish_time: '请输入期望送达时间',
            post_images: []

          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            mask: true,
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.navigateTo({
                  url: '../release/pay?id=' + res.task.id,
                })
              },2200)
            }
          })
          
        }else{
          that.setData({
            is_first_sub: true
          })
        }
      }, task, 'manage')
    }
  },
  // getWidth(){
  //   var query = wx.createSelectorQuery();
  //   //选择id
  //   var that = this;
  //   var width=0;
  //   var temWidth0, temWidth1, temWidth2;
  //   query.selectAll('.every').boundingClientRect(function (rects) {
  //     rects.forEach(function (rect) {
  //       width+=rect.width;
  //     })
  //     temWidth0=Math.floor((345-width)/2);
  //     console.log(temWidth0);
  //     that.setData({
  //       temWidth1: temWidth0,
  //       temWidth2: temWidth0
  //     })
  //   }).exec();
  // },
  hidden:function(){
    this.setData({
      saveHidden:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var newDate = new Date();
    var year = that.withData(newDate.getFullYear()),
      mont = that.withData(newDate.getMonth() + 1),
      date = that.withData(newDate.getDate());
    var task=that.data.task;
    task['lat'] = app.globalData.latitude;
    task['lon'] = app.globalData.longitude;
    task['address'] = app.getStorageName('address');
    var user=app.getStorageName('myself').user;
    app.request('/api/errand/all_tems', function (res) {
      if(res){
        that.setData({
          tems:res,
          school_name: app.getStorageName('selSchool').name,
          task:task,
          user:user,
          curDate: year + '-' + mont + '-' + date
        })
      }
    }, {}, 'manage')
    // var obj = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear);
    // // 精确到分的处理，将数组的秒去掉
    // var lastArray = obj.dateTimeArray.pop();
    // var lastTime = obj.dateTime.pop();
    // that.setData({
    //   dateTimeArray: obj.dateTimeArray,
    //   dateTime: obj.dateTime
    // });
  },
  changeTime(e) {
    var curDate=this.data.curDate;
    var current_remain_time=curDate+' '+e.detail.value;
    this.setData({ current_remain_time: current_remain_time });
  },
  changeTime1(e) {
    var curDate = this.data.curDate;
    var current_wish_time = curDate + ' ' + e.detail.value;
    this.setData({ current_wish_time: current_wish_time });
  },
  withData: function (param) {
    return param < 10 ? '0' + param : '' + param;
  },
  // changeDateTime(e) {
  //   var that=this;
  //   var dateTime=that.data.dateTime;
  //   var dateTimeArray=that.data.dateTimeArray;
  //   var current_remain_time = dateTimeArray[0][dateTime[0]] +
  //     '-' + dateTimeArray[1][dateTime[1]] + '-' + dateTimeArray[2][dateTime[2]] + ' ' + dateTimeArray[3][dateTime[3]] + ':' + dateTimeArray[4][dateTime[4]]
  //   that.setData({ current_remain_time: current_remain_time});
  // },
  // changeDateTime1(e) {
  //   var that = this;
  //   var dateTime = that.data.dateTime;
  //   var dateTimeArray = that.data.dateTimeArray;
  //   var current_wish_time = dateTimeArray[0][dateTime[0]] +
  //     '-' + dateTimeArray[1][dateTime[1]] + '-' + dateTimeArray[2][dateTime[2]] + ' ' + dateTimeArray[3][dateTime[3]] + ':' + dateTimeArray[4][dateTime[4]]
  //   that.setData({ current_wish_time: current_wish_time });
  // },
  // changeDateTimeColumn(e){
  //   var that = this;
  //   var arr = that.data.dateTime, dateArr = that.data.dateTimeArray;
  //   arr[e.detail.column] = e.detail.value;
  //   dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
  //   var current_remain_time = dateArr[0][arr[0]] +
  //     '-' + dateArr[1][arr[1]] + '-' + dateArr[2][arr[2]] + ' ' + dateArr[3][arr[3]] + ':' + dateArr[4][arr[4]]
  //   that.setData({ current_remain_time: current_remain_time });
  // },
  // changeDateTimeColumn1(e) {
  //   var that = this;
  //   var arr = that.data.dateTime, dateArr = that.data.dateTimeArray;
  //   arr[e.detail.column] = e.detail.value;
  //   dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
  //   var current_wish_time = dateArr[0][arr[0]] +
  //     '-' + dateArr[1][arr[1]] + '-' + dateArr[2][arr[2]] + ' ' + dateArr[3][arr[3]] + ':' + dateArr[4][arr[4]]
  //   that.setData({ current_wish_time: current_wish_time });
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.setTabBar(app.app_type, this);
    this.setData({
      is_first_sub:true
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