<script lang="ts">
import STATIC_CONFIG from '@/config'
import { getRecruitConst, getCityTree, getJobCategory } from '@/api'
import { wxLogin } from '@/utils'
import { handleBurialPoint, toFixedFun } from '@/utils/tool'
const menu: any = uni.getMenuButtonBoundingClientRect()
const sysInfo: any = uni.getSystemInfoSync()
console.log('sysInfo==>', sysInfo)
const { system, screenWidth, deviceId } = sysInfo
const ratio = toFixedFun(750 / screenWidth, 2)
const capsuleRight = (sysInfo['screenWidth'] - menu['right']) * 2 + menu['width']
const statusBarHeight = sysInfo['statusBarHeight'] || 0
const navigationBar = (menu['top'] - statusBarHeight) * 2 + menu['height']
const phone = uni.getStorageSync('phone') || ''
const uid = uni.getStorageSync('uid') || 0
const open_id = uni.getStorageSync('open_id') || ''
const location = uni.getStorageSync('location') ? JSON.parse(uni.getStorageSync('location')) : {}
const hideCustom =
    system.includes('windows') || system.includes('Windows') || system.includes('mac') || system.includes('Mac')
// console.log('system==>', sysInfo)
const globalData: GlobalDataType = {
    menu,
    system,
    ratio, // px/rpx比例
    capsuleRight, // 胶囊宽度
    statusBarHeight,
    navigationBar,
    hideCustom, // windows/macOs电脑端打开隐藏custom
    customHeaderHeight: statusBarHeight + navigationBar,
    phone,
    location, // 位置信息
    uid,
    open_id,
    device_id: deviceId, // 设备id
    first_authority: false, // 是否首次登陆
    isWorkWx: !!sysInfo['environment'], // 是否是企微，以后再兼容
    isInit: true,
    commonConst: {}, // 常量
    cityList: [], // 城市下拉
    categoryList: [], // 职位类别下拉
    textArea: {}, // 在线简历多行文本
    category: {},
    config: {}, // 静态变量
    shareData: {}, // 分享数据
    bannerList: [], // banner数据
}
export default {
    onLaunch: async function (query) {
        console.log('App Launch 清空城市信息', query)
        uni.removeStorageSync('location')
        globalData.location = {}
        await this.getStaticConfig()
        // uni.login({
        //     success: async function (res) {
        //         console.log(res)
        //     },
        // })
        if (!uni.getStorageSync('token')) await wxLogin()
        await this.getCommonConst()
        await this.getCityList()
        await this.getCategoryList()
    },
    onShow: function () {
        console.log('App Show')
        handleBurialPoint('miniapp_start')
        //检查小程序是否有新版本，有的话重新启动
        const updateManager = uni.getUpdateManager()
        updateManager.onCheckForUpdate(() => {
            // 请求完新版本信息的回调
        })
        updateManager.onUpdateReady(() => {
            uni.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                },
            })
        })
        updateManager.onUpdateFailed(() => {
            // 新的版本下载失败
        })
    },
    onHide: function () {
        console.log('App Hide')
    },
    methods: {
        getStaticConfig() {
            globalData.config = STATIC_CONFIG
        },
        // 常量
        async getCommonConst() {
            try {
                const res: any = await getRecruitConst()
                if (res.data) {
                    globalData.commonConst = res.data
                }
            } catch (error) {
                //
            }
        },
        // 城市下拉
        async getCityList() {
            try {
                const res: any = await getCityTree({ province: true, city: true, district: true })
                if (res.data) {
                    globalData.cityList = res.data.list || []
                }
            } catch (error) {
                //
            }
        },
        // 招聘分类
        async getCategoryList() {
            try {
                const res: any = await getJobCategory({ major: true, minor: true, detail: true })
                if (res.data) {
                    globalData.categoryList = res.data.list || []
                }
            } catch (error) {
                //
            }
        },
    },
    globalData,
}
</script>
<style>
@import url('@/assets/css/main.css');
@import url('@/assets/css/resetStyle.css');
</style>
