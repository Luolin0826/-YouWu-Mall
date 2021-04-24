/* 
1.页面加载时
  1.从缓存数据中获取购物车数据，渲染到页面中
    这些数据 checked=true
2.微信支付
  1.能实现微信支付的账号
    企业账号
    企业账号小程序后台中添加白名单
3.支付功能
  1 先判断缓存中是否有token
  2 没有 跳到授权界面 进行获取token 
  3 有token
  4 创建订单，获取订单编号
  5 手动删除缓存中 已经被选中了的商品
  7 删除后的购物车页面数据 填充回缓冲
  8 页面跳转
*/
import { chooseAddress, showModal, showToast, requestPayment } from "../../utils/asyncwx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js"
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    //1.获取缓存中的收货信息
    const address = wx.getStorageSync("address");
    //1.获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    this.setData({ address });
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalNum,
      totalPrice,
      address
    });
  },
  async handleOrderPay() {
    try {
      //1.判断缓存中有无token
      const token = wx.getStorageSync("token");
      //2.判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      //创建订单
      //创建请求头参数
      //const header = {Authorization:token};
      //创建请求体参数
      const order_price = this.data.totalPrice;
      //订单地址
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods };
      //发送请求创建订单
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
      //准备发起预支付接口
      //const {pay} = await request({url:"/my/orders/req_unifiedorder",method:"POST",header,data:{order_number}});
      //发起微信支付
      //await requestPayment(pay);
      //查询后台 订单状态
      //const res = await request({url:"/my/orders/chkOrder",method:"POST",header,data:{order_number}});
      await showToast({ title: "Payment Successful!" })
      //手动删除数据
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);
      //支付成功跳转
      wx.navigateTo({
        url: '/pages/order/index'
      })
    } catch (error) {
      await showToast({ title: "Payment Fail!" })
      console.log(error);
    }
  }
})

