// pages/2/paotui/daishou.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar:['已发布','待收货','已收货','待送达','已收款'],
    reachBottom:true
  },
  toPay:function(e){
    wx.navigateTo({
      url: '../paotui/pay',
    })
  },
  deleteItems:function(e){
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let items = this.data.tasks;
    var that=this;
    wx.showModal({
      title: '确定删除当前记录吗？',
      success: function (res) {
        if (res.confirm) {
          app.joinDeleteItems(id);
          items.splice(index, 1);
          that.setData({
            tasks: items
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var navbar = that.data.navbar;
    var curNavbar = app.getStorageName('curNavbar');
    console.log(curNavbar);
    if (!curNavbar){
      curNavbar = 0
    }
    var status = navbar[curNavbar];
    console.log(status);
    
    if (curNavbar > 2) {
      app.request('/api/errand/tasks/' + 'errander', function (res) {
        if (res) {
          res = app.varifyItems(res);
          console.log(res);
          that.setData({
            tasks: res,
            curNavbar: curNavbar
          })
        }
      }, { status: status,skip:0,take:10}, 'manage')
    } else {
      app.request('/api/errand/tasks/' + 'publisher', function (res) {
        if (res) {
          res = app.varifyItems(res);
          console.log(res);
          that.setData({
            tasks: res,
            curNavbar: curNavbar
          })
        }
      }, { status: status, skip: 0, take: 10 }, 'manage')
    }
  },
  switchTab:function(e){
    var curNavbar=e.currentTarget.dataset.index;
    app.saveStorageName('curNavbar',curNavbar);
    var that=this;
    var navbar = that.data.navbar;
    var status=navbar[curNavbar];
    console.log(status);
    if (curNavbar > 2) {
      app.request('/api/errand/tasks/' + 'errander', function (res) {
        if (res) {
          res = app.varifyItems(res);
          that.setData({
            tasks: res,
            curNavbar: curNavbar,
            reachBottom:true
          })
        }
      }, { status: status, skip: 0, take: 10}, 'manage')
    }else{
      app.request('/api/errand/tasks/' + 'publisher', function (res) {
        if (res) {
          res = app.varifyItems(res);
          that.setData({
            tasks: res,
            curNavbar: curNavbar,
            reachBottom: true
          })
        }
      }, { status: status, skip: 0, take: 10}, 'manage')
    }
  },
  pub_confirm:function(e){
    this.confirm(e, this, 'enter_receive_task')
  },
  err_confirm:function(e){
    this.confirm(e, this, 'enter_arrive_task')
  },
  confirm: function (e, obj, conf_type){
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var that = obj;
    var tasks = that.data.tasks;
    app.request('/api/errand/'+conf_type+'/' + id, function (res) {
      if (res) {
        wx.showToast({
          title: '成功',
          icon:'suuccess',
        })
        if (conf_type =='enter_receive_task'){
          tasks.splice(index, 1);
          that.setData({
            tasks: tasks
          })
        }else{
          that.onLoad();
        }
      }
    }, {}, 'manage')
  },
  wufei_confirm:function(e){
    var wufei_task= e.currentTarget.dataset.content;
    app.saveStorageName('wufei_task', wufei_task);
    wx.navigateTo({
      url: '../paotui/pay'
    })
  },
  delete_task:function(e){
    var id=e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var tasks=that.data.tasks;
    // var arr = []
    // for (let i in tasks) {
    //   let o = {};
    //   o[i] = tasks[i];
    //   arr.push(o)
    // }
    wx.showModal({
      title: '确定删除当前记录吗？',
      success: function (res) {
        if(res.confirm){
          app.request('/api/errand/del_task/' + id, function (res) {
            if (res) {
              tasks.splice(index,1);
              that.setData({
                tasks:tasks
              })
              wx.showToast({
                title: '删除成功',
                icon:'none'
              })
            }
          }, {}, 'manage')
        }else{
          console.log('用户点击取消')
        }
      }
    })
  },
  cancel_task:function(e){
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var tasks = that.data.tasks;
    wx.showModal({
      title: '您确定要取消吗？',
      success: function (res) {
        if (res.confirm) {
          app.request('/api/errand/cancle_task/' + id, function (res) {
            if (res) {
              app.meInfo();
              that.onLoad();
            }
          }, {}, 'manage')
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
  toComplaint:function(e){
    var complaint_task=e.currentTarget.dataset.content;
    app.saveStorageName('complaint_task',complaint_task);
    wx.navigateTo({
      url: '../paotui/complaint_detail'
    })
  },
  toDetail:function(e){
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../paotui/detail?id='+id
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
    this.onLoad();
  },
  // countDown:function(){
  //   let that = this;
  //   let endTime = that.data.task.current_wish_time;
  //   let newDate = new Date();
  //   var year = withData(newDate.getFullYear()),
  //     mont = withData(newDate.getMonth() + 1),
  //     date = withData(newDate.getDate()),
  //     hour = withData(newDate.getHours()),
  //     minu = withData(newDate.getMinutes()),
  //     seco = withData(newDate.getSeconds());
  //   let curTime = year+'-'+mont+'-'+date+' '+hour+':'+minu+':'+seco;
  //   that.setData({
  //     timer: setInterval(function () {
  //       countDownNum--;
        
  //       that.setData({
  //         countDownNum: countDownNum
  //       })
        
  //       if (countDownNum == 0) {
  //         clearInterval(that.data.timer);
         
  //       }
  //     }, 1000)
  //   })

  // },
  // GetDateDiff:function(startTime, endTime, diffType) {
  //   //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
  //   startTime = startTime.replace(/\-/g, "/");
  //   endTime = endTime.replace(/\-/g, "/");
  //   //将计算间隔类性字符转换为小写
  //   diffType = diffType.toLowerCase();
  //   var sTime = new Date(startTime); //开始时间
  //   var eTime = new Date(endTime); //结束时间
  //   //作为除数的数字
  //   var timeType = 1;
  //   switch(diffType) {
  //       case"second":
  //     timeType =1000;
  //     break;
  //     case"minute":
  //     timeType =1000 * 60;
  //     break;
  //     case"hour":
  //     timeType =1000 * 3600;
  //     break;
  //     case"day":
  //     timeType =1000 * 3600 * 24;
  //     break;
  //     default:
  //         break;
  //   }
  //     return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
  // },
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
    var that = this;
    var tasks=that.data.tasks;
    var skip=tasks.length;
    if(skip%10==0){
      var navbar = that.data.navbar;
      var curNavbar = app.getStorageName('curNavbar');
      console.log(curNavbar);
      if (!curNavbar) {
        curNavbar = 0
      }
      var status = navbar[curNavbar];
      if (curNavbar > 2) {
        app.request('/api/errand/tasks/' + 'errander', function (res) {
          if(app.empty(res)){
            that.setData({
              reachBottom: false
            })
          }else{
            app.autoContactArr(tasks, res);
            that.setData({
              tasks: tasks,
              curNavbar: curNavbar
            })
          }
        }, { status: status, skip:skip, take: 10 }, 'manage')
      } else {
        app.request('/api/errand/tasks/' + 'publisher', function (res) {
          if (app.empty(res)) {
            that.setData({
              reachBottom: false
            })
          } else {
            app.autoContactArr(tasks, res);
            that.setData({
              tasks: tasks,
              curNavbar: curNavbar
            })
          }
        }, { status: status, skip: skip, take: 10 }, 'manage')
      }
    }else{
      that.setData({
        reachBottom: false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})