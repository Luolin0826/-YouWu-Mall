/*
1.发送请求获取数据
2.点击轮播图 预览图片
  1.给轮播图绑定事件
  2.调用了小程序的api PrevewImage
3.点击加入购物车
  1.绑定点击
  2.获取缓存中的购物车数据 数组格式
  3.先判断 是否已经存在商品数据
  4.已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填回缓存中
  5.不存在购物车中的数组 直接给购物车添加一个新元素 新元素带上购买数量属性 num
  6.弹出用户提示
4.商品收藏
  1.页面onshow的时候 加缓存中商品收藏的数据
  2.判断当前商品是否被收藏
  3.点击收藏按钮
    1.判断是否存在收藏数组
    2.已经存在 删除收藏
    3.不存在 添加收藏 存入缓存
*/
import { request } from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    //商品收藏状态
    isCollect: false
  },
  //商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },
  //获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    this.GoodsInfo = goodsObj;
    //获取缓存中的商品收藏
    let collect = wx.getStorageSync("collect") || [];
    //判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        //iphone不识别webp图片格式
        //可以临时自己改，需要确保后台存在相应的格式
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics,
      },
      isCollect
    })
  },
  //点击轮播图放大预览
  handlePrevewImage(e) {
    //先构造要预览的数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    });
  },
  //点击加入购物车
  handleCartAdd() {
    //获取
    let cart = wx.getStorageSync("cart") || [];
    //判断
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      //第一次添加
      this.GoodsInfo.num = 1;
      //选中键
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      //4.已存在 执行 num++
      cart[index].num++;
    }
    //5.返回购物车
    wx.setStorageSync("cart", cart);
    //弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      //防止疯狂点击
      mask: true,
    });
  },
  //点击商品收藏图标
  handleCollect() {
    let isCollect = false;
    //获取缓存中的商品收藏
    let collect = wx.getStorageSync("collect") || [];
    //判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    //当index不等于-1 取消收藏

    if (index !== -1) {
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });

    } else {
      //没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    wx.setStorageSync("collect", collect);
    //修改data中的属性
    this.setData({ isCollect });
  },
  handleBuyNow() {
    wx.showToast({
      title: '暂未开通此服务',
      icon: 'none',
    });
  }
})