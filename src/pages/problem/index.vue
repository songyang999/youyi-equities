<!--
 * @Author: XHL
 * @Date: 2026-04-18
 * @Description: 常见问题
-->
<template>
    <general-custom ref="general_custom" title="常见问题">
        <template #content>
            <view class="problem_box px-30 py-32">
                <view v-for="(item, index) in list" :key="index" class="problem_item">
                    <view class="flex mb-24">
                        <image class="problem_icon" src="@/static/images/problem.png" />
                        <view class="title">{{ item.problem }}</view>
                    </view>
                    <view class="flex">
                        <image class="problem_icon" src="@/static/images/answer.png" />
                        <view class="info">{{ item.answer }}</view>
                    </view>
                </view>
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { qaList } from "@/api/my";

onLoad(() => {
    getQaList();
});

interface qaItem {
    problem: string;
    answer: string;
}
const list = ref<qaItem[]>([]);
const getQaList = async () => {
    try {
        uni.showLoading({
            mask: true,
            title: "加载中...",
        });
        const res: any = await qaList();
        list.value = res.data || [];
    } catch (error) {
        //
    } finally {
        uni.hideLoading();
    }
};
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
