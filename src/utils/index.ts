import { http } from "@/api/http";
import { wechatLogin, getWechatMobile } from "@/api";
import { toast } from "@/utils/tool";
const requestArr: (() => Promise<any>)[] = [];
let isRefreshing = false; //请求队列，是否正在刷新token

// 微信登录
export const wxLogin = () => {
    return new Promise((resolve, reject) => {
        uni.login({
        success: async function (res) {
            try {
                const { mobile } = getApp().globalData as GlobalDataType;
                const res2: any = await wechatLogin({
                    code: res.code,
                    mobile,
                });
                const { token, openid, unionid } = res2.data;
                uni.setStorageSync("token", token);
                uni.setStorageSync("open_id", openid);
                uni.setStorageSync("union_id", unionid);
                const globalData = getApp().globalData as GlobalDataType;
                globalData.open_id = openid;
                resolve({ status: 200 });
            } catch (error: any) {
                resolve({ status: 500 });
            }
        },
        fail: function () {
            toast("系统繁忙！");
            reject();
        },
        });
    });
};

//刷新login
export const refreshLogin = async (params, resolve) => {
  // 如果正在刷新，将请求添加到队列
  requestArr.push(() => resolve(http(params)));
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const res2: any = await wxLogin();
      switch (
        res2.status //（根据实际情况判断）
      ) {
        case 200:
          while (requestArr.length > 0) {
            const MT: any = requestArr.shift();
            if (typeof MT === "function") {
              await MT();
            }
          }
          break;
        default:
          toast("系统繁忙！");
      }
    } catch (error: any) {
      //
    } finally {
      isRefreshing = false;
    }
  }
};

// 获取手机号登录
export const getPhoneNumber = async (e: any) => {
  if (e.detail.errMsg !== "getPhoneNumber:ok") return;
    try {
        const openid = uni.getStorageSync('open_id') || ''
        const unionid = uni.getStorageSync('union_id') || ''
        const params: any = {
            code: e.detail.code,
            openid,
            unionid
        };
        const res: any = await getWechatMobile(params);
        const { userInfo } = res.data;
        uni.setStorageSync("mobile", userInfo.mobile);
        // uni.setStorageSync("token", token);
        uni.setStorageSync("userInfo", userInfo);
        const globalData = getApp().globalData as GlobalDataType;
        globalData.mobile = userInfo.mobile;
        wxLogin()
        return true;
    } catch (error: any) {
        return false;
    }
};
