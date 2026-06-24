import { http, upLoadFile } from '@/api/http'

/**
 * @description: 获取用户信息接口
 */
export function wechatUserInfo(data?: any) {
    return http({
        url: '/equities/wechatUserInfo',
        data,
    })
}

/**
 * @description: 更新用户信息接口
 */
export function updateWechatUserInfo(data?: any) {
    return http({
        url: '/equities/updateWechatUserInfo',
        data,
    })
}

/**
 * @description: 上传头像接口
 */
export function pictureUpload(filePath: string, data?: any) {
    return upLoadFile({
        url: '/equities/pictureUpload',
        filePath,
        data,
    })
}

/**
 * @description: 我的订单数据接
 */
export function myOrder(data?: any) {
    return http({
        url: '/equities/myOrder',
        data,
    })
}

/**
 * @description: 订单详情
 */
export function getOrder(data?: any) {
    return http({
        url: '/equities/getOrder',
        data,
    })
}

/**
 * @description: 权益兑换
 */
export function agiotage(data?: any) {
    return http({
        url: '/equities/agiotage',
        data,
        toastNo: true
    })
}

/**
 * @description: 仅退款接口
 */
export function refund(data?: any) {
    return http({
        url: "/equities/refund",
        data,
    });
}

/**
 * @description: 订单关联
 */
export function relevance(data?: any) {
    return http({
        url: '/equities/relevance',
        data,
    })
}

/**
 * @description: 包月服务列表
 */
export function getMonthlySubscriptionService(data?: any) {
    return http({
        url: '/equities/getMonthlySubscriptionService',
        data,
    })
}

/**
 * @description: 包月服务退订
 */
export function unsubscribe(data?: any) {
    return http({
        url: '/equities/unsubscribe',
        data,
    })
}

/**
 * @description: 常见问题
 */
export function qaList(data?: any) {
    return http({
        url: '/equities/qa',
        data,
    })
}

/**
 * @description: 删除订单
 */
export function deleteOrder(data?: any) {
    return http({
        url: '/equities/deleteOrder',
        data,
    })
}

/**
 * @description: 继续付款
 */
export function payOrder(data?: any) {
    return http({
        url: '/equities/payOrder',
        data,
        toastNo: true
    })
}

/**
 * @description: 我的权益
 */
export function getEquity(data?: any) {
    return http({
        url: '/equities/getEquity',
        data
    })
}
