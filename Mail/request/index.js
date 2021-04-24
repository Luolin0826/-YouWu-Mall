//同时发送异步代码的次数
let ajaxTimes = 0;

export const request = (params) => {
    //判断URl中是否带有/my/ 请求的是私有路径 带上header token'
    let header = { ...params.header };
    if (params.url.includes("/my/")) {
        //拼接header 带上token
        header["Authorization"] = wx.getStorageSync("token");
    }
    ajaxTimes++;
    //显示加载中效果
    wx.showLoading({
        title: '加载中',
        mask: true//用户无法进行其他操作
    });
    //定义公共部分URL
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                //关闭等待图标
                ajaxTimes--;
                if (ajaxTimes === 0)
                    wx.hideLoading();
            }
        });
    })
}