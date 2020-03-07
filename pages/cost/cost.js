// pages/cost/cost.js
const wechat = require("../../utils/wechat.js")

const util = require('../../utils/util.js')
const money = require('../../utils/money.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    radioItems: [
      {name: '收入', value: '0'},
      {name: '支出', value: '1'}
    ],
    cost_new:"",
    cost_new_num: "",
    cost_new_format: "",
    date: "2020-01-01",
    rules: [{
          name: 'radio',
          rules: {required: true, message: '单选列表是必选项'},
      }, {
        name: 'name',
        rules: {required: true, message: '昵称必填'},
      }, {
          name: 'money',
          rules: {required: true, message: '金额必填'},
      }] ,
    channel: ["支付宝", "微信", "银行卡","现金"],
    channelIndex: 0,
    catalog: [],
    catalog_choose_column: [],
    catalog_choose_name:"",
    catalog_choose_id:0,
    catalogIndex:[0,0]
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
        radioItems: radioItems,
        [`formData.radio`]: e.detail.value
    });
  },

  bindDateChange: function (e) {
    this.setData({
        date: e.detail.value,
        [`formData.date`]: e.detail.value
    })
  },

  bindNameInput(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
  })
  },

  bindRegInput(e){
    const {field} = e.currentTarget.dataset

    var value = e.detail.value
    console.log(e)
    var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/
    var value_
    if(reg.test(value)){
        value_ = value
    }else{
        value_ = value.substring(0,value.length - 1);
    }
    this.setData({
        cost_new: value_,
        cost_new_num: value_,
        cost_new_format : money.formatMoney(value_),
        [`formData.${field}`]: value_
    })
  },  

  bindInputBlur(e){
      this.setData({
          cost_new: this.data.cost_new_format
      })
  },

  bindInputFocus(e){
      this.setData({
          cost_new: this.data.cost_new_num
      })
  },

  bindChannelChange(e){
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      channelIndex: e.detail.value
    })
  },

  bindMultiPickerChange: function (e) {
    this.setData({
      catalogIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var column = e.detail.column
    var choose = e.detail.value

    var index = this.data.catalogIndex
    var tree = this.data.catalog
    var catalog_choose_column = this.data.catalog_choose_column

    index[column] = choose
    index = index.splice(0, column + 1)
    catalog_choose_column =  catalog_choose_column.splice(0, column + 1)

    for(var i = 0 ; i < column ; i++){
      tree = this.treeFind(tree,index[i])
    }
    
    var ccc = this.nodeSearch(column, choose, tree, catalog_choose_column)

    if(ccc.length > index.length){
      var num = index.length
      index.length = ccc.length
      for(var i = num; i < ccc.length; i++){
        index[i] = 0
      }
    }

    this.setData({
        catalog_choose_column: ccc,
        catalogIndex: index,
        catalog_choose_name: ccc[index.length - 1][index[index.length - 1]]
    })
  },

  submitForm() {
    var valid_ = false
    this.selectComponent('#form').validate((valid, errors) => {
      // console.log(valid)
        if (!valid) {
            const firstError = Object.keys(errors)
            if (firstError.length) {
                this.setData({
                    error: errors[firstError[0]].message
                })
            }
        } else {
          
          valid_ = true
        }
    })
    if(valid_){
      var tree = this.data.catalog

      for(var i = 0 ; i < this.data.catalogIndex.length - 1 ; i++){
        tree = this.treeFind(tree,this.data.catalogIndex[i])
      }

      var data = {
        name: this.data.formData.name,
        price: this.data.formData.money,
        payid: (this.data.channelIndex - 0) + 1,
        catalogid: tree[this.data.catalogIndex[this.data.catalogIndex.length - 1]].id,
        date: new Date(this.data.date.replace(/-/g, '/')).getTime(),
        radio: this.data.formData.radio
      }
      console.log(data);
      
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('fromCost', {data: data});

      wechat.post("/Cost/costIn",data,1).then( res => {
        wx.navigateBack()
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = util.formatDate(new Date());
    this.setData({
      date: date,
      channelIndex: options.type
    });
    
    this.cataloginit()
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
   * 类别 payment 初始化
   */
  paymentinit(){
    wechat.get("/Public/payment").then( res => {
      var column = []

      res.forEach(value => {
        column.push(value.name)
      })
      
      this.setData({
        channel: column
      })
    })
  },

  /**
   * 类别 catalog 初始化
   */
  cataloginit(){
    wechat.get("/Public/catalog").then( res => {
      var column = []

      column = this.nodeSearch(0, 0, res, column)
      
      this.setData({
        catalog: res,
        catalog_choose_column: column,
        catalog_choose_name: res[0].node[0].name,
        catalogIndex: [0,0]
      })
    })
  },

  /**
   * 多选择器  选择行的rang
   * 查询子节点
   * @param column 选择列的下标
   * @param choose 当前选择列的选中值下标
   * @param tree 当前列的树形结构json数据
   * @param rang 当前选择数组
   * @return rang
   */
  nodeSearch(column, choose, tree, rang){
    var rang_ = []
    if(column == 0) {
      // 第一列数据
      var rang1 = []
      tree.forEach( item => {
        rang1.push(item.name)
      })
      rang = []
      rang.push(rang1)
    }

    if(tree[choose].node == null) return rang
    tree[choose].node.forEach( item => {
      rang_.push(item.name)
    })
    rang[column+1] = rang_
    if(tree[choose].node[0].node == null) return rang
    else{
      rang = this.nodeSearch(column+1, 0, tree[choose].node[0].node, rang)
    }
    return rang
  },

  treeFind(tree,i){
    return tree[i].node
  }
})