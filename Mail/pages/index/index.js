//0 用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js";
Page({
  data: {
    //轮播图数组
    swiperlist: [],
    //导航数组
    cateslist: [],
    //楼层数据
    floorlist: []
  },
  //options(Object)
  onLoad: function (options) {
    //1.发送异步请求，获取轮播图数据 优化手段通过es6的primise来解决问题
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     this.setData({
    //       swiperlist:result.data.message
    //     }
    //     )
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  //获取轮播图
  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperlist: result
        })
      })
  },
  //获取分类导航数据
  getCateList() {
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          cateslist: result
        })
      })
  },
  //获取推荐栏
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        for (let k = 0; k < result.length; k++) {
          result[k].product_list.forEach((v, i) => {
            result[k].product_list[i].navigator_url = v.navigator_url.replace('?', '/index?');
          });
        }
        this.setData({
          floorlist: result
        })
      })
  }
});