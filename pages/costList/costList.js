// pages/costList/costList.js
const util = require('../../utils/util.js')
const money = require('../../utils/money.js')

const wechat = require("../../utils/wechat.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 0,
        tabs:[],
        budget_new:"",
        budget_new_num: "",
        budget_new_format: "",
        date_s: "2020-01-01",
        date_e: "2020-01-01",
        dialogShow: false,
        buttons: [{text: '取消'}, {text: '确定'}],
        costlist:[]
    },

    bindTabsChange: function(e){
        this.setData({
            active: e.detail.index
        })
        this.costlistinit()
    },

    openConfirm: function () {
        this.setData({
            dialogShow: true
        })
    },

    tapDialogButton(e) {
        if(e.detail.index == 1){
            var budget_old = this.data.tabs[this.data.active].budget
            
            var data = {
                catalogid: this.data.tabs[this.data.active].id,
                budget: this.data.budget_new_num
            }
            wechat.post("/Cost/budgetIn",data,1).then( () => {
                var budget = "tabs[" + this.data.active + "].budget"
                this.setData({
                    dialogShow: false,
                    [budget]: this.data.budget_new_num
                })
                const eventChannel = this.getOpenerEventChannel()
                eventChannel.emit('fromCostList', {budget: this.data.budget_new_num, active: this.data.active, budget_old: budget_old});
            })
        }else{
            this.setData({
                dialogShow: false
            })
        }
        
    },

    bindRegInput(e){
        var value = e.detail.value
        var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/
        var value_
        if(reg.test(value)){
            value_ = value
        }else{
            value_ = value.substring(0,value.length - 1);
        }
        this.setData({
            budget_new: value_,
            budget_new_num: value_,
            budget_new_format : money.formatMoney(value_)
        })
    },

    bindInputBlur(e){
        this.setData({
            budget_new: this.data.budget_new_format
        })
    },

    bindInputFocus(e){
        this.setData({
            budget_new: this.data.budget_new_num
        })
    },

    bindDateChange: function (e) {
        var type = e.currentTarget.dataset.index

        if(type == "1"){
            this.setData({
                date_s: e.detail.value,
            })
        }else{
            this.setData({
                date_e: e.detail.value,
            })
        }
        this.costlistinit()
        
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('toCostList', function(data) {
            that.setData({
                active: data.index,
                tabs: data.array,
                budget_new: money.formatMoney(data.array[data.index].budget)
            })
          })
        var date = new Date();
        date.setDate(1);
        var date_s = util.formatDate(date)
        var date_e = util.formatDate(new Date())
        this.setData({
            date_s: date_s,
            date_e: date_e
        });
        this.costlistinit();
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
     * 账单列表初始化
     */
    costlistinit(){
        this.setData({
            costlist: []
        })
        var data = {
            catalogId : this.data.tabs[this.data.active].id,
            sDate: new Date(this.data.date_s.replace(/-/g, '/')).getTime(),
            eDate: new Date(this.data.date_e.replace(/-/g, '/')).getTime() + 24*60*60*1000,
        }
        wechat.get("/Cost/costSelect",data).then( res => {
            this.setData({
                costlist: res
            })
        })
    }
    
})