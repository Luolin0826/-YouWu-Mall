/*
  1.页面打开时onshow
    0 onshow 不同于onload 无法在形参上接收 options参数
      判断缓存中有没有token，没有就跳转授权，有就继续进行
    获取type
    根据type 发送请求获取订单
    渲染页面
  2.点击不同的标题 重新发送请求获取和渲染数据
*/
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部订单",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/售后",
        isActive: false
      }
    ]
  },
  onShow(options) {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    //获取当前小程序页面栈 长度最大为10 
    let pages = getCurrentPages();
    //数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    //console.log(currentPage.options);
    //获取url上的type
    const { type } = currentPage.options;
    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
  },
  //获取订单列表方法
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } })
    this.setData({
      orders: res.orders.map(v => ({ ...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) }))
    })
  },
  //根据标题索引来激活标题数组
  changeTitleByIndex(index) {
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //赋值到data
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    //获取被点击的标题索引
    const { index } = e.detail;
    //修改源数组
    this.changeTitleByIndex(index);
    //更新发送请求
    this.getOrders(index + 1);
  }
})