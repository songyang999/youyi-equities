import { http } from '@/api/http'
const version = '/v1'

/**
 * @description: 职位列表
 */
export function getJobList(data?: any) {
    return http({
        url: version + '/job/query/list',
        data,
    })
}

/**
 * @description: 职位详情
 */
export function getJobDetail(data?: any) {
    return http({
        url: version + '/job/query/detail',
        data,
    })
}

/**
 * @description: 生成职位分享小程序码
 */
export function getWxCode(data?: any) {
    return http({
        url: version + '/wechat/mini_program/query/get_wx_code_unlimited',
        data,
    })
}

/**
 * @description: 用户操作职位：浏览/分享/投递
 */
export function operateJobSubmit(data?: any) {
    return http({
        url: version + '/person/query/operate_job_submit',
        data,
    })
}

/**
 * @description: 城市列表
 */
export function getCityList(data?: any) {
    return http({
        url: version + '/common/query/city_list',
        data,
    })
}

/**
 * @description: 省份列表
 */
export function getProvinceList(data?: any) {
    return http({
        url: version + '/common/query/province_list',
        data,
    })
}

/**
 * @description: 搜索记录
 */
export function searchLog(data?: any) {
    return http({
        url: version + '/job/query/search_log',
        data,
    })
}
