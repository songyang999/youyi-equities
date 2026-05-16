import { http } from "@/api/http";
/**
 * @description: 登录
 */
export function wechatLogin(data?: any) {
    return http({
        url: "/equities/wechatLogin",
        data,
    });
}
//

/**
 * @description: 手机号验证和获取请求
 */

export function getWechatMobile(data?: any) {
    return http({
        url: "/equities/getWechatMobile",
        data,
    });
}

/**
 * @description: 埋点
 */
export function burialPoint(data?: any) {
    return http({
        url: "/tracking/event/submit",
        data,
    });
}
