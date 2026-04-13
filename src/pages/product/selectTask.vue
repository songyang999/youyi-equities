<!--
 * @Author: XHL
 * @Date: 2024-03-05
 * @Description: 精选职位
-->
<template>
    <general-custom title="精选职位">
        <template #content>
            <general-loading v-if="loading" />
            <template v-else>
                <view :style="{ top: customHeaderHeight + 'px' }" class="tab_wrap px-32 py-24">
                    <tabs :tab-nav="city_list" :active="active" label="name" value="id" @change="changeTab" />
                </view>
                <view class="job_wrap">
                    <job-list :list="task_list" :height="scrollHeight" :loading="task_loading" @lower="lowerList" />
                </view>
            </template>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onReady, onShow } from '@dcloudio/uni-app'
import { ref, reactive } from 'vue'
import { getJobList } from '@/api/home'
import { jobCityList } from '@/api/award'
import { handleBurialPoint, getRmainHeight, getLatelyLoc, getItem } from '@/utils/tool'
import qqmapsdk from '@/utils/qqmap'

const { customHeaderHeight } = getApp().globalData as GlobalDataType

onLoad((query) => {
    console.log('select_task', query)
    if (query.uid && query.ut) {
        const globalData = getApp().globalData as GlobalDataType
        globalData.shareData.sharer_id = +query.uid
        globalData.shareData.ut = +query.ut || 1
    }
})

const scrollHeight = ref(0)
onReady(async () => {
    const height = await getRmainHeight(['tab_wrap'])
    scrollHeight.value = height - customHeaderHeight
})

const loading = ref(true)
onShow(async () => {
    handleBurialPoint('selected_position')
    const { location } = getApp().globalData as GlobalDataType
    if (location.city_name) {
        await initData(location)
    } else if (!location.city_name) await getSetting()
})

// 当前城市
const current = reactive({
    city_id: 0,
    city_name: '北京市',
    lat: 0,
    lng: 0,
})
const initData = (location) => {
    current.city_id = location.city_id
    current.lat = location.lat
    current.lng = location.lng
    current.city_name = location.city_name
    initPageData()
}

// 获取页面信息
const initPageData = async () => {
    await getCityList()
    await initList()
}

// 获取授权状态
const getSetting = () => {
    uni.getSetting({
        success: (res: any) => {
            const authSetting = res.authSetting
            // 授权地理位置
            if (authSetting['scope.userLocation'] === true) {
                getLocation()
            } else {
                initPageData()
                uni.authorize({
                    scope: 'scope.userLocation',
                    success() {
                        getLocation()
                    },
                })
            }
        },
    })
}
// 获取经纬度
const getLocation = () => {
    uni.getLocation({
        type: 'gcj02',
        success: (res) => {
            const { latitude, longitude } = res
            current.lat = latitude || 0
            current.lng = longitude || 0
            getCity({ latitude, longitude })
        },
    })
}
const getCity = (location: any) => {
    qqmapsdk.reverseGeocoder({
        location,
        coord_type: 5,
        success: async (res: any) => {
            if (res.status === 0) {
                const { city } = res.result.address_component
                const globalData = getApp().globalData as GlobalDataType
                current.city_name = city
                globalData.location = current
                uni.setStorageSync('location', JSON.stringify(current))
                initPageData()
            }
        },
        fail: () => {
            loading.value = false
            initPageData()
        },
    })
}

// 切换tab
interface cityType {
    id: number
    name: string
}
const active = ref<number>(0)
const city_list = ref<cityType[]>([])
const getCityList = async () => {
    try {
        const res: any = await jobCityList({ job_type: 1 })
        city_list.value = (res.data && res.data.list) || []
        if (!active.value) {
            let citys: any = {}
            if (current.city_id) {
                citys = getItem(city_list.value, current.city_id, 'id')
            } else if (current.city_name) {
                citys = getItem(city_list.value, current.city_name, 'name')
            }
            if (citys.id) active.value = citys.id
            else active.value = city_list.value[0] && city_list.value[0]['id']
        }
    } catch (error) {
        //
    }
}
const changeTab = (tab) => {
    if (active.value === tab.id) return
    active.value = tab.id
    initList()
}

// 求职进度
const task_list = ref([])
const params = {
    page: 1,
    page_num: 10,
    max_page: 0,
}
const task_loading = ref(false)
const getList = async () => {
    if (!active.value) return
    try {
        task_loading.value = true
        const data = {
            city_id: active.value,
            job_type: 1,
            ...params,
        }
        const res: any = await getJobList(data)
        if (res.data) {
            params.max_page = res.data.max_page
            const list = (res.data.list || []).map((item) => {
                item.job_loc = getLatelyLoc(item.job_locations, current.city_name)
                return item
            })
            task_list.value = params.page === 1 ? list : task_list.value.concat(list)
        }
    } catch (error) {
        //
    } finally {
        task_loading.value = false
        setTimeout(() => {
            loading.value = false
        }, 200)
    }
}

// 初始化list
const initList = () => {
    params.page = 1
    getList()
}
// 上拉加载
const lowerList = () => {
    if (params.page < params.max_page) {
        params.page += 1
        getList()
    }
}
</script>

<style scoped lang="scss">
.tab_wrap {
    position: fixed;
    left: 0;
    right: 0;
    height: 62rpx;
}
.job_wrap {
    box-sizing: border-box;
    min-height: 100%;
    padding-top: 108rpx;
}
</style>
