
import { request } from "../../utils/request.js";
//引入es7 async-await
import regeneratorRuntime from "../../utils/runtime.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userID:0,
    topicList:[]
  },
  //定义参数
  queryParms:{
    query:'',//搜索
    page:1,//页码
    pagesize:3,//页容量
    user_id:0
  },
  //总页数
  totalPage:1,
  onShow:function(){
    this.setData({
      userID:wx.getStorageSync('user_id')
    })
    this.queryParms.user_id = this.data.userID;
    this.get_topic_list();
  },
  onLoad:function(){
    
  },
  //加载列表
  async get_topic_list(){
    const res = await request({url:'/home/index',data:this.queryParms});
    const total = res.total;
    this.totalPage = Math.ceil(total/this.queryParms.pagesize);
    this.setData({
      topicList:[...this.data.topicList,...res.list]
     })
  },
  //上拉加载
  onPageScroll(){
    if(this.queryParms.page >= this.totalPage){
      wx.showToast({
        title: '没有下一页数据了',
        icon: 'none',
      })
    }else{
      this.queryParms.page ++;
      this.get_topic_list();
    }
  },
  //下拉刷新
  onPullDownRefresh(){
    this.queryParms.page=1;
    this.setData({
      topicList:[]
    })
    this.get_topic_list();
    //关闭下拉刷新效果
    wx.stopPullDownRefresh();
  },
  //跳转到添加主题
  nav_addtopic: async function () {
    
    if(!wx.getStorageSync('user_id')){ 
      wx.showModal({
        title: '提示',
        content: '您需要先去登录，才可以发表话题',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../index/index?url=home'
            })
          }
        }
      })
    }else{
      //这里判断下是否拥有圈子，否则跳出提示先去添加圈子 
      const res = await request({url:'/circle/my_circle_list',data:{'user_id':this.data.userID}});
      if(res.length > 0){
        wx.navigateTo({
          url: '../addtopic/addtopic'
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '您还没有创建圈子，是否去创建？',
          success (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../addcircle/addcircle'
              })
            } 
          }
        })
      }
    }
  },
  //图片预览
  previewImage: function (e) {
    let current = e.currentTarget.dataset.src
    wx.previewImage({
      urls: [current],
      current:current
    })
  },
  //预览文件
  downloadFile:function(e){
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: '../showfile/showfile?file='+url,
    })
  },
  //已读方法
  btn_readtopic: async function(e){
    console.log(e)
    let that = this
    let topic_id = e.currentTarget.dataset.id;
    let topic_index = e.currentTarget.dataset.index;
    let is_read = `topicList[${topic_index}].is_read`;
    const res = await request({url:'/topic/topic_read',data:{'user_id':that.data.userID,'topic_id':topic_id}})
    wx.showToast({
      title: '已阅',
      duration: 2000,
      success:function(){
        //这里直接变下数组里的数据.还要把图标换掉
        that.setData({
          [is_read]: 'Y'
        })

      }
    })
  },
  //分享转发
  onShareAppMessage: function( options ){
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "",    // 默认是小程序的名称(可以写slogan等)
      path: '',    // 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: '',   //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function(res){
        // 转发成功之后的回调
        if(res.errMsg == 'shareAppMessage:ok'){
        }
      }
    }
    // 来自页面内的按钮的转发
    if(options.from == 'button' ){
      var res = options.target.dataset;
      // 此处可以修改 shareObj 中的内容
      shareObj.path = '/pages/home/home';
      //shareObj.imageUrl='';
    }
    // 返回shareObj
    return shareObj;
  }
  
  
})

