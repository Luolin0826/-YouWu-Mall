/*
1.获取用户的地址
  1.绑定事件
  2.调用小程序的内置api，获取地址 chooseAddress
  3.获取到的地址存入数组
2.页面加载完毕
  0.onload onshow
  1.获取本地存储中的地址数据
  2.把数据设置给data中的变量
3.onshow触发时需要做的
  0.回到商品详情页面 第一次添加商品同时，手动添加了商品属性
  1.获取缓存中的购物车数组
  2.把购物车数据填充到data中
4.全选实现 数据展示
  1.onshow获取到缓存的购物车数组
  2.根据购物车中的商品数据进行计算
5.总价格和总数量
  1.都需要商品被选中
  2.获取购物车数组
  3.遍历
  4.判断商品是否被选中
  5.总数量+=商品的数量
  6.把计算后的价格和数量 设置回data中即可
6.商品的选中功能
  1.绑定事件
  2.获取被修改的商品对象
  3.商品状态的选中对象
  4.重新填充回data中
  5.重新计算全选，总价格，数量
7.全选和反选
  1.全选复选框绑定事件
  2.获取data中的全选变量 allChecked
  3.直接取反 allChecked=！allChecked
  4.让里面的购物车商品状态随着 allChecked状态改变
  5.把购物车数组和allChecked选中状态都重新返回data 把购物车重新设置回缓存中
8.商品数量编辑功能
  1."+""-"绑定同一个点击事件 区分的关键在于自定义属性
  2.传递被点击的商品id
  3.获取data中的购物车数组 来获取需要被修改的商品对象
    3.1当购物车商品数量为1时仍然点击"-"
      弹窗提示 wx.showModal 用户是否选择删除
      1.确定 直接执行删除
      2.取消 什么都不做
  4.直接修改商品对象的数量num
  5.把cart数组重置返回缓存中和data中
9.点击结算
  1.判断有没有收货地址信息
  2.判断用户有没有选购商品
  3.经过以上验证 跳转到支付页面
*/
import { chooseAddress, showModal, showToast } from "../../utils/asyncwx.js"
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
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
    const cart = wx.getStorageSync("cart") || [];
    //1.1计算全选 every 遍历数组，接受一个回调函数，只有所有回调函数都返回true，every才会返回true
    // const allChecked = cart.length?cart.every(v=>v.checked):false;
    // let allChecked =true;
    // //总价格 总数量
    // let totalPrice =0;
    // let totalNum = 0;
    // cart.forEach(v => {
    //   if(v.checked){
    //     totalPrice+=v.num*v.goods_price;
    //     totalNum+=v.num;
    //   }else{
    //     allChecked=false;
    //   }
    // });
    // //判断数组是否为空
    // allChecked = cart.length!=0?allChecked:false;
    // //2.给data赋值
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalNum,
    //   totalPrice
    // })
    this.setData({ address });
    this.setCart(cart);
  },
  //点击添加地址
  async handleChooseAddress() {
    //获取地址
    let address = await chooseAddress();
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    wx.setStorageSync("address", address);
  },
  //选中商品
  handleItemChange(e) {
    //获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    //获取购物车数组
    let { cart } = this.data;
    //找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //选中状态取反
    cart[index].checked = !cart[index].checked;
    //把购物车数据重新设置回data中和缓存中
    this.setCart(cart);
  },
  //设置购物车状态，重新计算底部工具栏数据
  setCart(cart) {
    // this.setData({
    //   cart
    // });
    let allChecked = true;
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalNum,
      totalPrice,
      allChecked
    });
    wx.setStorageSync("cart", cart);
  },
  //商品的全选功能
  handleItemAllCheck() {
    //获取data中的事件
    let { cart, allChecked } = this.data;
    //修改值
    allChecked = !allChecked;
    //循环修改cart的商品选中状态
    cart.forEach(v => v.checked = allChecked)
    //把修改后的值 填充回缓存中
    this.setCart(cart);
  },
  //商品数量编辑功能
  async handleItemNumEdit(e) {
    //获取参数
    const { operation, id } = e.currentTarget.dataset;
    //获取购物车数组
    let { cart } = this.data;
    //找到需要修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id);
    //判断是否要进行执行删除，进行修改
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: "您确定要删除该商品吗？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;
      //设置回缓存在data中
      this.setCart(cart);
    }
  },
  //结算功能
  async handlePay() {
    //判断收货地址
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast({ title: "您还没有选择收货地址" });
      return;
    }
    //判断用户是否选择商品
    if (totalNum === 0) {
      await showToast({ title: "您还没有选择商品" });
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})