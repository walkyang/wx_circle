export const uploadfile=(params)=>{
  const baseUrl = 'https://circle.dataface.vip/api'
  return new Promise((resolve,reject)=>{
      wx.uploadFile({
      ...params,
      url:baseUrl+params.url,
      method:"post",
      header: {
            'content-type': 'multipart/form-data'
      },
      success:(result)=>{
        const res = JSON.parse(result.data);
        if (res.code == 1000) {
          resolve(res.data)
        } else {
          reject(res.msg)
        }
      },
      fail:(error)=>{
        const err = JSON.parse(error.data);
        reject(err);
      }
    });
   })
}