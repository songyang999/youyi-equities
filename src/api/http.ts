import ENV_CONFIG from "@/config/env";
import { refreshLogin } from "@/utils";
import { toast } from "@/utils/tool";
import { ParamsType } from "./http.d";

// 请求接口前数据处理
function dispose() {
    //当前是否有网络连接
    uni.onNetworkStatusChange((res) => {
        if (res.isConnected) {
            uni.showToast({
                title: "请先检查网络状态",
                icon: "none",
            });
            return false;
        }
    });
    // https://toe-test.wphr.vip/?lease=upm&response_type=code&scope=snsapi_userinfo&state=upm
    // const userInfo = uni.getStorageSync('userInfo') || {}
    const token = uni.getStorageSync("token") || "";
    // const urlData = uni.getStorageSync('urlData') || {}
    const header = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        // 'Wx-App-Id': urlData.wx_app_id || '',
        token,
    };
    return header;
}
export const http = (params: ParamsType) => {
    const header = dispose();
    if (!params.loadingNo) {
        uni.showLoading({
            mask: true,
            title: '加载中...',
        })
    }
    return new Promise((resolve, reject) => {
        uni.request({
            method: params.method || "POST",
            url: `${ENV_CONFIG.BASE_API}${params.url}`,
            // data: JSON.stringify(params.data) || {},
            data: params.data || {},
            header,
            dataType: params.dataType || "json",
            success: (res: any) => {
                if (!params.loadingNo) {
                    uni.hideLoading()
                }
                if (res.statusCode === 200) {
                    if (params.back) {
                        return resolve(res.data);
                    } else {
                        if (res.data.result.code === "200") {
                            return resolve(res.data);
                        } else if (["403"].includes(res.data.result.code)) {
                            // token已过期
                            uni.removeStorageSync('token')
                            uni.removeStorageSync('open_id')
                            uni.removeStorageSync('union_id')
                            const globalData = getApp().globalData as GlobalDataType
                            globalData.open_id = ''
                            refreshLogin(params, resolve)
                        } else {
                            if (!params.toastNo) {
                                toast(res.data.result.msg);
                            }
                            return reject(res.data);
                        }
                    }
                } else {
                    toast("网络异常");
                    return reject(res.data);
                }
            },
            fail: (err) => {
                // uni.hideLoading()
                toast("网络异常");
                return reject(err);
            },
        });
    });
};

export const upLoadFile = (params: ParamsType) => {
    const header = dispose();
    uni.showLoading({
        mask: true,
        title: "上传中...",
    });
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: `${ENV_CONFIG.BASE_API}${params.url}`,
            header: { ...header, "Content-Type": "multipart/form-data" },
            filePath: params.filePath,
            name: "file",
            formData: params.data,
            success: (uploadFileRes) => {
                uni.hideLoading();
                if (uploadFileRes.statusCode == 200) {
                    return resolve(JSON.parse(uploadFileRes["data"] || ""));
                } else {
                    uni.showToast({
                        title: "网络异常",
                        icon: "none",
                    });
                    return reject(JSON.parse(uploadFileRes["data"] || ""));
                }
            },
            fail: (uploadFileRes) => {
                uni.showToast({
                    title: "网络异常",
                    icon: "none",
                });
                uni.hideLoading();
                return reject(JSON.parse(uploadFileRes["data"]) || uploadFileRes);
            },
        });
    });
};
