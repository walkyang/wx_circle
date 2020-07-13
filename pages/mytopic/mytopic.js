
import { request } from "../../utils/request.js";
// pages/home/home.js
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
      userID:wx.getStorageSync('user_id'),
      topicList:[]
    })
    this.queryParms.user_id = this.data.userID;
    this.get_topic_list();
  },
  onLoad:function(){
    if(!wx.getStorageSync('user_id')){ 
      wx.showModal({
        title: '提示',
        content: '您需要先去登录',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../index/index'
            })
          }
        }
      })
    }
  },
  //加载列表
  async get_topic_list(){
    const res = await request({url:'/topic/my_topic_list',data:this.queryParms});
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
  }
})

