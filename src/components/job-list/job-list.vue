<!--
 * @Author: wy
 * @Date: 2023年7月20日15:11:25
 * @Description: 职位列表
-->
<template>
    <scroll-view
        :style="{ maxHeight: `${props.height}px` }"
        :refresher-enabled="enabled"
        :refresher-threshold="100"
        :refresher-triggered="triggered"
        :scroll-y="scrollY"
        :enhanced="options.enhanced"
        :bounces="options.bounces"
        :throttle="options.throttle"
        :upper-threshold="0"
        type="list"
        @scroll="onScroll"
        @refresherrefresh="onRefresh"
        @scrolltolower="scrolltolower"
        @scrolltoupper="scrolltoupper"
    >
        <template v-if="props.list.length || props.loading">
            <view class="list px-32">
                <view
                    v-for="item in props.list"
                    :key="item.id"
                    :class="{ bright_bac: item.high_light }"
                    class="job_item pr pa-24"
                    @click="gotoDetail(item)"
                >
                    <view v-if="item.high_light" class="flex align-center mb-8">
                        <svg-icon icon-class="bright" class="fs-24" />
                        <text class="common_color fs-20 ml-8">{{ item.high_light }}</text>
                    </view>
                    <image v-if="item.job_reward_status === 1" class="award_icon" :src="award" />

                    <view :class="[props.type === 'progress' ? 'mb-20' : 'mb-4']" class="job_title fs-30">
                        <text class="line_ovh main_color">{{ item.name }}</text>
                        <view class="salary">
                            <text>{{ salaryFormat(item)['salary'] }}</text>
                            <text class="fs-24">{{ salaryFormat(item)['unit'] }}</text>
                        </view>
                    </view>
                    <view v-if="props.type === 'progress'" class="flex justify-between align-center">
                        <view class="common_color fs-26 line_ovh">{{ stagFormat(item) }}</view>
                        <view
                            v-if="applyStatusFormat[item.apply_status]"
                            :class="applyStatusClass[item.apply_status]"
                            class="proceed_state fs-26 ml-16"
                            >{{ applyStatusFormat[item.apply_status] }}</view
                        >
                    </view>
                    <template v-if="props.type !== 'progress'">
                        <view class="tag fs-20 mb-12">
                            <text v-for="tag in item.welfare" :key="tag.id" class="px-12 py-4 mr-8 mt-8">{{
                                tag.name
                            }}</text>
                        </view>
                        <view class="address">
                            <view class="enter_logo mr-12">{{ item.company_name.slice(0, 1) }}</view>
                            <view class="fs-20">
                                <view class="flex align-center main_color mb-4">
                                    <text class="mr-8 line_ovh">{{ item.company_name }}</text>
                                    <svg-icon icon-class="shield" class="fs-20" />
                                </view>
                                <view class="sub_color">{{ jobAddressFormat(item.job_loc) }}</view>
                            </view>
                            <text v-if="item.job_has_applied === 1" class="disabled_btn fs-24 px-24 py-12">已申请</text>
                            <text v-else-if="item.job_opened === 2" class="disabled_btn fs-24 px-24 py-12"
                                >停止招聘</text
                            >
                            <text v-else class="request_btn fs-24 px-24 py-12">立即申请</text>
                        </view>
                        <view
                            v-if="
                                item.reward_rule_recommend &&
                                item.reward_rule_recommend.length &&
                                item.job_reward_status === 1
                            "
                            class="recruit_award primary-color recruit_tj_award flex align-center mt-16 pr"
                        >
                            <svg-icon :icon-class="blue_packet" class="top_1 fs-30 mr-4" />
                            <image class="ypjl top_1 mr-8" :src="tjjl" />
                            <view v-for="r in item.reward_rule_recommend" :key="r.id" class="refer_tag fs-22">
                                {{ rewardRuleFormat(r) }}
                            </view>
                        </view>
                        <view
                            v-if="
                                item.reward_rule_apply && item.reward_rule_apply.length && item.job_reward_status === 1
                            "
                            class="recruit_award danger-color recruit_yp_award flex align-center mt-16 pr"
                        >
                            <svg-icon icon-class="red_packet" class="top_1 fs-30 mr-4" />
                            <image class="ypjl top_1 mr-8" :src="ypjl" />
                            <view v-for="r in item.reward_rule_apply" :key="r.id" class="refer_tag fs-22">{{
                                rewardRuleFormat(r)
                            }}</view>
                        </view>
                    </template>
                </view>
            </view>
            <view class="no_more fs-28 py-24">{{ props.loading ? '加载中' : '没有更多了' }}</view>
        </template>
        <template v-else>
            <view class="pt-64">
                <no-data text="暂无数据" />
            </view>
        </template>
    </scroll-view>
</template>

<script setup lang="ts">
import { onReady } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { goPage, salaryFormat, prefixedUrl, rewardRuleFormat } from '@/utils/tool'

const award = computed(() => prefixedUrl('award.png'))
const ypjl = computed(() => prefixedUrl('ypjl.png'))
const { config } = getApp().globalData as GlobalDataType
const tjjl = computed(() => prefixedUrl(`${config.APP_TYPE}_tjjl.png`))
const blue_packet = `${config.APP_TYPE}_blue_packet`

interface welfareType {
    id: number
    name: string
}
interface locationType {
    address: string
    lat: number
    lng: number
}
interface rewardType {
    id: number
    node_name: string
    days: number
    amount_format: string
}
interface jobType {
    id: number
    name: string
    salary_min: number
    salary_max: number
    salary_type: number
    company_name: string
    financing_stage_format: string
    company_scale_format: string
    welfare: welfareType[]
    job_locations: locationType
    job_loc: any
    job_has_applied: number
    job_opened: number
    apply_status: number
    high_light: string
    job_reward_status: number,
    reward_rule_recommend: rewardType[]
    reward_rule_apply: rewardType[]
}
//	接受父组件传值
const props = defineProps({
    list: {
        type:  Array<jobType>,
        default: () => []
    },
    height: {
        type: Number,
        default: 0
    },
    loading: {
        type: Boolean,
        default: false
    },
    jobKey: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: ''
    },
    scrollY: {
        type: Boolean,
        default: true
    },
    options: {
        type: Object,
        default: () => ({
            'enhanced': false,
            'bounces': true,
            'throttle': true
        })
    }
})

// 公司信息格式化
const stagFormat = (row) => {
    const { company_name, financing_stage_format, company_scale_format, financing_stage, company_scale } = row
    let format = company_name.length > 16 ? company_name.slice(0, 14) + '...' : company_name
    if (company_scale) format += format ? ` · ${company_scale_format}` : company_scale_format
    if (financing_stage) format += format ? ` · ${financing_stage_format}` : financing_stage_format
    return format
}

const jobAddressFormat = (loc) => {
    let format = loc.address.length > 14 ? loc.address.substring(0, 14) + '...' : loc.address
    let distance = ''
    if (loc.distance) distance = loc.distance > 1000 ? (loc.distance / 1000).toFixed(1) + 'km' : loc.distance + 'm'
    if (distance) format += format ? ` · ${distance}` : distance
    return format
}

const applyStatusFormat = {
    1: '待查看',
    2: '待面试',
    3: '待入职',
    4: '已入职',
    5: '不合适',
}

const applyStatusClass = {
    1: 'primary_color',
    2: 'primary_color',
    3: 'primary_color',
    4: 'main_color',
    5: 'sub_color',
}

const emit = defineEmits(['scroll', 'lower', 'upper', 'detail'])
const triggered = ref(false)
const enabled = ref(false)
onReady(() => {
    if (props.jobKey > 0) {
        triggered.value = true
        enabled.value = true
    }
})

const onScroll = (e) => {
    emit('scroll', e)
}

const onRefresh = () => {
    setTimeout(() => {
        triggered.value = false
    },1000)
    setTimeout(() => {
        enabled.value = false
    },1050)
}
// 上滑加载
const scrolltolower = () => {
    if (props.loading) return
    emit('lower')
}
// 滚动到顶部
const scrolltoupper = () => {
    if (props.loading) return
    emit('upper')
}


// 点击跳转
const gotoDetail = (item) => {
    emit('detail', item)
    goPage(`/pages/jobDetail/index?job_id=${item.id}`)
}
</script>

<style scoped lang="scss">
.scroll_wrap {
    width: 100%;
    box-sizing: border-box;
}
.list {
    padding-top: 4px;
}
.job_item {
    background: #fff;
    width: 100%;
    display: block;
    box-sizing: border-box;
    border-radius: 16rpx;
    box-shadow: 0rpx 2rpx 16rpx rgba(51, 60, 90, 0.08);
    margin-bottom: 24rpx;
    &:last-child {
        margin-bottom: 0;
    }
    .job_title {
        position: relative;
        padding-right: 260rpx;
        display: flex;
        align-items: flex-start;
        font-weight: bold;
        .salary {
            position: absolute;
            right: 0;
            top: 0;
            color: $--color-danger;
            width: 260rpx;
            text-align: right;
        }
    }
    .common_color {
        color: $--color-sub;
    }
    .proceed_state {
        font-weight: 600;
        flex-shrink: 0;
    }
    .address {
        color: $--color-main;
        position: relative;
        height: 60rpx;
        padding-right: 164rpx;
        display: flex;
        align-items: center;
        .enter_logo {
            width: 48rpx;
            height: 48rpx;
            border-radius: 50%;
            background-color: $--color-primary;
            font-size: 23rpx;
            font-weight: 600;
            text-align: center;
            line-height: 48rpx;
            color: #fff;
            flex-shrink: 0;
        }
        .request_btn,
        .disabled_btn {
            display: inline-block;
            vertical-align: top;
            border-radius: 16rpx;
            font-weight: normal;
            font-weight: 600;
            position: absolute;
            line-height: normal;
            right: 0;
            top: 1rpx;
        }
        .request_btn {
            color: $--color-primary;
            background: var(--background-color-primary);
        }
        .disabled_btn {
            color: $--color-sub;
            background: rgba(164, 175, 193, 0.1);
        }
    }
    .tag {
        height: 46rpx;
        overflow: hidden;
        > text {
            display: inline-block;
            background: #f4f6fb;
            color: $--color-sub;
            border-radius: 4rpx;
        }
    }
    .primary_color {
        color: $--color-primary;
    }
    .main_color {
        color: $--color-main;
    }
    .sub_color {
        color: $--color-sub;
    }
}
.job_item.bright_bac {
    background: linear-gradient(160deg, #feedef 0, #ffffff 40%, #ffffff 100%);
}
.no_more {
    width: 100%;
    color: $--color-sub;
    text-align: center;
}
.award_icon {
    display: block;
    width: 56rpx;
    height: 56rpx;
    position: absolute;
    top: 0;
    right: 0;
}
.recruit_award {
    height: 40rpx;
    overflow: hidden;
    flex-wrap: wrap;
    .ypjl {
        display: block;
        width: 102rpx;
        height: 20rpx;
    }
    .top_1 {
        position: relative;
        top: -1rpx;
    }
    .refer_tag {
        padding: 2rpx 10rpx;
        line-height: 32rpx;
        border-radius: 8rpx;
        margin-right: 8rpx;
        margin-bottom: 2rpx;
        // color: $--color-danger;
    }
}
.recruit_tj_award {
    .refer_tag {
        border: 2rpx solid rgba(43, 43, 252, 0.25);
    }
}
.recruit_yp_award {
    .refer_tag {
        border: 2rpx solid rgba(244, 75, 95, 0.25);
    }
}
</style>
