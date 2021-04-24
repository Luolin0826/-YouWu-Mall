import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    //左侧菜单数据
    leftMenuList: [],
    //右侧菜单数据
    rightContent: [],
    //被点击左侧菜单
    currentIndex: 0,
    //右侧内容滚动条距离顶部距离
    scrollTop: 0

  },
  //接口返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getCates();
    /*0 web中的本地存储和小程序中本地存储的区别
        1.代码方式不同  
          web中：localStorage.setItem("key","value") localStorage.getItem("key")
          小程序中:wx.setStorageSync(key,value);
        2.存的时候，是否做类型转换
          web：不管存入的数据类型，最终都会先调用以下toString(),把数据变成了字符串 再存入进去
          小程序：不存在类型转换

      1.先判断一下是否有旧的数据
      {time:Date.now,data:this.Cates}
      2.没有旧的数据 直接发送新的请求
      3.没有旧的数据 同时 旧的数据也没有过期，就使用本地的旧数据即可
        */
    //1.获取本地存储中的数据
    const Cates = wx.getStorageSync("cates");
    //2.判断
    if (!Cates) {
      //不存在，发送请求
      this.getCates();
    } else {
      //有旧的数据 定义过期时间 
      if (Date.now() - Cates.time > 1000 * 60 * 10) {
        //发送时间过期 重新发送
        this.getCates();
      }
      else {
        //可以直接使用旧的数据
        this.Cates = Cates.data;
        //构造左侧大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  //获取数据
  async getCates() {
    // request({
    //   url:"/categories"
    // })
    // .then(res=>{
    //   this.Cates=res.data.message;
    //   //把接口数据存入到本地缓存当中
    //   wx.setStorageSync("cates", {time:Date.now,data:this.Cates});

    //   //构造左侧大菜单数据
    //   let leftMenuList = this.Cates.map(v=>v.cat_name);
    //   //构造右侧商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })


    //1.使用es7的async来发布异步请求
    const res = await request({ url: "/categories" });
    this.Cates = res;
    //把接口数据存入到本地缓存当中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    //构造左侧大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    //构造右侧商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  //左侧菜单栏点击事件
  handleItemTap(e) {
    // 1.获取索引
    const { index } = e.currentTarget.dataset;
    // 2.给index赋值
    let rightContent = this.Cates[index].children;
    //3.根据不同的索引来渲染右侧的商品
    this.setData({
      currentIndex: index,
      rightContent,
      //重新设置 右侧内容标签距离顶部的距离
      scrollTop: 0
    })
  }
})