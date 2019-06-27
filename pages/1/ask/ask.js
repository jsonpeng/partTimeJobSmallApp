// pages/1/ask/ask.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar:{
      1:['已报名', '已录用', '已结算'],
      2:['已发布','已报名','已录用','已结算']
    },
    currentTab: 0,
    notVip: false,
    askList:'',
    titleList:'',
    userList:'',
    pullDown:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var myself = app.getStorageName('myself');
    that.setData({
      type:app.app_type,
      myself: myself,
      state: options.status
    })
    // 获取所有申请
    var myself = app.getStorageName('myself');
    console.log(myself.type+'myself');
    that.setData({
      type:app.app_type,
      'myself': myself.user
    })
    // 获取所有申请
    // 获取申请状态
    var status = options.status;
    var token = app.getStorageName('token');
    var _arry=[];
    console.log(status+'查询对应状态信息');
    if (myself.user.type == '企业' && !app.empty(myself.company)){
      // 获取企业申请查看顶部筛选菜单栏
      app.request('/api/part_job/auth_publish_companys?' + 'token=', function (res) {
    
        if (res) {
          var arry=res;
          for(var i=0;i<arry.length;i++){
            if (arry[i].project_sign.length>0){
              var status_num = 0;
              for (var j = 0; j < arry[i].project_sign.length;j++){
                if (arry[i].project_sign[j].status == status){
                  ++status_num ;
                }
              }
              console.log(status_num);
              arry[i]['status_num'] = status_num;
            }
           
          }
          that.setData({
            titleList: arry
          });
        }
      }, {}, true);
    };
    if(status =='已发布'){

      app.request('/api/part_job/auth_publish_companys?' + 'token=', function (res) {
        if (res) {
          that.setData({
            askList: res

          });
        }
      }, {},true);
    }else if(status!==''&&status!=='已发布'){
      var navbar = this.data.navbar;
      var arry = navbar[this.data.myself.type == '个人' ? 1 : 2];
      var _i;
      for(var i=0;i<arry.length;i++){
        if(arry[i]==status){
           _i=i;
        }    
      }
      console.log(myself.type);
      console.log(arry);
      console.log(_i+'i');
      app.request('/api/part_job/auth_signs?' + 'token='+'&status='+status, function (res) {
        if (res) {
          that.setData({
            askList: res,
            currentTab:_i
          });
        }
      }, {}, true);
    }

  },
  // 企业版申请查询切换
  switchFind:function(){
    var that=this;
    if (this.data.pullDown==false){
      that.setData({
        pullDown: true,
        userList:'',
        jobsName:''
      })
    }else{
      that.setData({
        pullDown: false,
        userList: '',
        jobsName: ''
      })
    }
  },
  // 选择不同兼职类型查看当前状态下的用户数量
  changeName:function(e){
    var that=this;
    var _jobsName = e.currentTarget.dataset.name;
    var usernum = e.currentTarget.dataset.num;
    var _project_id = e.currentTarget.dataset.project_id;
    this.setData({
      jobsName: _jobsName,
      project_sign: usernum,
      pullDown: false,
    });
    app.request('/api/part_job/publish_project_sign/'+_project_id + '?token=' + '&status=' + this.data.state, function (res) {
      if (res) {
        that.setData({
          userList: res
        });
      }
    }, {}, true);  
  },
  navbarTap: function (e) {
    var that=this;
    let index = parseInt(e.currentTarget.dataset.idx);
    // if (index == 3) {
    //   wx.redirectTo({
    //     url: '../orders/orders?order_id=2',
    //   })
    // }
    // app.getServices(this, this.data.themeData.navbar[index]);
    var navbar = this.data.navbar;
    var myself = this.data.myself;
    var arrys = navbar[myself.type == '个人' ? 1 : 2];
    var status=arrys[index];
    var _arry=[];
    var myself = app.getStorageName('myself');
    this.setData({
      currentTab: index
    });
    if (status=='已发布'){
      app.request('/api/part_job/auth_publish_companys?' + 'token=', function (res) {
        if (res) {
          that.setData({
            askList: res,
            state: status,
            pullDown:false
          });
        }
      }, {}, true);
    }else{
      app.request('/api/part_job/auth_signs?' + 'token=' + '&status=' + status, function (res) {
        if (res) {
          that.setData({
            askList: res,
            state: status,
            pullDown: true,
            jobsName:'',
            userList:''
          });
        }
      }, {}, true);
    }

    if (myself.user.type == '企业' && !app.empty(myself.company)) {
      // 获取企业申请查看顶部筛选菜单栏
      app.request('/api/part_job/auth_publish_companys?' + 'token=', function (res) {

        if (res) {
          var arry = res;
          for (var i = 0; i < arry.length; i++) {
            if (arry[i].project_sign.length > 0) {
              var status_num = 0;
                for (var j = 0; j < arry[i].project_sign.length; j++) {
                  if (arry[i].project_sign[j].status == status) {
                    ++status_num;
                  }
                }
              console.log(status_num);
              arry[i]['status_num'] = status_num;
            }

          }
          that.setData({
            titleList: arry
          });
        }
      }, {}, true);
    };
  
  },
  // 确认收款
  affirm: function (e) {
    let projectID = e.currentTarget.dataset.info;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '请确认已收到工资',
      success: function (res) {
        if (res.confirm) {
          app.request('/api/part_job/enter_project_price/' + projectID + '?token', function (res) {
            if (res) {
              app.request('/api/part_job/auth_signs?' + 'token=' + '&status=' + '已结算', function (res) {
                if (res) {
                  that.setData({
                    askList: res,
                    currentTab: 2
                  });
                }
              }, {}, true);
            }
          }, {}, true);
        } else if (res.cancel) {
          console.log('取消')
        }
      }
    })

  },
  saveIntr:function(e){
    app.saveStorageName('selfIntr', e.currentTarget.dataset.intr);
    app.saveStorageName('applyID', e.currentTarget.dataset.id);
    app.saveStorageName('mobile', e.currentTarget.dataset.mobile);
    app.saveStorageName('state', e.currentTarget.dataset.state);
    wx.redirectTo({
      url: '../selfIntr/index',
    })
  },
  cancel_item:function(e){
    var jobsId = e.currentTarget.dataset.id;
    var that=this;
    var status = this.data.state;
    console.log(jobsId);
    wx.showModal({
      title: '提示',
      content: "确定撤销当前记录吗",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          app.request('/api/part_job/company_cancle_project/' + jobsId + '?token=', function (res) {
            if (res) {
              if (status == '已发布') {
                app.request('/api/part_job/auth_publish_companys?' + 'token=', function (res) {
                  if (res) {
                    that.setData({
                      askList: res,
                      state: status,
                      pullDown: false
                    });
                  }
                }, {}, true);
              } else {
                app.request('/api/part_job/auth_signs?' + 'token=' + '&status=' + status, function (res) {
                  if (res) {
                    that.setData({
                      askList: res,
                      state: status,
                      pullDown: false,
                      jobsName: '',
                      userList: ''
                    });
                  }
                }, {}, true);
              }
            }
          }, {}, true);
        } else {
          console.log('用户点击取消')
        }

      }
    })
  },
  delete_item: function (e) {
    var jobsId = e.currentTarget.dataset.id;
    var that = this;
    var status = this.data.state;
    console.log(jobsId);
    wx.showModal({
      title: '提示',
      content: "确定删除当前记录吗",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          app.request('/api/part_job/company_del_project/' + jobsId + '?token=', function (res) {
            if (res) {
              if (status == '已发布') {
                app.request('/api/part_job/auth_publish_companys?' + 'token=', function (res) {
                  if (res) {
                    that.setData({
                      askList: res,
                      state: status,
                      pullDown: false
                    });
                  }
                }, {}, true);
              } else {
                app.request('/api/part_job/auth_signs?' + 'token=' + '&status=' + status, function (res) {
                  if (res) {
                    that.setData({
                      askList: res,
                      state: status,
                      pullDown: false,
                      jobsName: '',
                      userList: ''
                    });
                  }
                }, {}, true);
              }
            }
          }, {}, true);
        } else {
          console.log('用户点击取消')
        }

      }
    })
  },
  delete_item_company:function(e){
    var jobsId = e.currentTarget.dataset.id;
    var that = this;
    var status = this.data.state;
    var myself = app.getStorageName('myself');
    console.log(jobsId);
    wx.showModal({
      title: '提示',
      content: "确定删除当前记录吗",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          app.request('/api/part_job/company_del_sign/' + jobsId + '?token=', function (res) {
            if (res) {
              if (status == '已发布') {
                app.request('/api/part_job/auth_publish_companys?' + 'token=', function (res) {
                  if (res) {
                    that.setData({
                      askList: res,
                      state: status,
                      pullDown: false
                    });
                  }
                }, {}, true);
              } else {
                app.request('/api/part_job/auth_signs?' + 'token=' + '&status=' + status, function (res) {
                  if (res) {
                    that.setData({
                      askList: res,
                      state: status,
                      pullDown: false,
                      jobsName: '',
                      userList: ''
                    });
                  }
                }, {}, true);
              }

              if (myself.user.type == '企业' && !app.empty(myself.company)) {
                // 获取企业申请查看顶部筛选菜单栏
                app.request('/api/part_job/auth_publish_companys?' + 'token=', function (res) {

                  if (res) {
                    var arry = res;
                    for (var i = 0; i < arry.length; i++) {
                      if (arry[i].project_sign.length > 0) {
                        var status_num = 0;
                        if (arry[i].company_status != 1) {
                          for (var j = 0; j < arry[i].project_sign.length; j++) {
                            if (arry[i].project_sign[j].status == status) {
                              ++status_num;
                            }
                          }
                        }
                        console.log(status_num);
                        arry[i]['status_num'] = status_num;
                      }

                    }
                    that.setData({
                      titleList: arry
                    });
                  }
                }, {}, true);
              };
            }
          }, {}, true);
        } else {
          console.log('用户点击取消')
        }

      }
    })
  },
  delete_item_user:function(e){
    var jobsId = e.currentTarget.dataset.id;
    var that = this;
    var status = this.data.state;
    console.log(jobsId);
    wx.showModal({
      title: '提示',
      content: "确定删除当前兼职吗",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          app.request('/api/part_job/auth_del_sign/' + jobsId + '?token=', function (res) {
            if (res) {
              if (status == '已发布') {
                app.request('/api/part_job/auth_publish_companys?' + 'token=', function (res) {
                  if (res) {
                    that.setData({
                      askList: res,
                      state: status,
                      pullDown: false
                    });
                  }
                }, {}, true);
              } else {
                app.request('/api/part_job/auth_signs?' + 'token=' + '&status=' + status, function (res) {
                  if (res) {
                    that.setData({
                      askList: res,
                      state: status,
                      pullDown: false,
                      jobsName: '',
                      userList: ''
                    });
                  }
                }, {}, true);
              }
            }
          }, {}, true);
        } else {
          console.log('用户点击取消')
        }

      }
    })
  },
  complaint:function(e){
    var ProjectId = e.currentTarget.dataset.projectid; 
    var id = e.currentTarget.dataset.id;
    console.log(ProjectId +'ProjectId');
    console.log(id + 'Id');
    wx.navigateTo({
      url: '../complaint/index?id=' + id + '&ProjectId=' + ProjectId,
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
      this.on
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