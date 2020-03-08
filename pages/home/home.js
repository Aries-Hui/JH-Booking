// pages/home/home.js
const wechat = require("../../utils/wechat.js")

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户数据
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    userInfo: {},

    // 页面布局
    left: false,

    // css渐变结束标志位
    tranEd: true,

    // 授权弹窗
    showDialog: false,
    buttons: [
        {
            type: 'default',
            className: '',
            scope:'',
            text: '取消',
            value: 0
        },
        {
            type: 'primary',
            className: '',
            scope:'userInfo',
            text: '确认',
            value: 1
        }
    ],

    // 钱
    money_data: []
  },

  // 左右布局点击事件
  viewTap:function(e){
    var direction = e.currentTarget.dataset.direction
    if((direction == 'left' && this.data.left) || (direction == 'right' && !this.data.left)) return
    this.setData({
      left: !this.data.left,
      tranEd: false
    })
  },

  // 钱包图标点击事件
  moneyTap: function(e){
    var that = this
    var direction = e.currentTarget.dataset.direction
    var type = e.currentTarget.dataset.type
    if((direction == 'left' && this.data.left) || (direction == 'right' && !this.data.left)) {
      wx.navigateTo({
        url: '../cost/cost?type=' + type,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          fromCost: function(data) {
            var money = that.data.money_data
            if(money[data.data.payid - 1] == undefined) {
              money[data.data.payid - 1] = {}
              money[data.data.payid - 1].money = 0
            }
            money[data.data.payid - 1].payId = data.data.payid
            if(data.data.radio == "0"){
              money[data.data.payid - 1].money += parseInt(data.data.price)
            }else if (data.data.radio == "1"){
              money[data.data.payid - 1].money -= parseInt(data.data.price)
            }
            that.setData({
              money_data: money
            })
          },
        }
      })
    }
  },

  // 动画结束事件 包括tranistion和animation
  transitionend:function(){
    this.setData({
      tranEd: true
    })
  },

  // 半屏弹窗 确认按钮 获取用户信息事件
  bindGetUserInfo:function(e){
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      showDialog: false
    })
    wechat.post("/WeChat/userInfo",e.detail.userInfo)
  },

  // 半屏弹窗 取消按钮点击事件
  buttontap:function(e){
    this.setData({
      showDialog: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userinfoinit();
    this.depsoitinit();
    app.homeinitReadyCallback = res => {
      this.depsoitinit()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 初始化用户授权
   */
  userinfoinit: function () {
    // 判断用户信息授权回调
    app.scopeReadyCallback = res => {
      this.setData({
        showDialog: !res
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      app.userInfoFailCallback = res => {
        this.setData({
          showDialog: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(11)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: res => {
          this.setData({
            showDialog: true
          })
        }
      })
    }
  },

  /**
   * 初始化用户资金数据
   */
  depsoitinit: function() {
    wechat.post('/Cost/deposit').then( res => {
      this.setData({
        money_data: res
      })
    })
  }
})