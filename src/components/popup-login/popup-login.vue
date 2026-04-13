<!--
 * @Author: XHL
 * @Date: 2023-09-12
 * @Description: 登录抽屉
-->
<template>
    <!-- 授权登录 -->
    <popup-bottom ref="login">
        <template #content>
            <view class="pa-32">
                <view class="flex flex-column align-center mb-64">
                    <image :src="logo" mode="aspectFit" class="logo" />
                    <view class="login_title fs-34">100%真实靠谱工作</view>
                </view>
                <view class="flex mb-64">
                    <view class="check_box flex align-center pr-16" @click="updateRead">
                        <svg-icon v-if="isRead" :icon-class="checked" class="fs-28" />
                        <svg-icon v-else icon-class="check" class="fs-28" />
                    </view>
                    <view class="fs-28">
                        <view class="main_color mb-12">使用该功能需注册/登录平台账号，阅读并同意</view>
                        <view class="main_color flex">
                            <view class="primary_color" @click="goPage('/pages/agreement/index?type=1')"
                                >《用户协议》</view
                            >和
                            <view class="primary_color" @click="openPrivacyContract">《隐私指引》</view>
                        </view>
                    </view>
                </view>
                <button
                    v-if="isRead"
                    id="agree-btn"
                    type="primary"
                    class="fs-32"
                    hover-class="none"
                    open-type="getPhoneNumber|agreePrivacyAuthorization"
                    @getphonenumber="getPhone"
                >
                    一键登录
                </button>
                <button v-else type="primary" class="fs-32" hover-class="none" @click="getPhone">一键登录</button>
            </view>
        </template>
    </popup-bottom>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getPhoneNumber } from '@/utils'
import { toast, prefixedUrl, goPage } from '@/utils/tool'

const { config } = getApp().globalData as GlobalDataType
const logo = computed(() => prefixedUrl(`${config.APP_TYPE}_login_logo.png`))
const checked = `${config.APP_TYPE}_checked`

const login = ref()

const isRead = ref(false)
const updateRead = () => {
    isRead.value = !isRead.value
}

defineExpose({ login, isRead })

const openPrivacyContract = () => {
    uni.openPrivacyContract({
        success: () => {},
    })
}

const emit = defineEmits(['update'])
const getPhone = async (e: any) => {
    if (!isRead.value) {
        toast('请阅读并同意隐私指引')
        return
    }
    try {
        uni.showLoading({
            mask: true,
            title: '加载中...',
        })
        const res = await getPhoneNumber(e)
        if (res) {
            login.value.close()
            const globalData = getApp().globalData as GlobalDataType
            if (globalData.first_authority) {
                emit('update', 2)
                globalData.first_authority = false
            } else {
                emit('update', 1)
            }
        }
    } catch (error) {
        //
    } finally {
        uni.hideLoading()
    }
}
</script>

<style scoped lang="scss">
.logo {
    display: inline-block;
    width: 160rpx;
    height: 160rpx;
}
.login_title {
    font-weight: bold;
    color: $--color-main;
    text-align: center;
}
.check_box {
    height: 40rpx;
}
.primary_color {
    color: $--color-primary;
}
.main_color {
    color: $--color-main;
}
</style>
