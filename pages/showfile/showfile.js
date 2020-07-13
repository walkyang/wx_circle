// pages/showfile/showfile.js
Page({
  data: {
    filePath:''
  },
  onLoad:function(option){
    console.log('option',option);
    this.setData({
      filePath:option.file
    })
    wx.downloadFile({
      url: option.file,
      success: function (res) {
        console.log(res)
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})
