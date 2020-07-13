// 设置页面，
// 修改别名，留下联系方式。
// 是否接受该圈子推送信息
import { request } from "../../utils/request.js";
//引入es7 async-await
import regeneratorRuntime from "../../utils/runtime.js";
Page({
  data: {
    isPush: false,
    circleID:0,
    userID:wx.getStorageSync('user_id'),
    userNickName:wx.getStorageSync('wx_nickname')
  },
  onLoad: function (options) {
    if(!wx.getStorageSync('user_id')){ 
      wx.navigateTo({
          url: '../index/index'
        })
    }
    this.setData({
      circleID:options.id
    })
    wx.canIUse('消息订阅','wx.requestSubscribeMessage');
  },
  changePush() {
    let that = this
    console.log('isPush',that.data.isPush)
    //订阅提示
    if(!that.data.isPush){
      wx.requestSubscribeMessage({
        tmplIds: ['cpIDAdR5MMZJ0myHPMAelLc6nSwLSOwquQ7C68Do44M'],
        success (res){ 
          let item = res.cpIDAdR5MMZJ0myHPMAelLc6nSwLSOwquQ7C68Do44M;
          if (item == "reject") {
            that.setData({
              isPush:false
            })
          } else if (item == "accept") {
            that.setData({
              isPush:true
            })
          }
        }
      })
    }else{
      that.setData({
        isPush:false
      })
    }
  },
  formSubmit: async function (e) {
    let that = this
     //加入圈子
    const res = await request({url: '/circle/join_circle',method:'post',
     data :{'circle_id':that.data.circleID,'user_id':that.data.userID,
      'user_nickname':that.data.userNickName,'user_remarks_name':e.detail.value.user_remarks_name,
      'user_mobile':e.detail.value.user_mobile,'user_qq':e.detail.value.user_qq,'is_push':that.data.isPush}
      });
    if(res){
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
        success:function(){ //延时跳转
          setTimeout(function () {
            wx.switchTab({
              url: '../home/home'
            })
          }, 2000)}
    });
    }
    
  }

})