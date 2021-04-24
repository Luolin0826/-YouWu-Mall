Page({
  data: {
    userInfo: {},
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // this.setStorageSync({
        //   userInfo: res.userInfo,
        // })
        const userInfo = res.userInfo;
        wx.setStorageSync("userInfo", userInfo);
        wx.navigateBack({
          delta: 1
        });
      }
    })
  }
})