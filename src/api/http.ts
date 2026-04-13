import ENV_CONFIG from '@/config/env'
import { wxLogin, refreshLogin } from '@/utils'
import { getSignKey, toast } from '@/utils/tool'
import { ParamsType } from './http.d'

const NODE_ENV = import.meta.env.MODE
// 请求接口前数据处理
function dispose() {
    //当前是否有网络连接
    uni.onNetworkStatusChange((res) => {
        if (res.isConnected) {
            uni.showToast({
                title: '请先检查网络状态',
                icon: 'none',
            })
            return false
        }
    })
    // https://toe-test.wphr.vip/?lease=upm&response_type=code&scope=snsapi_userinfo&state=upm
    // const userInfo = uni.getStorageSync('userInfo') || {}
    const token = uni.getStorageSync('token') || ''
    // const urlData = uni.getStorageSync('urlData') || {}
    const { config } = getApp().globalData as GlobalDataType
    let lease_identity = ''
    if (NODE_ENV === 'dev') {
        lease_identity = config.LEASE_IDENTIFY
    } else if (NODE_ENV === 'pre') {
        lease_identity = config.PRE_LEASE_IDENTIFY
    } else if (NODE_ENV === 'trial') {
        lease_identity = config.TRIAL_LEASE_IDENTIFY
    } else if (NODE_ENV === 'prod') {
        lease_identity = config.PROD_LEASE_IDENTIFY
    }
    const header = {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        lease_identity,
        // 'Wx-App-Id': urlData.wx_app_id || '',
        token,
    }
    // uni.showLoading({
    //     mask: true,
    //     title: '加载中...',
    // })
    return header
}
export const http = (params: ParamsType) => {
    const header = dispose()
    const sign_obj = getSignKey(params.data, params.url)
    for (const key in sign_obj) {
        header[key] = sign_obj[key]
    }
    return new Promise((resolve, reject) => {
        uni.request({
            method: params.method || 'POST',
            url: `${ENV_CONFIG.BASE_API}${params.url}`,
            // data: JSON.stringify(params.data) || {},
            data: params.data || {},
            header,
            dataType: params.dataType || 'json',
            success: (res: any) => {
                // console.log(params.url, res.header.Trace_id)
                // uni.hideLoading()
                if (res.statusCode === 200) {
                    if (params.back) {
                        return resolve(res.data)
                    } else {
                        if (res.data.errno === 0) {
                            return resolve(res.data)
                        } else if (res.data.errno === 51030) {
                            // 账号在其它设备登录
                            uni.removeStorageSync('open_id')
                            uni.removeStorageSync('union_id')
                            uni.removeStorageSync('phone')
                            uni.removeStorageSync('token')
                            uni.removeStorageSync('uid')
                            const globalData = getApp().globalData as GlobalDataType
                            globalData.phone = ''
                            globalData.uid = 0
                            globalData.first_authority = false
                            wxLogin()
                            uni.reLaunch({
                                url: '/pages/home/index',
                            })
                            return
                        } else if (res.data.errno === 90001) {
                            // token已过期
                            uni.removeStorageSync('token')
                            uni.removeStorageSync('open_id')
                            uni.removeStorageSync('union_id')
                            const globalData = getApp().globalData as GlobalDataType
                            globalData.uid = 0
                            globalData.open_id = ''
                            refreshLogin(params, resolve)
                            return
                        } else if (res.data.errno === 10012035) {
                            uni.reLaunch({ url: '/pages/upgrade/index' })
                            return
                        }
                        toast(res.data.errmsg)
                        return reject(res.data)
                    }
                } else {
                    toast('网络异常')
                    return reject(res.data)
                }
            },
            fail: (err) => {
                // uni.hideLoading()
                toast('网络异常')
                return reject(err)
            },
        })
    })
}

export const upLoadFile = (params: ParamsType) => {
    const header = dispose()
    const sign_obj = getSignKey({}, params.url)
    for (const key in sign_obj) {
        header[key] = sign_obj[key]
    }
    uni.showLoading({
        mask: true,
        title: '上传中...',
    })
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: `${ENV_CONFIG.BASE_API}${params.url}`,
            header: { ...header, 'Content-Type': 'multipart/form-data' },
            filePath: params.filePath,
            name: 'file',
            formData: params.data,
            success: (uploadFileRes) => {
                uni.hideLoading()
                if (uploadFileRes.statusCode == 200) {
                    return resolve(JSON.parse(uploadFileRes['data'] || ''))
                } else {
                    uni.showToast({
                        title: '网络异常',
                        icon: 'none',
                    })
                    return reject(JSON.parse(uploadFileRes['data'] || ''))
                }
            },
            fail: (uploadFileRes) => {
                uni.showToast({
                    title: '网络异常',
                    icon: 'none',
                })
                uni.hideLoading()
                return reject(JSON.parse(uploadFileRes['data']) || uploadFileRes)
            },
        })
    })
}
