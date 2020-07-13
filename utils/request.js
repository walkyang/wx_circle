export const request=(params)=>{
  const baseUrl = 'https://circle.dataface.vip/api'
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      url:baseUrl+params.url,
      success:(result)=>{
        //resolve(result);
        if (result.data.code == 1000) {
          resolve(result.data.data)
        } else {
          reject(result.data.msg)
        }
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
}