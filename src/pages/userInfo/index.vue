<!--
 * @Author: XHL
 * @Date: 2026-04-18
 * @Description: 账户信息
-->
<template>
    <general-custom ref="general_custom" title="账户信息">
        <template #content>
            <view class="flex flex-column align-center pt-20">
                <view class="avatar_box">
                    <image class="avatar" src="@/static/images/avatar.png" />
                </view>
                <view class="name fs-32">账号信息</view>
            </view>
            <view class="info_card mx-50">
                <view class="flex mb-24">
                    <image class="info_icon" src="@/static/images/mobile.png" />
                    <view class="info_li flex1 flex justify-between align-center pb-30">
                        <view class="info_content">
                            <view class="info_main fs-32">手机号码</view>
                            <view class="info_sub fs-24">请输入手机号码</view>
                        </view>
                        <image class="next" src="@/static/images/right.png" />
                    </view>
                </view>
                <view class="flex mb-24">
                    <image class="info_icon" src="@/static/images/mail.png" />
                    <view class="info_li flex1 flex justify-between align-center pb-30">
                        <view class="info_content">
                            <view class="info_main fs-32">邮箱</view>
                            <view class="info_sub fs-24">请输入邮箱</view>
                        </view>
                        <image class="next" src="@/static/images/right.png" />
                    </view>
                </view>
                <view class="flex">
                    <image class="info_icon" src="@/static/images/loc.png" />
                    <view class="info_li flex1 flex justify-between align-center pb-30">
                        <view class="info_content">
                            <view class="info_main fs-32">地址</view>
                            <view class="info_sub fs-24">请输入地址</view>
                        </view>
                        <image class="next" src="@/static/images/right.png" />
                    </view>
                </view>
            </view>
            <button type="primary" class="mx-50">修改信息</button>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.avatar_box {
    width: 230rpx;
    height: 230rpx;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 24rpx;
    .avatar {
        display: block;
        width: 100%;
        height: 100%;
    }
}
.name {
    color: $--color-main;
    margin-bottom: 64rpx;
}
.info_card {
    padding: 34rpx 38rpx;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 16rpx;
    box-sizing: border-box;
    margin-bottom: 72rpx;
    .info_icon {
        display: block;
        width: 68rpx;
        height: 58rpx;
        margin-right: 22rpx;
    }
    .info_li {
        border-bottom: 1px solid #EDEDED;
        &:last-child {
            border-bottom: 0;
        }
        .info_main {
            color: $--color-main;
        }
        .info_sub {
            color: $--color-sub;
        }
        .next {
            display: block;
            width: 30rpx;
            height: 30rpx;
        }
    }
}
</style>
