import { http, upLoadFile } from '@/api/http'
const version = '/v1'

/**
 * @description: 获取用户信息
 */
export function getPersonInfo(data?: any) {
    return http({
        url: version + '/person/query/get',
        data,
    })
}

/**
 * @description: 用户与职位操作记录(浏览/分享/投递)
 */
export function jobOperateList(data?: any) {
    return http({
        url: version + '/person/query/job_operate_list',
        data,
    })
}

/**
 * @description: 钱包-详情
 */
export function myWallet(data?: any) {
    return http({
        url: version + '/person/query/my_wallet',
        data,
    })
}

/**
 * @description: 钱包-余额明细
 */
export function myWalletRecord(data?: any) {
    return http({
        url: version + '/person/query/my_wallet_record',
        data,
    })
}

/**
 * @description: 钱包-发起提现
 */
export function walletWithdrawSubmit(data?: any) {
    return http({
        url: version + '/person/query/wallet_withdraw_submit',
        data,
    })
}

/**
 * @description: 上传身份证图片
 */
export function uploadIdCard(filePath: string, data?: any) {
    return upLoadFile({
        url: version + '/withdraw/maintenance/upload_id_card',
        filePath,
        data,
    })
}

/**
 * @description: 发送验证码
 */
export function sendCode(data?: any) {
    return http({
        url: version + '/person/query/send_code',
        data,
    })
}

/**
 * @description: 获取实名认证信息
 */
export function getIdentityVerify(data?: any) {
    return http({
        url: version + '/person/query/identity_verify',
        data,
    })
}

/**
 * @description: 发起实名认证
 */
export function submitIdentityVerify(data?: any) {
    return http({
        url: version + '/person/maintenance/identity_verify',
        data,
    })
}
