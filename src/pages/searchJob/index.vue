<!--
 * @Author: XHL
 * @Date: 2023-08-21
 * @Description: 职位搜索
-->
<template>
    <general-custom title="职位搜索">
        <template #content>
            <view :style="{ top: customHeaderHeight + 'px' }" class="search_wrap px-24 pt-28 pb-36">
                <view class="search flex align-center">
                    <svg-icon icon-class="search" class="fs-24" />
                    <input
                        v-model="keyword"
                        confirm-type="search"
                        placeholder="搜索职位"
                        placeholder-style="font-size: 26rpx;"
                        class="search_input fs-26 ml-16"
                        @blur="searchList"
                        @confirm="searchList"
                    />
                    <view v-if="!!keyword" class="close_btn" @click="clearKeyword">
                        <svg-icon icon-class="close" class="fs-28" />
                    </view>
                </view>
            </view>
            <view class="job_wrap">
                <template v-if="isSearch">
                    <job-list
                        v-if="job_list.length"
                        :list="job_list"
                        :height="scrollHeight"
                        :loading="loading"
                        @lower="lowerList"
                    />
                    <view v-else class="no_wrap">
                        <no-data />
                    </view>
                </template>

                <view v-else-if="historyList.length" class="history_wrap px-32">
                    <view class="title fs-36 mb-32">历史搜索</view>
                    <view class="fs-24">
                        <view
                            v-for="item in historyList"
                            :key="item.id"
                            class="main_circle_button px-16 py-8 mb-32 mr-24"
                            @click="chooseJob(item)"
                            >{{ item.keyword }}</view
                        >
                    </view>
                </view>
                <view v-else class="no_wrap">
                    <no-data text="暂无搜索记录" />
                </view>
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onReady } from '@dcloudio/uni-app'
import { defineComponent, ref } from 'vue'
import { getJobList, searchLog } from '@/api/home'
import { getRmainHeight, getLatelyLoc } from '@/utils/tool'

defineComponent({
    name: 'SearchJob',
})

const { customHeaderHeight, location } = getApp().globalData as GlobalDataType

onLoad(() => {
    getHistory()
})

// 历史搜索
interface historyType {
    id: number
    keyword: string
}
const historyList = ref<historyType[]>([])
const getHistory = async () => {
    try {
        const res: any = await searchLog({ page: 1, page_num: 10 })
        if (res.data) {
            historyList.value = res.data.list || []
        }
    } catch (error) {
        //
    }
}

const chooseJob = (item: historyType) => {
    keyword.value = item.keyword
    searchList()
}

// 职位列表高度
const scrollHeight = ref(0)
onReady(async () => {
    const height = await getRmainHeight(['search_wrap'])
    scrollHeight.value = height - customHeaderHeight
})

// 搜索职位
const job_list = ref([])
const params = {
    page: 1,
    page_num: 10,
    max_page: 0,
}
const keyword = ref<string>('')

const loading = ref(false)
const getList = async () => {
    try {
        loading.value = true
        const data = {
            search_key: keyword.value,
            city_id: location.city_id,
            city_name: location.city_name,
            sort_by: 1,
            location: {
                lat: location.lat,
                lng: location.lng,
            },
            ...params,
        }
        const res: any = await getJobList(data)
        if (res.data) {
            params.max_page = res.data.max_page
            const list = (res.data.list || []).map((item) => {
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
// 搜索
const isSearch = ref(false)
const searchList = () => {
    if (keyword.value) {
        isSearch.value = true
        params.page = 1
        getList()
    } else {
        isSearch.value = false
        job_list.value = []
        getHistory()
    }
}
const clearKeyword = () => {
    keyword.value = ''
    searchList()
}
// 下拉加载
const lowerList = () => {
    if (params.page < params.max_page) {
        params.page += 1
        getList()
    }
}
</script>

<style scoped lang="scss">
.search_wrap {
    position: fixed;
    z-index: 99;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    .search {
        width: 100%;
        height: 72rpx;
        border-radius: 40rpx;
        background-color: #fff;
        padding-left: 24rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        border: 1px solid $--color-border;
        .search_input {
            width: 500rpx;
            height: 70rpx;
            flex: 1;
        }
        .close_btn {
            flex-shrink: 0;
            padding: 16rpx 24rpx;
        }
    }
}
.job_wrap {
    box-sizing: border-box;
    padding-top: 134rpx;
    min-height: 100%;
    view {
        box-sizing: border-box;
    }
    .title {
        color: $--color-main;
        font-weight: 600;
    }
    .main_circle_button {
        border-radius: 8rpx;
        display: inline-block;
        color: $--color-common;
        background-color: #f4f6fb;
    }
}
.no_wrap {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
