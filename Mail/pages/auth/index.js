import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from "../../utils/asyncwx.js"
Page({
  async handleGetUserInfo(e) {
    //console.log(e);
    //1.获取用户信息
    //const {encryptedData,rawData,iv,signature }=e.detail; 
    //2.获取小程序登录成功之后的 code
    // wx.login({
    //   timeout:10000,
    //   success: (result) => {
    //     const {code}=result;
    //   }
    // });
    //const {code}=await login();
    //console.log("code:"+code);
    //const loginParams={encryptedData,rawData,iv,signature,code};
    //3.发送请求 获取用户的 token
    //const res=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
    //console.log(res);
    try {
      let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
})