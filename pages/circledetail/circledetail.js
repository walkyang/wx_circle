import { request } from "../../utils/request.js";
//引入es7 async-await
import regeneratorRuntime, { async } from "../../utils/runtime.js";
Page({
  data: {
    circleUserList:[],
    isMaster:false
  },
  //定义参数
  queryParms:{
    page:1,//页码
    pagesize:20,//页容量
    circle_id:0
  },
  //总页数
  totalPage:1,
  onLoad: function (options) {
    this.queryParms.circle_id = options.id;
    this.get_circle_user_list();
  },
  async get_circle_user_list(){
    const res = await request({url:'/circle/circle_user_list',data:this.queryParms});
    console.log(res)
    const total = res.total;
    const master_user_id = res.master_user_id;
    if(master_user_id == wx.getStorageSync('user_id')){
      this.setData({
        isMaster:true
      })
    }
    this.totalPage = Math.ceil(total/this.queryParms.pagesize);
    this.setData({
      circleUserList:[...this.data.circleUserList,...res.list]
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
      this.get_circle_user_list();
    }
  },
  //下拉刷新
  onPullDownRefresh(){
    this.queryParms.page=1;
    this.setData({
      readList:[]
    })
    this.get_circle_user_list();
    //关闭下拉刷新效果
    wx.stopPullDownRefresh();
  }
})