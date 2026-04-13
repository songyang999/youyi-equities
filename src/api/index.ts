import { http } from '@/api/http'
const version = '/v1'
/**
 * @description: 登录
 */
export function login(data?: any) {
    return http({
        url: version + '/wechat/mini_program/login',
        data,
    })
}

/**
 * @description: 手机号验证和获取请求
 */
export function getUserPhoneNumber(data?: any) {
    return http({
        url: version + '/wechat/mini_program/query/get_user_phone_number',
        data,
    })
}

/**
 * @description: 埋点
 */
export function burialPoint(data?: any) {
    return http({
        url: version + '/tracking/event/submit',
        data,
    })
}

/**
 * @description: 招聘模块 - 常量
 */
export function getRecruitConst(data?: any) {
    return http({
        url: version + '/common/query/recruit_const',
        data,
    })
}

/**
 * @description: 获取城市信息接口-层级结构
 */
export function getCityTree(data?: any) {
    return http({
        url: version + '/common/query/city_tree',
        data,
    })
}

/**
 * @description: 职位库 - 职位类别
 */
export function getJobCategory(data?: any) {
    return http({
        url: version + '/resume/query/job_category',
        data,
    })
}
/**
 * @description: 职位库 - 职位类别
 */
export function getJobBanner(data?: any) {
    return http({
        url: version + '/job/query/job_banner',
        data,
    })
}
