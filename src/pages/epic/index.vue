<!--
 * @Author: XHL
 * @Date: 2023年8月30日
 * @Description: 隐私中心
-->
<template>
    <general-custom title="隐私中心">
        <template #content>
            <view class="px-24 py-32">
                <view
                    class="policy_box flex justify-between align-center"
                    @click="goPage('/pages/agreement/index?type=1')"
                >
                    <view class="flex align-center">
                        <svg-icon :icon-class="epic_user" class="fs-38" />
                        <view class="common_text fs-30 ml-16">用户协议</view>
                    </view>
                    <svg-icon icon-class="next" class="fs-30 mt-4" />
                </view>
                <view class="policy_box flex justify-between align-center" @click="openPrivacyContract">
                    <view class="flex align-center">
                        <svg-icon :icon-class="epic" class="fs-38" />
                        <view class="common_text fs-30 ml-16">隐私指引</view>
                    </view>
                    <svg-icon icon-class="next" class="fs-30 mt-4" />
                </view>
            </view>

            <view class="footer-box">
                <view class="footer py-24 px-32">
                    <button hover-class="none" class="fs-28" @click="logOut">退出登录</button>
                </view>
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { wxLogin } from '@/utils'
import { goPage } from '@/utils/tool'

const { config } = getApp().globalData as GlobalDataType
const epic_user = `${config.APP_TYPE}_epic_user`
const epic = `${config.APP_TYPE}_epic`

const openPrivacyContract = () => {
    uni.openPrivacyContract({
        success: () => {},
    })
}

const logOut = () => {
    uni.showModal({
        content: '确认退出当前账号？',
        cancelText: '取消',
        confirmText: '确认',
        success: async function (res) {
            if (res.confirm) {
                uni.removeStorageSync('phone')
                uni.removeStorageSync('token')
                uni.removeStorageSync('uid')
                const globalData = getApp().globalData as GlobalDataType
                globalData.phone = ''
                globalData.uid = 0
                globalData.first_authority = false
                await wxLogin()
                uni.reLaunch({
                    url: '/pages/home/index',
                })
            }
        },
    })
}
</script>

<style lang="scss" scoped>
.policy_box {
    width: 100%;
    height: 108rpx;
    box-sizing: border-box;
    border-bottom: 1px solid $--color-border;
}
.common_text {
    color: $--color-main;
}
</style>
