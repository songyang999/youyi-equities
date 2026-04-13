<!--
 * @Author: XHL
 * @Date: 2023年8月21日
 * @Description: 分享/浏览记录
-->
<template>
    <general-custom :title="title">
        <template #content>
            <view class="pt-24"></view>
            <view v-if="job_list.length" class="list_box">
                <job-list :list="job_list" :height="scrollHeight" :loading="loading" @lower="lowerList" />
            </view>
            <view v-else class="no_wrap">
                <no-data />
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onReady, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { jobOperateList } from '@/api/my'
import { getRmainHeight, getLatelyLoc } from '@/utils/tool'

const title = ref<string>('')
let action = 1
onLoad((query: any) => {
    if (query.type === 'share') {
        title.value = '推荐记录'
        action = 2
    } else {
        title.value = '浏览记录'
        action = 1
    }
    uni.setNavigationBarTitle({ title: title.value })
})

const { customHeaderHeight, location } = getApp().globalData as GlobalDataType
// 页面加载完成
const scrollHeight = ref(0) // 职位列表高度
onReady(async () => {
    const height = await getRmainHeight(['pt-24'])
    scrollHeight.value = height - customHeaderHeight
})

onShow(async () => {
    initList()
})

const job_list = ref([])
const params = {
    page: 1,
    page_num: 10,
    max_page: 0,
}
const loading = ref(false)
const getList = async () => {
    try {
        loading.value = true
        const res: any = await jobOperateList({ action, ...params })
        if (res.data) {
            params.max_page = res.data.max_page
            let list = (res.data.list || []).map((item) => item.job_info)
            list = list.map((item) => {
                item.job_loc = getLatelyLoc(item.job_locations, location.city_name || '')
                return item
            })
            job_list.value = params.page === 1 ? list : job_list.value.concat(list)
        }
    } catch (error) {
        //
    } finally {
        loading.value = false
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

<style>
.job_wrap {
    box-sizing: border-box;
    min-height: 100%;
}
.no_wrap {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
