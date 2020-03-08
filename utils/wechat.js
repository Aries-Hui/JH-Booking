// const baseUrl = "http://localhost:9021"
const baseUrl = "https://www.woaijhz.cn:9021"
/**
 * Promise化小程序接口
 */
class Wechat {
    /**
   * 登陆
   * @return {Promise} 
   */
  static login() {
    return new Promise((resolve, reject) => wx.login({ success: resolve, fail: reject }));
  };

  /**
   * 获取用户信息
   * @return {Promise} 
   */
  static getUserInfo() {
    return new Promise((resolve, reject) => wx.getUserInfo({ success: resolve, fail: reject }));
  };

  /**
   * get 网络请求
   * @return {Promise} 
   */
  static get(url, data){
    return _http(url,data,"GET")
  }

  /**
   * post 网络请求
   * @return {Promise} 
   */
  static post(url, data,contentType=0){
    return _http(url,data,"POST",contentType)
  }
  
  /**
   * put 网络请求
   * @return {Promise} 
   */
  static put(url, data){
    return _http(url,data,"PUT")
  }
  
  /**
   * delete 网络请求
   * @return {Promise} 
   */
  static delete(url, data){
    return _http(url,data,"DELETE")
  }
}

/**
 * wx:request 网络请求
 * @return {Promise}
 */
function _http(url, data, method, contentType=0) {
  var header = {}
  if (wx.getStorageSync('token')) {
    header =  {
      'authorization': wx.getStorageSync('token')
    }
  }
  
  if(contentType != 0){
    header['content-type'] = 'application/json'
  }else{
    header['content-type'] = 'application/x-www-form-urlencoded'
  }
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${url}`,
      header: header,
      method: method,
      data: data,
      success: function(res) {
        if (res.data.code === 200) {
          resolve(res.data.data)
        } else {
          wx.showToast({
            title:res.data.code + ": " + res.data.message ,
            icon: 'none',
          })
        }
      },
      fail: function(err) {
        reject(err)
      }
    })
  }).catch(function(e) {
    wx.showToast({
      title: e,
      icon: 'none',
    })
  })
}


module.exports = Wechat;