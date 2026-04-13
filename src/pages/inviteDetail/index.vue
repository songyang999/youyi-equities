<!--
 * @Author: XHL
 * @Date: 2024年2月29日
 * @Description: 邀请明细
-->
<template>
    <general-custom title="邀请明细">
        <template #content>
            <view class="interval pa-16"></view>
            <view class="recruit_award danger-color flex mx-32 py-16 px-24 pr">
                <svg-icon icon-class="red_packet" class="red_packet fs-40 mr-12" />
                <text class="fs-28"
                    >累计邀请投递{{ summary.invited_count }}人, 投递职位{{ summary.apply_count }}个</text
                >
            </view>
            <view class="title_wrap flex align-center justify-between pa-32">
                <view class="task_title fs-36">邀请明细</view>
            </view>
            <scroll-view
                v-if="record_list.length"
                :style="{ height: `${scrollHeight}px` }"
                scroll-y
                class="detail_wrap px-32"
                @scrolltolower="lowerList"
            >
                <view v-for="(item, index) in record_list" :key="index" class="deal_wrap pb-32 flex justify-between">
                    <view class="deal_title fs-30">{{ item.personnel_name }}投递了{{ item.job_name }}</view>
                    <view class="deal_time fs-26">{{ item.apply_time_format }}</view>
                </view>
            </scroll-view>
            <view v-else :style="{ height: `${scrollHeight}px` }" class="flex align-center justify-center">
                <no-data text="暂无数据" />
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onReady, onShow, onUnload } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { rewardApplyRecordList } from '@/api/award'
import { getRmainHeight } from '@/utils/tool'

const { customHeaderHeight } = getApp().globalData as GlobalDataType

onLoad((query) => {})

const scrollHeight = ref(0)
onReady(async () => {
    const height = await getRmainHeight(['interval', 'recruit_award', 'title_wrap'])
    scrollHeight.value = height - customHeaderHeight
})

onShow(() => {
    initList()
})

// 求职进度
interface recordType {
    personnel_name: string
    job_name: string
    apply_time_format: string
}
const record_list = ref<recordType[]>([])
const summary = ref({
    invited_count: 0,
    apply_count: 0,
})
const params = {
    page: 1,
    page_num: 10,
    max_page: 0,
}
const loading = ref(false)
const getList = async () => {
    try {
        loading.value = true
        const res: any = await rewardApplyRecordList(params)
        if (res.data) {
            summary.value = res.data.summary
            params.max_page = res.data.max_page
            const list = res.data.list || []
            record_list.value = params.page === 1 ? list : record_list.value.concat(list)
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

// 页面卸载
onUnload(() => {
    const globalData = getApp().globalData as GlobalDataType
    globalData.isInit = false
})
</script>

<style scoped lang="scss">
.recruit_award {
    border-radius: 8rpx;
    background-color: rgba(244, 75, 95, 0.05);
    padding-right: 40rpx;
    .red_packet {
        position: relative;
        top: -1rpx;
    }
}
.task_title {
    font-weight: 600;
    color: $--color-main;
}
.picker_model {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.34);
    .picker_view {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 644rpx;
        background-color: #fff;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        border-radius: 32rpx 32rpx 0 0;
        overflow: hidden;
        .picker_view_column {
            height: 500rpx;
            color: $--color-main;
            .item {
                line-height: 34px;
                text-align: center;
                font-size: 26rpx;
            }
        }
        .picker_view_choose {
            padding: 16px;
        }
    }
}
.detail_wrap {
    width: 100%;
    box-sizing: border-box;
    .deal_wrap {
        border-bottom: 1px solid $--color-border;
        margin-bottom: 32rpx;
        &:last-child {
            border-bottom: 0;
            margin-bottom: 0;
        }
    }
    .deal_title {
        font-weight: 600;
        line-height: 42rpx;
        color: $--color-main;
        max-width: 400rpx;
    }
    .deal_time {
        color: $--color-sub;
        line-height: 42rpx;
        max-width: 250rpx;
    }
}
</style>
