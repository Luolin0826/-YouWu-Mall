/*
1.输入框绑定 值改变事件 input事件
  1.获取到输入框的值
  2.合法性判断
  3.检验通过 把输入框的值发送到后台
  4.返回的数据打印到页面上
2.防抖 
  定时器实现  节流
  0.防抖 一般在输入框中加入定时器
  0.1 节流一般用在页面的下拉和上拉
  1.定义全局定时器
*/
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  data: {
    goods: [],
    isFocus: false,
    iptValue: ""
  },
  TimeId: -1,
  //输入框的值改变，会触发的事件
  handleInput(e) {
    //获取输入框的值
    const { value } = e.detail;
    clearTimeout(this.TimeId);
    //检查合法性
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      });
      //值不合法
      return
    }
    //经过验证合法 发送请求获取数据

    this.setData({
      isFocus: true
    })

    this.TimeId = setTimeout(() => {
      this.GoodsSearch(value);
    }, 500)
  },
  async GoodsSearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } })
    this.setData({ goods: res });
  },
  //点击取消按钮
  handleCancel() {
    this.setData({
      iptValue: "",
      isFocus: false,
      goods: []
    })
  }
})