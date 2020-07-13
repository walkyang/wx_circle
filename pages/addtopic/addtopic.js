import { request } from "../../utils/request.js";
import { uploadfile } from "../../utils/uploadfile.js";
//引入es7 async-await
import regeneratorRuntime from "../../utils/runtime.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleID:0,
    userID:0,
    imageList: [],//临时图片地址
    imageListOk:[],//上传完成之后的地址
    imageSizeList:[],//上传图片大小
    hideImage:false,//是否隐藏上传按钮
    fileNameList:[],//临时文件名称
    fileExtensionList:[],//临时文件扩展名
    fileSizeList:[],//上传文件大小
    filePathList:[],//临时文件地址
    filePathListOk:[],//上传完成之后的地址
    circleArr:[],
    circleIndex:0
  },
  onLoad: function(e){
    this.setData({
      userID:wx.getStorageSync('user_id')
    })
    
    this.get_my_circle_list();
  },
  //保存信息
  formSubmit: async function (e) {
      //进度
      wx.showLoading({
        title: '上传中',
      })
      //先上传图片和文件
      let that = this
      await that.uploadFile();
      let imgStr = that.data.imageListOk.join("|");
      let imgSizeStr = that.data.imageSizeList.join("|");
      let fileStr = that.data.filePathListOk.join("|");
      let fileNameStr = that.data.fileNameList.join("|");
      let fileExtensionStr = that.data.fileExtensionList.join("|");
      let fileSizeStr = that.data.fileSizeList.join("|");
      request({
        url: '/topic/topic_add',
        method:'post',
        data :{'content':e.detail.value.content,'user_id':that.data.userID, 'circle_id':that.data.circleID ,'img_str':imgStr,
        'img_size':imgSizeStr,'file_str':fileStr,'file_name_str':fileNameStr,'file_extension_str':fileExtensionStr,'file_size':fileSizeStr}
       }).then(res=>{
        console.log(res)
        wx.hideLoading();
        wx.showToast({
          title: '信息提交成功',
          icon: 'success',
          duration: 2000,
          success:function(){ //延时跳转
            setTimeout(function () {
              wx.switchTab({
                url: '../home/home'
              })
            }, 2000)}
        })
       }).catch(err => {
        console.log('catch data:', err)
     })
  },
  //上传图片文件
  // 由于异步上传图片，导致数组数据获取不对，此处改造为async-await方式
  uploadFile: async function (filePath){
    let that=this
    let imageList = that.data.imageList
    let imageListOk = []
    //由于图片只能一张一张地上传，所以用循环
    for (let i = 0; i < imageList.length; i++) {
      //   uploadfile({
      //     url: '/upload/upload_img',
      //     filePath:imageList[i],
      //     name:"image"
      //   }).then(res=>{
      //     img_url_ok.push(res)
      //    }).catch(err => {
      //     console.log('catch data:', err)
      //  })
      const res = await uploadfile({url: '/upload/upload_img', filePath:imageList[i],name:"image"})
      imageListOk.push(res)
    }
    that.setData({
      imageListOk:imageListOk
    })
    //文件上传
    let filePathList = that.data.filePathList
    let fileNameList = that.data.fileNameList
    let filePathListOk = []
    for (let i = 0; i < filePathList.length; i++) {
      const res = await uploadfile({url: '/upload/upload_file', filePath:filePathList[i],name:"file",
          formData:{"filename":fileNameList[i]}})
          filePathListOk.push(res)
    }
    that.setData({
      filePathListOk:filePathListOk
    })
  },
  //选择图片
  chooseImage: function(e){
    let that=this
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: function(res) {
        //是否禁止上传
        if (that.data.imageList.length == 8){
          that.setData({
            hideImage:true
          })
        }else{
          that.setData({
            hideImage:false
          })
        }
        //把每次选择的图push进数组
        let img_url = that.data.imageList
        let img_size = that.data.imageSizeList
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          img_url.push(res.tempFilePaths[i])
          img_size.push(res.tempFiles[i].size)
        }
        that.setData({
          imageList:img_url,
          imageSizeList:img_size
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '上传失败',
          icon: 'none',
          duration: 2000,
        })
      },
    })
  },
  //预览图片
  previewImage: function (e) {
    let that=this
    let current = e.currentTarget.dataset.src
    wx.previewImage({
      urls: that.data.imageList,
      current:current
    })
  },
  //选择文件
  chooseFile: function(e){
    let that = this
    wx.chooseMessageFile({
      count: 10,
      type: 'file',
      extension:['txt','pdf','xls','xlsx','doc','docx','zip'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles
        console.log(res);
        //把每次选择的图push进数组
        let file_name = that.data.fileNameList
        let file_path = that.data.filePathList
        let file_extension = that.data.fileExtensionList
        let file_size = that.data.fileSizeList
        for (let i = 0; i < res.tempFiles.length; i++) {
          file_name.push(res.tempFiles[i].name)
          file_path.push(res.tempFiles[i].path)
          file_extension.push(res.tempFiles[i].name.split('.')[res.tempFiles[i].name.split('.').length-1])
          file_size.push(res.tempFiles[i].size)
        }
        that.setData({
          fileNameList:file_name,
          filePathList:file_path,
          fileExtensionList:file_extension,
          fileSizeList:file_size
        })
      }
    })
  },
  //预览文件
  downloadFile:function(e){
    let that = this
    let current = e.currentTarget.dataset.url
    wx.redirectTo({
      url:"../showfile/showfile?file="+current
    })
  },
  //获取我的圈子
  async get_my_circle_list(){
    const res = await request({url:'/circle/my_circle_list',data:{'user_id':this.data.userID}});
    let circleArr = []
    let circleID = res[0].circle_id;
    for(let i=0; i < res.length; i++){
      circleArr.push({'id':res[i].circle_id,'name':res[i].circle_name});
    }
    this.setData({
      circleArr,
      circleID
    });
  },
  //圈子改变事件
  circlePickerChange: function(e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      circleIndex: e.detail.value,
      circleID:this.data.circleArr[e.detail.value].id
    })
  }
})