/*
1，获取列表第一页
2，上拉分页
3，下拉刷新
4，搜索条件
*/
import { request } from "../../utils/request.js";
//引入es7 async-await
import regeneratorRuntime, { async } from "../../utils/runtime.js";
Page({
  data: {
    circleList:[],
    userID:0,
    userNickName:''
  },
  onShow:function(){
    this.setData({
      userID:wx.getStorageSync('user_id'),
      userNickName:wx.getStorageSync('wx_nickname'),
      circleList:[]
    })
    this.get_circle_list();
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
  //获取列表
  async get_circle_list(){
    const res = await request({url:'/circle/my_circle_list',data:{'user_id':this.data.userID}});
    //const total = res.total;
    //this.totalPage = Math.ceil(total/this.queryParms.pagesize);
    this.setData({
      //circleList:res.list 这里要进行拼接，不能直接替换
      circleList:[...this.data.circleList,...res]
     })
  },
  //下拉刷新
  onPullDownRefresh(){
    this.setData({
      circleList:[]
    })
    this.get_circle_list();
    //关闭下拉刷新效果
    wx.stopPullDownRefresh();
  }
})