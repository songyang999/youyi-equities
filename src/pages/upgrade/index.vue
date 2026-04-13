<!--
 * @Author: XHL
 * @Date: 2024-01-29
 * @Description: 系统升级
-->
<template>
    <view class="err_page">
        <view class="err_box">
            <image :src="upgrade" show-menu-by-longpress mode="widthFix" />
            <view class="title">服务器正在维护升级中...</view>
            <view class="sub_title">给大家带来不便，敬请谅解！</view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { prefixedUrl } from '@/utils/tool'
const { config } = getApp().globalData as GlobalDataType
const upgrade = computed(() => prefixedUrl(`${config.APP_TYPE}_upload.png`))
</script>

<style scoped lang="scss">
.err_page {
    text-align: center;
    height: 100%;
    .err_box {
        padding-top: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    image {
        display: block;
        width: 500rpx;
        height: 375rpx;
    }
    .title {
        font-size: 30rpx;
        line-height: 42rpx;
        font-weight: bold;
        color: #0c296e;
        margin-bottom: 16rpx;
    }
    .sub_title {
        font-size: 26rpx;
        line-height: 36rpx;
        color: $--color-sub;
    }
}
</style>
