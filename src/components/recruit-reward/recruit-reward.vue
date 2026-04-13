<!--
 * @Author: XHL
 * @Date: 2024-02-29
 * @Description: 应聘奖励
-->
<template>
    <!-- 应聘奖励 -->
    <popup-bottom ref="reward" :is-back-click="false">
        <template #content>
            <view :style="{ maxHeight: popupHeight + 'px' }" class="perfect_wrap flex flex-column pr">
                <view
                    :style="{
                        backgroundImage: `url(${head_bac})`,
                    }"
                    class="popup_head px-32 pt-32"
                >
                    <view class="popup_title main-color fs-34">{{ props.title }}</view>
                    <view class="close_btn fs-24" @click="close">
                        <svg-icon icon-class="close" />
                    </view>
                </view>
                <view class="sub_title px-32 fs-28">奖励金额以候选人投递简历时奖励方案为准</view>
                <scroll-view scroll-y :style="{ maxHeight: scrollHeight + 'px' }" class="node_wrap">
                    <view class="node_list px-32">
                        <view
                            v-for="node in list"
                            :key="node.id"
                            class="node_item flex justify-between fs-30 pb-40 pl-40 pr"
                        >
                            <view class="node_title main-color"
                                >{{ node.node_name }}{{ node.days > 0 ? `${node.days}天` : '' }}</view
                            >
                            <view class="node_sub sub-color">现金奖励</view>
                            <view class="money danger-color">{{ node.amount_format }}元</view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </template>
    </popup-bottom>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { prefixedUrl, toFixedFun } from '@/utils/tool'

const { ratio } =  getApp().globalData as GlobalDataType

const popupHeight = uni.getWindowInfo()['windowHeight'] * 0.7
const scrollHeight = popupHeight - toFixedFun(176 / ratio, 2)

const head_bac = computed(() => prefixedUrl('general_custom_bac.jpg'))


//	接受父组件传值
interface rewardType {
    id: number
    node_name: string
    days: number
    amount_format: string
}
const props = defineProps({
    title: {
        type: String,
        default: () => '推荐奖励',
    },
    list: {
        type: Array<rewardType>,
        default: () => [],
    }
})

const reward = ref()
defineExpose({ reward })

const close = () => {
    reward.value.forceClose()
}
</script>

<style scoped lang="scss">
.perfect_wrap {
    box-sizing: border-box;
    padding-top: 176rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
.node_list {
    padding-bottom: 32rpx;
}
.popup_head {
    width: 100%;
    height: 176rpx;
    padding-bottom: 96rpx;
    box-sizing: border-box;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    text-align: center;
    .close_btn {
        padding: 44rpx 32rpx;
        position: absolute;
        right: 0;
        top: 0;
    }
}
.popup_title {
    font-weight: 600;
}
.sub_title {
    color: $--color-sub;
    position: absolute;
    top: 112rpx;
}
.node_item {
    width: 100%;
    box-sizing: border-box;
    // padding-right: 160rpx;
    &::before {
        content: '';
        display: block;
        width: 24rpx;
        height: 24rpx;
        border-radius: 50%;
        box-sizing: border-box;
        background-color: $--color-primary;
        border: 6rpx solid var(--color-primary-disabled);
        position: absolute;
        left: 0;
        top: 21rpx;
        z-index: 10;
        transform: translateY(-50%);
    }
    &::after {
        content: '';
        display: block;
        width: 2rpx;
        height: 100%;
        background-color: #cacafe;
        position: absolute;
        left: 12rpx;
        top: 21rpx;
        transform: translateX(-50%);
    }
    &:last-child {
        padding-bottom: 0;
        &::after {
            content: '';
            display: none;
        }
    }
    .node_title,
    .money {
        font-weight: 600;
        line-height: 42rpx;
    }
    .node_title {
        width: 300rpx;
    }
    .node_sub {
        width: 124rpx;
    }
    .money {
        // position: absolute;
        // right: 0;
        // top: 0;
        text-align: right;
        width: 210rpx;
    }
}
</style>
