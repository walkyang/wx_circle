import { request } from "../../utils/request.js";
import { uploadfile } from "../../utils/uploadfile.js";
//引入es7 async-await
import regeneratorRuntime from "../../utils/runtime.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID:0,
    userNickName:'',
    circleImg:'../../img/add_img.png',
    circleImgSrc:''//上传之后的路径
  },
  onLoad(){
    this.setData({
      userID:wx.getStorageSync('user_id'),
      userNickName:wx.getStorageSync('wx_nickname')
    })
  },
  formSubmit: async function (e) {
    let circle_name = e.detail.value.circle_name;
    if(!circle_name){
      wx.showToast({
        title: '请填写圈子名称',
        icon: 'none',
        duration: 2000
      })
    }else{
      //进度
      wx.showLoading({
        title: '上传中',
      })
      //先上传图片和文件
      let that = this
      await that.uploadFile();
      request({
        url: '/circle/circle_add',
        method:'post',
        data :{'circle_name':circle_name,'user_id':that.data.userID,'user_nickname':that.data.userNickName,
        'circle_des':e.detail.value.circle_des,'circle_img':that.data.circleImgSrc}
        }).then(res=>{
          console.log(res)
        }).catch(err => {
          console.log('catch data:', err)
      })
      //数据发布
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
        success:function(){ //延时跳转
          setTimeout(function () {
            wx.switchTab({
              url: '../circle/circle'
            })
          }, 2000)}
      });
    }
  },
  uploadFile: async function (filePath){
    let that = this
    if(that.data.circleImg != '../../img/add_img.png'){
      const res = await uploadfile({url: '/upload/upload_img', filePath:that.data.circleImg,name:"image"})
      that.setData({
        circleImgSrc:res
      })
    }
  },
  //选择图片
  chooseImage: function(e){
    let that=this
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: function(res) {
        that.setData({
          circleImg:res.tempFilePaths[0]
        })
      }
    })
  }
})