<!--
 * @Author: XHL
 * @Date: 2024-03-05
 * @Description: 有奖职位专区
-->
<template>
    <scroll-view
        :style="{ 'max-height': height + 'px' }"
        :scroll-y="scrollY"
        :enhanced="true"
        :bounces="false"
        :show-scrollbar="false"
        :throttle="false"
        :upper-threshold="0"
        :scroll-top="scrollTop"
        class="task_list"
        @scrolltolower="scrolltolower"
        @scrolltoupper="scrolltoupper"
    >
        <view>
            <view v-for="item in props.list" :key="item.id" class="award_task mx-24" @click="gotoDetail(item)">
                <view class="task_box pr">
                    <view class="task_name primary-color fs-30">
                        <text class="line_ovh">{{ item.name }}</text>
                    </view>
                    <view class="salary danger-color mb-32">
                        <text class="fs-30">{{ salaryFormat(item)['salary'] }}</text>
                        <text class="fs-24">{{ salaryFormat(item)['unit'] }}</text>
                    </view>

                    <view v-if="item.reward_rule_recommend" class="apply flex align-center pr mb-16">
                        <view class="recruit_award recruit_tj_award primary-color flex align-center">
                            <svg-icon :icon-class="blue_packet" class="fs-30 mr-4" />
                            <image class="mr-8" :src="tjjl" />
                            <view v-for="r in item.reward_rule_recommend" :key="r.id" class="refer_tag fs-22">
                                {{ rewardRuleFormat(r) }}
                            </view>
                        </view>
                    </view>
                    <view v-if="item.reward_rule_apply" class="apply flex align-center pr">
                        <view class="recruit_award recruit_yp_award danger-color flex align-center">
                            <svg-icon icon-class="red_packet" class="fs-30 mr-4" />
                            <image class="ypjl mr-8" :src="ypjl" />
                            <view v-for="r in item.reward_rule_apply" :key="r.id" class="refer_tag fs-22">
                                {{ rewardRuleFormat(r) }}
                            </view>
                        </view>
                    </view>
                    <view class="flex align-center justify-between mt-12">
                        <view v-if="item.welfare && item.welfare.length" class="welfare line_ovh fs-24 main-color"
                            >福利待遇: {{ item.welfare.map((w) => w.name).join(',') }}</view
                        >
                        <view class="apply_btn fs-24 px-24 py-12">立即推荐</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="no_more fs-28 py-24">{{ props.loading ? '加载中' : '没有更多了' }}</view>
    </scroll-view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { prefixedUrl, salaryFormat, goPage, handleBurialPoint, rewardRuleFormat } from '@/utils/tool'

const { config } = getApp().globalData as GlobalDataType
const tjjl = computed(() => prefixedUrl(`${config.APP_TYPE}_tjjl.png`))
const ypjl = computed(() => prefixedUrl('ypjl.png'))

const blue_packet = `${config.APP_TYPE}_blue_packet`

interface welfareType {
    id: number
    name: string
}
interface ruleType {
    id: number
    node_name: string
    days: number
    amount_format: string
}
interface jobType {
    id: number
    name: string
    welfare: welfareType[]
    reward_rule_recommend: ruleType[]
    reward_rule_apply: ruleType[]
}
//	接受父组件传值
const props = defineProps({
    height: {
        type: Number,
        default: 0
    },
    list: {
        type:  Array<jobType>,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    scrollY: {
        type: Boolean,
        default: true
    },
    scrollTop: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['lower', 'upper'])
// 上滑加载
const scrolltolower = () => {
    if (props.loading) return
    emit('lower')
}
// 到顶了
const scrolltoupper = () => {
    emit('upper')
}

// 点击跳转
const gotoDetail = (item) => {
    handleBurialPoint({ action: 'reward_position', job_id: item.id })
    goPage(`/pages/jobDetail/index?job_id=${item.id}`)
}
</script>

<style scoped lang="scss">
.task_list {
    width: 100%;
    .award_task {
        padding-left: 8rpx;
        padding-top: 8rpx;
        margin-bottom: 24rpx;
        box-sizing: border-box;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .task_box {
        padding: 24rpx 20rpx 28rpx;
        border-radius: 24rpx;
        background-color: #fff;
        box-shadow: 0rpx 2rpx 16rpx 0rpx rgba(51, 60, 90, 0.16);
        .task_name {
            max-width: 332rpx;
            padding: 12rpx 32rpx;
            border-radius: 8rpx 24rpx 24rpx 8rpx;
            background-color: #eaeaff;
            font-weight: 600;
            position: absolute;
            left: -8rpx;
            top: 12rpx;
        }
        .salary {
            font-weight: 600;
            text-align: right;
        }
    }
    .recruit_award {
        height: 40rpx;
        overflow: hidden;
        flex-wrap: wrap;
        > image {
            display: block;
            width: 103rpx;
            height: 19rpx;
        }
        .refer_tag {
            padding: 2rpx 10rpx;
            line-height: 32rpx;
            border-radius: 8rpx;
            margin-right: 8rpx;
            margin-bottom: 2rpx;
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
    .apply {
        height: 39rpx;
    }
    .welfare {
        max-width: 450rpx;
    }
    .apply_btn {
        font-weight: bold;
        color: $--color-primary;
        background-color: var(--background-color-primary);
        border-radius: 16rpx;
    }
}
.no_more {
    width: 100%;
    color: $--color-sub;
    text-align: center;
}
</style>
