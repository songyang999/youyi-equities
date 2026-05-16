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

/**
 * @description: 招聘模块 - 常量
 */
export function getRecruitConst(data?: any) {
    return http({
        url: "/common/query/recruit_const",
        data,
    });
}

/**
 * @description: 获取城市信息接口-层级结构
 */
export function getCityTree(data?: any) {
    return http({
        url: "/common/query/city_tree",
        data,
    });
}

/**
 * @description: 职位库 - 职位类别
 */
export function getJobCategory(data?: any) {
    return http({
        url: "/resume/query/job_category",
        data,
    });
}
/**
 * @description: 职位库 - 职位类别
 */
export function getJobBanner(data?: any) {
    return http({
        url: "/job/query/job_banner",
        data,
    });
}
