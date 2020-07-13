
import { request } from "../../utils/request.js";
// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userID:wx.getStorageSync('user_id'),
    topicInfo:{},
    topicID:0
  },
  onLoad:function(option){
    this.setData({
      topicID:option.id
    })
    this.get_topic_detail();
    //如果是未读，则调用已读方法
    let is_read = option.is_read;
    if(is_read == 'N'){
      this.btn_readtopic();
    }
  },
  //加载列表
  async get_topic_detail(){
    const res = await request({url:'/topic/topic_detail',data:{'topic_id':this.data.topicID,'user_id':this.data.userID}});
    this.setData({
      topicInfo:res
     })
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
    let that = this
    let topic_id = that.data.topicID;
    const res = await request({url:'/topic/topic_read',data:{'user_id':that.data.userID,'topic_id':topic_id}})
    // wx.showToast({
    //   title: '已阅',
    //   duration: 2000,
    //   success:function(){
    //     //这里直接变下数组里的数据.还要把图标换掉
    //     that.setData({
    //       [is_read]: 'Y'
    //     })
    //   }
    // })
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
      shareObj.path = '/pages/topicdetail/topicdetail?id='+this.data.topicID;
      //shareObj.imageUrl='';
    }
    // 返回shareObj
    return shareObj;
  }
})

