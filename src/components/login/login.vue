<!--
 * @Author: XHL
 * @Date: 2023-07-20
 * @Description: 登录
-->
<template>
    <view class="login_box">
        <view class="login_left flex">
            <svg-icon :icon-class="computer" class="fs-32" />
            <text class="fs-26">登录{{ config.TITLE }}，为您推荐合适的职位</text>
        </view>
        <button type="primary" hover-class="none" @click="openLogin">立即登录</button>
    </view>
    <!-- 授权登录 -->
    <popup-login ref="auth_login" @update="updateInfo" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { handleBurialPoint } from '@/utils/tool'

const { config } = getApp().globalData as GlobalDataType
const computer = `${config.APP_TYPE}_computer`

const auth_login = ref()
const openLogin = () => {
    handleBurialPoint('index_login')
    auth_login.value.login.open()
    auth_login.value.isRead = false
}

const emit = defineEmits(['refresh'])
const updateInfo = (type) => {
    emit('refresh', type)
}
</script>

<style scoped lang="scss">
.login_box {
    position: fixed;
    bottom: 53px;
    bottom: calc(53px + constant(safe-area-inset-bottom));
    bottom: calc(53px + env(safe-area-inset-bottom));
    left: 32rpx;
    right: 32rpx;
    height: 82rpx;
    border-radius: 16rpx;
    padding: 16rpx 24rpx;
    background: rgba(0, 0, 0, 0.75);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .login_left {
        align-items: center;
        text {
            margin-left: 12rpx;
            color: #fff;
        }
    }
    button {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        line-height: 23px;
        height: 25px;
        padding-left: 24rpx;
        padding-right: 24rpx;
        border-radius: 8rpx;
    }
}
</style>
