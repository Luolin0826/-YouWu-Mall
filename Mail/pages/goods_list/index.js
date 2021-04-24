/*1.用户上滑页面 滚动条触底 开始加载下一页数据
  1.找到滚动条触底事件
  2.判断还有没有下一页数据
        1.获取到数据总页数
        2.当前页码
        3.判断当前页码和总页数的关系
  3.假如没有下一页数据 弹出提示
  4.假如有下一页数据 来加载下一页数据
        1.当前页码++
        2.重新发送请求
        3.数据请求回来 要对data中的数组进行拼接，不能是全部替换
2.下拉刷新页面
  1.触发下拉刷新页面 需要在页面的json文件中开启配置项
    找到事件，在里面添加逻辑
  2.重置 数据 数组
  3.重置页码 设置为1
  4.重新发送请求
  5.数据请求回来，手动关闭等待效果
*/
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  //接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  totalPages: 1,

  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },

  //获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    //获取总条数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      //拼接数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })

    //关闭下拉刷新窗口
    wx.stopPullDownRefresh();
  },
  //标题点击事件
  handleTabsItemChange(e) {
    //获取被点击的标题索引
    const { index } = e.detail;
    //修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //赋值到data
    this.setData({
      tabs
    })
  },
  /**
* 页面相关事件处理函数--监听用户触底动作
*/
  onReachBottom: function () {
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({ title: '我也是有底线的' });
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    //重置数组
    this.setData({
      goodsList: []
    })
    //重置页码
    this.QueryParams.pagenum = 1;
    //重新发送请求
    this.getGoodsList();
  }
})