<!--
 * @Author: XHL
 * @Date: 2026-04-18
 * @Description: 常见问题
-->
<template>
    <general-custom ref="general_custom" title="常见问题">
        <template #content>
            <view class="problem_box px-30 py-32">
                <view v-for="item in list" :key="item" class="problem_item">
                    <view class="flex mb-24">
                        <image class="problem_icon" src="@/static/images/problem.png" />
                        <view class="title">兑换的权益多久可以到账?</view>
                    </view>
                    <view class="flex">
                        <image class="problem_icon" src="@/static/images/answer.png" />
                        <view class="info">兑换一旦确认后无法取消，请在兑换前仔细确认商品信息。?</view>
                    </view>
                </view>
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
const list = [
    1, 2, 3, 4, 5
]
</script>

<style scoped lang="scss">
.problem_box {
    width: 100%;
    box-sizing: border-box;
    .problem_item {
        padding: 34rpx;
        border-radius: 16rpx;
        background-color: #ffffff;
        margin-bottom: 24rpx;
        font-size: 32rpx;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .problem_icon {
        display: block;
        width: 44rpx;
        height: 44rpx;
        margin-right: 22rpx;
        flex-shrink: 0;
    }
    .title {
        color: $--color-main;
        font-weight: bold;
    }
    .info {
        color: $--color-sub;
    }
}
</style>
