import { http } from '@/api/http'

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
