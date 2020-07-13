import { request } from "../../utils/request.js";
//引入es7 async-await
import regeneratorRuntime, { async } from "../../utils/runtime.js";
Page({
  data: {
    readList:[]
  },
  //定义参数
  queryParms:{
    query:'',//搜索
    page:1,//页码
    pagesize:20,//页容量
    topic_id:0
  },
  //总页数
  totalPage:1,
  onLoad: function (options) {
    this.queryParms.topic_id = options.id;
    this.get_read_list();
  },
  //获取列表
  async get_read_list(){
    const res = await request({url:'/topic/read_list',data:this.queryParms});
    console.log(res)
    const total = res.total;
    this.totalPage = Math.ceil(total/this.queryParms.pagesize);
    this.setData({
      readList:[...this.data.readList,...res.list]
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
      this.get_read_list();
    }
  },
  //下拉刷新
  onPullDownRefresh(){
    this.queryParms.page=1;
    this.setData({
      readList:[]
    })
    this.get_read_list();
    //关闭下拉刷新效果
    wx.stopPullDownRefresh();
  }
})