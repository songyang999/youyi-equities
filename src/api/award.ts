import { http } from '@/api/http'
const version = '/v1'

/**
 * @description: 存在有奖职位的城市列表
 */
export function jobCityList(data?: any) {
    return http({
        url: version + '/job/query/job_city_list',
        data,
    })
}

/**
 * @description: 用户奖励详情
 */
export function myRewardSummary(data?: any) {
    return http({
        url: version + '/person/query/my_reward_summary',
        data,
    })
}

/**
 * @description: 用户奖励明细
 */
export function rewardRecordList(data?: any) {
    return http({
        url: version + '/person/query/reward_record_list',
        data,
    })
}

/**
 * @description: 用户邀请明细-有奖职位邀请投递列表
 */
export function rewardApplyRecordList(data?: any) {
    return http({
        url: version + '/person/query/reward_apply_record_list',
        data,
    })
}
