/*
1.点击"+'触发tap事件
  1.使用小程序内置的选择图片Url
  2.获取到图片的路径 数组
  3.把图片路径存放到 data 变量中
  4.页面根据数组 进行循环显示 自定义组件
2.点击自定义图片组件 
  1.获取被点击图片索引
  2.获取data中的图片数组
  3.根据索引 数组中删除对应元素
  4把数组重新设置回data中
3.点击提交按钮
  1.获取文本域内容
    1.data定义变量的内容 类似输入框的获取
    2.文本域绑定输入事件 事件触发 存入变量
  2.对内容合法性验证
  3.通过验证 用户上传到专门的图片服务器 返回外网链接
    1.遍历数组
    2.挨个上传
    3.自己维护图片数组，存放上传后的外网链接
  4.文本域和外网图片链接 一起提交到服务器
  5.清空当前页
  6.返回上一页

*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    chooseImages: [],
    textVal: "",
    imgToken: "b7e3abfa9524e58442bb62e30c683ee3",
  },
  upLoadImgs: [],
  handleTabsItemChange(e) {
    //获取被点击的标题索引
    const { index } = e.detail;
    let { tabs } = this.data;
    //修改源数组
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //赋值到data
    this.setData({
      tabs
    })
  },
  //点击加号 选择事件
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          //图片数组拼接
          chooseImages: [...this.data.chooseImages, ...result.tempFilePaths]
        })
      },
      fail: () => { },
      complete: () => { }
    });

  },
  //点击自定义组件 删除图片
  handleRemoveImg(e) {
    const { index } = e.currentTarget.dataset;
    //获取原图片数组
    let { chooseImages } = this.data;
    //删除元素
    chooseImages.splice(index, 1);
    this.setData({
      chooseImages
    })
  },
  //文本框改变获取
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  //表单提交事件
  handleForSubmit() {
    //获取文本域内容
    const { textVal, chooseImages, imgToken } = this.data;
    if (!textVal.trim()) {
      //不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return
    }
    //上传到服务器
    //不支持多个文件同时上传 遍历循环数组，挨个上传
    //显示正在上传的图标
    wx.showLoading({
      title: "正在上传中",
      mask: true,
      success: (result) => {
      },
    });
    //判断有没有要上传的图片数组
    if (chooseImages.length != 0) {
      chooseImages.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://img.coolcr.cn/api/upload',
          filePath: v,
          name: "image",
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data).data.url;
            this.upLoadImgs.push(url);
            //所有图片都上传完毕
            if (i == chooseImages.length - 1) {
              wx.hideLoading();
              console.log("数据已提交成功");
              //充值页面
              this.setData({
                textVal: "",
                chooseImages: []
              })
              //返回上一页面
              wx.navigateBack({
                delta: 1
              });
            }
          },
        });
      })
    } else {
      wx.hideLoading();
      console.log("只提交了文本");
      wx.navigateBack({
        delta: 1
      });
    }

  }
})