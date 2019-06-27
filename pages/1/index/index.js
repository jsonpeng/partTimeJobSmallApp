// pages/index/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    triger:true,
    request_data:{
      skip:0,
      take:32,
      city:0,
      query:'',
      district:0,
      type_id:0,
      length_type:0,
    },
    hidden:false,
    jobs: [
      { name: '区域', list: [{ name: '全部' }] },
      { name: '类型', list: [{ name: '全部' }] },
      { name: '时间', list: [{name: '全部',id:0 },{ name: '短期兼职', id: 1 }, { name: '中期兼职', id: 2 }, { name: '长期兼职', id: 3 }, { name: '实习', id: 4 }] }
    ],

    showDetail:false,
    reachBottom:true,
    saveHidden:true,
    bgcolor:999,
    colors: ['ff8d29', '5ee6eb', 'bc70ff', 'ff6198', '3fd18a', 'ff645c','ffb914']
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('load');
    var that=this;
    app.setTabBar(app.app_type,that);
    // 获取当前用户所在位置城市
    app.request('/api/part_job/type_all', function (res) {
      if (res) {
        that.setData({
          type_all: res,
          'this.data.jobs[0].list':[{ name: '全部' }]
        })
      }
    }, {});
    let request_data = this.data.request_data;
    let type = app.app_type;
    var _city = app.getStorageName('cities');
    var _locaiton = app.getStorageName('selCity');
    // for (var i = 0; i < _city.length;i++){
    //   if (_city[i]['selected']==true){
    //     _locaiton = _city[i];
    //     request_data['city'] = _city[i]['id'];
    //   }
    // }

   // console.log(_locaiton.name+'此时为当前定位城市');
    that.setData({
      locaiton: _locaiton
    });
    console.log(_locaiton);
    // setTimeout(function () {
    //   app.getAlljobsList(that, request_data);
    // }, 500);
    
    // 获取对应城市下所有区
    // app.request('/api/part_job/cities_list?pid=' + _locaiton.id, function (res) {
    //   if (res) {
    //     var arry=[];
    //     for(var i=0;i<res.length;i++){
    //       arry.push(res[i].name);
    //     }
    //     that.setData({
    //       "jobs[0].contents": res
    //     })
    //   }
    // }, {});
    app.request('/api/part_job/get_province_id_by_name?name=' + _locaiton,function(pid){
        app.request('/api/part_job/cities_list?pid=' + pid, function (res) {
          if (res) {
            that.setData({
              'this.data.jobs[0].list': [{ name: '全部' }]
            })
            console.log(res+'res');
            for (var i = 0; i < res.length; i++) {
              that.data.jobs[0].list.push(res[i]);
            }
            that.setData({
              jobs: that.data.jobs
            })
          }
      }, {});
    });

    app.request('/api/part_job/type_all', function (res) {
      if (res) {
        for (var i = 0; i < res.length; i++) {
          that.data.jobs[1].list.push(res[i]);
        }
        that.setData({
          jobs: that.data.jobs
        })
      }
    }, {});
  },
  // 搜索框搜索
  searchword:function(e){
    var that=this;
    console.log(e.detail.value);
      if (e.detail.value != '') {
        app.request('/api/part_job/list_all?query=' + e.detail.value, function (res) {
          if (res) {
            // res = app.varifyType(res);
            that.setData({
              search_list: res
            })
          }
        }, {});
      } if (e.detail.value == ''){
        that.setData({
          search_list: ''
        })
      }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  // 默认搜索框weui
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //搜索
  // searchword: function (e) {
  //   app.searchProducts(this, e.detail.value);
  //   this.setData({
  //     inputShowed: true
  //   })
  // },
  //取消搜索
  searchCancel: function (e) {
    this.setData({
      search_list: [],
      search_val: '',
      inputShowed: false
    });
  },
  selClass: function (e) {
    var curIndex = e.currentTarget.dataset.index;
    console.log(curIndex+'当前选择的板块是');
    if (this.data.currentClass == curIndex) {
      this.setData({
        currentClass: 4,
        saveHidden: true,
      })
    } else {
      this.setData({
        currentClass: curIndex,
        saveHidden: false,
      })
    }
    if (curIndex == 0) {
      var that=this;
      var city = this.data.locaiton;
      app.request('/api/part_job/get_province_id_by_name?name=' + city, function (res) {
        if (res) {
          var cityId = res;
          app.request('/api/part_job/cities_list?pid=' + cityId, function (res) {
            if (res) {
              that.setData({
                'this.data.jobs[0].list': [{ name: '全部' }]
              })
              console.log(res + 'res');
              if (that.data.jobs[0].list.length==1){
                for (var i = 0; i < res.length; i++) {
                  that.data.jobs[0].list.push(res[i]);
                }
                that.setData({
                  jobs: that.data.jobs
                })
              }
            }
          }, {});
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.triger){
    //this.onLoad();
      let that=this;
      // app.meInfo();
      let city = wx.getStorageSync('selCity');
      app.setTabBar(app.app_type, that);
      // 先让城市区域置空
      that.setData({
        'request_data.district': '',
        // 'jobs[0].chooseCity':'',
        // 'jobs[1].chooseCity': '',
        // 'jobs[2].chooseCity': '',
        // 'jobs[0].list': [{ name: '全部' }],
        hidden:true
      })
      if(city!==''){
        // 获取对应城市下所有区
        app.request('/api/part_job/get_province_id_by_name?name=' + city, function (res) {
          if (res) {
            var cityId=res;
            that.setData({
              cityID: cityId,
              locaiton: city,
              currentClass: 4,
              showDetail: false,
              'request_data.city': cityId,
              'request_data.skip':0,
              'request_data.take': 32,
              // jobsList:[],
              // hidden: false
            })
            console.log('又开始默认');
            let request_data = that.data.request_data;
            console.log(request_data)
            app.getAlljobsList(that, request_data);
            // app.getAlljobsList(that, { skip: 0, take: 5 });
            console.log('重新请求城市下兼职列表');
            // 获取对应城市下所有区
            app.request('/api/part_job/cities_list?pid=' + cityId, function (res) {
              if (res) {
                console.log(res);
                if(res.length == 1){
                  app.request('/api/part_job/cities_list?pid=' + res[0].id, function (res) {
                    if (res) {
                      // console.log(res);
                      // var arry = [];
                      // for (var i = 0; i < res.length; i++) {
                      //   arry.push(res[i].name);
                      // }
                      // that.setData({
                      //   "jobs[0].contents": res
                      // })
                      for (var i = 0; i < res.length; i++) {
                        //that.data.jobs[0].list.push(res[i]);
                      }
                      that.setData({
                        jobs: that.data.jobs,
                        hidden:true
                      })
                    }
                  }, {});
                  return 
                }
                // var arry = [];
                // for (var i = 0; i < res.length; i++) {
                //   arry.push(res[i].name);
                // }
                // that.setData({
                //   "jobs[0].contents": res
                // })
                else{
                  for (var i = 0; i < res.length; i++) {
                   // that.data.jobs[0].list.push(res[i]);
                  }
                  that.setData({
                    jobs: that.data.jobs,
                    hidden:true
                  })
                } 
              }
            }, {});
          }
        }, {});
        //let city = wx.setStorageSync('selCity','');
      };
    }
  },
  changeStatus:function(){
    // url = "../city/index?city={{locaiton}}"
    wx.redirectTo({
      url: '../city/index?city='+this.data.location,
    })
    this.setData({
      hidden:false
    })

  },
  //切换tab
  switchTab: function (e) {
    var that=this;
    var cat_id = e.currentTarget.dataset.id;
    var nowtab = e.currentTarget.dataset.index;
    if (nowtab != -1) {
      if (that.data.showDetail==false){
        this.setData({
          currentClass: nowtab,
          showDetail: true,
          contents: this.data.jobs[nowtab].contents,
          navTap: this.data.jobs[nowtab].type,

        })
      }else{
        this.setData({
          showDetail: false,
        })
      }
    }
    else {
      this.setData({
        currentClass: nowtab
      })
    }
  },
  // 根据不同选项分类显示兼职列表
  switchList:function(e){
    var  that=this;
    var Index = e.currentTarget.dataset.index;
    var _name = e.currentTarget.dataset.name;
    var type=e.currentTarget.dataset.type;
    let request_data = that.data.request_data;
    request_data['skip'] = 0;
    that.setData({
      hidden:false
    });
    if(Index==0){
      that.AllList();
    }
    else if (type=='区域'){
      app.saveStorageName('area', that.data.jobs[0].list[Index]['id']);

      that.setData({
        'request_data.district': that.data.jobs[0].list[Index]['id'],
        showDetail: false,
        'jobs[0].chooseCity': _name,
        currentClass: 4,
        saveHidden: true,
        // "jobs[0].['contents'].[0].['name']": '全部'
      })
    } else if (type == '类型'){
      app.saveStorageName('style', that.data.jobs[1].list[Index]['name']);
      that.setData({
        'request_data.type_id': that.data.jobs[1].list[Index]['id'],
        showDetail: false,
        'jobs[1].chooseCity': _name,
        currentClass: 4,
        saveHidden: true
      })
    } else if (type == '时间'){
      app.saveStorageName('time', that.data.jobs[2].list[Index]['name']);
      that.setData({
        'request_data.length_type': that.data.jobs[2].list[Index]['name'],
        showDetail: false,
        'jobs[2].chooseCity': _name,
        currentClass: 4,
        saveHidden: true
      })
    }
    console.log(request_data['district'] + 'request_data');
    app.getAlljobsList(that, request_data);
  },
  // 选择全部时
  AllList:function(){
    var that=this;
    let request_data = this.data.request_data;
    that.setData({
      showDetail: false,
      'jobs[0].chooseCity': '',
      'jobs[1].chooseCity': '',
      'jobs[2].chooseCity': '',
      'request_data.district': '',
      'request_data.type_id': '',
      'request_data.length_type': '',
      currentClass: 4,
      saveHidden: true
    });
    app.getAlljobsList(that, request_data);
  },
  goBack: function () {
    wx.navigateTo({
      url: '../../start/start',
    })
  },
  hide:function(){
    this.setData({
      saveHidden:true,
      currentClass: 4,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorageSync('city','');
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
    this.onLoad();
  },
  getId:function(data){
    var arr = '';
    var fuhao =',';
    for(var i in data){
      if(i == data.length-1){
        fuhao = '';
      }
      arr += data[i]['id']+fuhao;
    }
    return arr;
  },
  removeDuplicatedItem: function(arr) {
     for(var i = 0; i < arr.length-1; i++){
         for(var j = i+1; j < arr.length; j++){
             if(arr[i]['id']==arr[j]['id']){
               arr.splice(j,1);//console.log(arr[j]);
               j--;
           }
        }
    }
    return arr;
 },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触底事件！！！');
    var that = this;
    var jobsList = that.data.jobsList;

    var skip = app.count(that.data.jobsList);
    console.log(skip)
    var request_data = this.data.request_data;
  
     request_data['skip'] = skip;
    if(skip >0){
      //request_data['id'] = this.getId(jobsList);
    }

    var skip = jobsList.length;

      app.request('/api/part_job/list_all', function (res) {
        if (res) {
          if (app.empty(res)) {
            that.setData({
              reachBottom: false
            })
          } 
          else {
            jobsList = app.autoContactArr(jobsList, res);
            console.log(jobsList);
            jobsList = that.removeDuplicatedItem(jobsList);
            //app.saveStorageName('jobsList', jobsList);
            that.setData({
              jobsList: jobsList
            })
          }
        }

      }, request_data)
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})