// pages/order/order.js
const wechat = require("../../utils/wechat.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cost: 0,
    budget: 0,
    activeName: '1',
    tree:[],
    costin: []
  },

  onChange(event) {
    this.setData({
      activeName: event.detail
    });
  },

  toCostList(event) {
    var that = this
    wx.navigateTo({
      url: '../costList/costList',
      events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          fromCostList: function(data) {
            var budget_ = "tree[" + event.currentTarget.dataset.index + "].node[" + data.active + "].budget"
            
            that.setData({
              [budget_] : data.budget,
              ['budget']: that.data.budget + (data.budget - data.budget_old)
            })
          },
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('toCostList', 
        { 
          index: event.currentTarget.dataset.idx,
          array: that.data.tree[event.currentTarget.dataset.index].node
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.cataloginit()
    this.paymentinit()
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
   * 预算数据初始化
   */

  /**
   * 类别 payment 初始化
   */
  paymentinit(){
    wechat.get("/Public/payment").then( res => {
      this.setData({
        costin: res
      })
    })
  },

  /**
   * 类别 catalog 初始化
   */
  cataloginit(){
    wechat.get("/Cost/budgetSelect").then( res => {
      var tree = res
      res.forEach((value,index)=>{
        tree[index] = this.findNode(value)
      })
      this.setData({
        tree: tree
      })
    })
  },


  /**
   * 获取树形数据的叶子节点
   * @param tree 树
   * @return tree_ 树下所有叶子节点
   */
  findNode: function(tree){
    var this_ = this
    var tree_ = tree
    if(tree.node == null) return tree_
    tree.node.forEach((value,index) => {
      if(value.node == null) {
          this_.setData({
            cost: this_.data.cost + value.cost,
            budget: this_.data.budget + value.budget
          })
          return true
      }else{
        var num = 0
        this.findNode(value).node.forEach(value => {
          tree_.node.splice(index + num,1,value)
          num ++
        })
        
      }
    })
    return tree_
  }
})