<!--
 * @Author: XHL
 * @Date: 2024年2月29日
 * @Description: 奖励明细
-->
<template>
    <general-custom title="奖励明细">
        <template #content>
            <view :style="{ top: customHeaderHeight + 'px' }" class="tab_wrap pa-32">
                <tabs
                    :tab-nav="commonConst.reward_rule_type"
                    :active="active"
                    value="key"
                    label="val"
                    @change="changeTab"
                />
            </view>
            <view class="recruit_award danger-color flex mx-32 py-16 px-24 pr">
                <svg-icon icon-class="red_packet" class="fs-40 mr-12" />
                <text class="fs-28"
                    >待审核{{ summary.audit_waiting_amount_format || '0' }}元, 累计获得奖励{{
                        summary.audit_success_amount_format || '0'
                    }}元</text
                >
            </view>
            <view class="title_wrap flex align-center justify-between pa-32">
                <view class="task_title fs-36">奖励明细</view>
                <view class="task_select flex align-center justify-between px-22" @click="openPicker">
                    <text class="fs-26">{{ condition.val }}</text>
                    <image :src="vector" />
                </view>
            </view>
            <scroll-view
                v-if="record_list.length"
                :style="{ height: `${scrollHeight}px` }"
                scroll-y
                class="detail_wrap px-32"
                @scrolltolower="lowerList"
            >
                <view v-for="item in record_list" :key="item.id" class="deal_wrap pb-32 flex justify-between">
                    <view class="deal_left pr-12">
                        <view class="deal_title mb-12 fs-28"
                            >{{ active === 1 ? item.personnel_name : '' }}完成奖励节点-{{ item.node_name }}</view
                        >
                        <view class="deal_name mb-12 fs-26">职位名称: {{ item.job_name_format }}</view>
                        <view v-if="item.approve_note" class="deal_name mb-12 fs-26"
                            >驳回原因: {{ item.approve_note }}</view
                        >
                        <view class="deal_time line_ovh fs-24">{{ item.reward_time_format }}</view>
                    </view>
                    <view class="deal_right flex flex-column">
                        <view :class="[item.status === 3 ? 'sub-color' : 'danger-color']" class="deal_money mb-12 fs-30"
                            >+{{ item.reward_amount_format || '0' }}</view
                        >
                        <view :class="statusColor[item.status]" class="deal_status fs-28">{{
                            item.status_format
                        }}</view>
                    </view>
                </view>
            </scroll-view>
            <view v-else :style="{ height: `${scrollHeight}px` }" class="flex align-center justify-center">
                <no-data text="暂无数据" />
            </view>
            <!-- 单列选择 -->
            <view v-if="showPicker" class="picker_model" @click.stop="closePicker">
                <view class="picker_view" @click.stop="">
                    <picker-view
                        :value="pickerIndex"
                        @change="changePicker"
                        @pickstart="pickerStart"
                        @pickend="pickerEnd"
                    >
                        <picker-view-column class="picker_view_column">
                            <view v-for="opt in statusOption" :key="opt.key" class="item">{{ opt.val }}</view>
                        </picker-view-column>
                    </picker-view>
                    <view class="picker_view_choose flex">
                        <button class="flex1" hover-class="none" @click="closeOnePicker">取消</button>
                        <button type="primary" class="flex1" hover-class="none" @click="confirmOnePicker">确定</button>
                    </view>
                </view>
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onReady, onShow, onUnload } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { rewardRecordList } from '@/api/award'
import { getRmainHeight, prefixedUrl } from '@/utils/tool'

const vector = computed(() => prefixedUrl('vector.png'))

const { customHeaderHeight, commonConst } = getApp().globalData as GlobalDataType

const pickerIndex = ref<number[]>([0])
onLoad((query: any) => {
    if (query.status) {
        pickerIndex.value = [+query.status]
        condition.value = statusOption[pickerIndex.value[0]]
    }
})

const scrollHeight = ref(0)
onReady(async () => {
    const height = await getRmainHeight(['tab_wrap', 'recruit_award', 'title_wrap'])
    scrollHeight.value = height - customHeaderHeight
})

onShow(() => {
    initList()
})

// 切换tab
const active = ref<number>(1)
const changeTab = (tab) => {
    if (active.value === tab.key) return
    active.value = tab.key
    initList()
}

const statusColor = {
    1: 'warning-color',
    2: 'success-color',
    3: 'sub-color',
}
// 奖励明细
interface recordType {
    id: number
    personnel_name: string
    node_name: string
    job_name_format: string
    reward_time_format: string
    reward_amount_format: string
    status: number
    status_format: string
    approve_note: string
}
const record_list = ref<recordType[]>([])
const summary = ref({
    audit_waiting_amount_format: '0',
    audit_success_amount_format: '0',
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
        const res: any = await rewardRecordList({ reward_type: active.value, status: condition.value.key, ...params })
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

// 状态下拉
const condition = ref({
    key: 0,
    val: '全部',
})
const statusOption = [{ key: 0, val: '全部' }, ...commonConst.reward_record_audit_status]
const showPicker = ref(false)
let disabled = false
const pickerStart = () => {
    disabled = true
}
const pickerEnd = () => {
    disabled = false
}
const changePicker = (e) => {
    pickerIndex.value[0] = e.detail.value
}
const closePicker = () => {
    if (disabled) return
    showPicker.value = false
}
const confirmOnePicker = () => {
    if (disabled) return
    condition.value = statusOption[pickerIndex.value[0]]
    setTimeout(() => {
        showPicker.value = false
        getList()
    }, 300)
}
const openPicker = () => {
    showPicker.value = true
}
const closeOnePicker = () => {
    if (disabled) return
    showPicker.value = false
}

// 页面卸载
onUnload(() => {
    const globalData = getApp().globalData as GlobalDataType
    globalData.isInit = false
})
</script>

<style scoped lang="scss">
.tab_wrap {
    position: fixed;
    left: 0;
    right: 0;
    height: 62rpx;
}
.recruit_award {
    border-radius: 8rpx;
    background-color: rgba(244, 75, 95, 0.05);
    padding-right: 40rpx;
    margin-top: 108rpx;
}
.task_title {
    font-weight: 600;
    color: $--color-main;
}
.task_select {
    width: 176rpx;
    height: 52rpx;
    border-radius: 26rpx;
    border: 1px solid $--color-border;
    color: $--color-common;
    box-sizing: border-box;
    > image {
        display: block;
        width: 16rpx;
        height: 8rpx;
    }
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
        .deal_left {
            max-width: 500rpx;
        }
    }
    .deal_title,
    .deal_money {
        font-weight: 600;
    }
    .deal_status,
    .deal_money {
        text-align: right;
    }
    .deal_title,
    .deal_name {
        color: $--color-main;
    }
    .deal_title,
    .deal_money,
    .deal_status,
    .deal_name {
        line-height: 42rpx;
    }
    .deal_time {
        color: $--color-sub;
    }
}
</style>
