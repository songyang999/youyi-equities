/**
 * @Author: XHL
 * @Date: 2026-05-15
 * @Description: 产品页API
*/
import { http } from "@/api/http";

/**
 * @description: 产品页数据
 */
export function productPage(data?: any) {
    return http({
        url: "/equities/productPage",
        data,
    });
}

/**
 * @description: 产品详情
 */
export function getEquieitsProduct(data?: any) {
    return http({
        url: "/equities/getEquieitsProduct",
        data,
    });
}

/**
 * @description: 验证银行卡接口
 */
export function isRedirect(data?: any) {
    return http({
        url: "/equities/isRedirect",
        data,
    });
}

/**
 * @description: 发送验证码、获取银行 H5 签约接口
 */
export function bindMsg(data?: any) {
    return http({
        url: "/equities/bindMsg",
        data,
    });
}

/**
 * @description: 验证码签约订购接口
 */
export function bindCommit(data?: any) {
    return http({
        url: "/equities/bindCommit",
        data,
    });
}
