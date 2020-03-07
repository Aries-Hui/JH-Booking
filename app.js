//app.js
const wechat = require("./utils/wechat.js")
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    wechat.login().then( res => {
      var data = {
        code2Session: res.code
      }
      wechat.post("/WeChat/code2Session",data).then(res=>{
        wx.setStorageSync('token', res.token)
        if (this.homeinitReadyCallback) {
          this.homeinitReadyCallback(res)
        }
      })
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.globalData.scope_userInfo = true
          
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: res => {
              if (this.userInfoFailCallback) {
                this.userInfoFailCallback(res)
              }
            }
          })
        }else{
          this.globalData.scope_userInfo = false
        }
        if (this.scopeReadyCallback) {
          this.scopeReadyCallback(this.globalData.scope_userInfo)
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    scope_userInfo:false,
  }
})