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
                    <image class="avatar" :src="userInfo.avatarUrl || '/static/images/avatar.png'" />
                </view>
                <view class="name fs-32">{{userInfo.nickName || '游客'}}</view>
            </view>
            <view class="info_card mx-50">
                <view class="flex mb-24">
                    <image class="info_icon" src="@/static/images/mobile.png" />
                    <view class="info_li flex1 flex justify-between align-center pb-30">
                        <view v-if="userInfo.mobile" class="info_content">
                            <view class="info_main fs-32">{{userInfo.mobile}}</view>
                        </view>
                        <view v-else class="info_content">
                            <view class="info_main fs-32">手机号码</view>
                            <view class="info_sub fs-24">请输入手机号码</view>
                        </view>
                    </view>
                </view>
                <view class="flex mb-24">
                    <image class="info_icon" src="@/static/images/mail.png" />
                    <view class="info_li flex1 flex justify-between align-center pb-30">
                        <view v-if="userInfo.email" class="info_content">
                            <view class="info_main fs-32">{{userInfo.email}}</view>
                        </view>
                        <view v-else class="info_content">
                            <view class="info_main fs-32">邮箱</view>
                            <view class="info_sub fs-24">请输入邮箱</view>
                        </view>
                    </view>
                </view>
                <view class="flex">
                    <image class="info_icon" src="@/static/images/loc.png" />
                    <view class="info_li flex1 flex justify-between align-center pb-30 no_border">
                        <view v-if="userInfo.address" class="info_content">
                            <view class="info_main fs-32">{{userInfo.address}}</view>
                        </view>
                        <view v-else class="info_content">
                            <view class="info_main fs-32">地址</view>
                            <view class="info_sub fs-24">请输入地址</view>
                        </view>
                    </view>
                </view>
            </view>
            <button type="primary" class="mx-50 mb-50" @click="goPage('/pages/editUser/index')">修改信息</button>
            <button class="mx-50" @click="logOut">退出登录</button>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
import { wxLogin } from "@/utils";
import { goPage } from "@/utils/tool";
import { wechatUserInfo } from "@/api/my";

onShow(() => {
    getPerson();
});

// 获取用户信息
const userInfo = ref({
    avatarUrl: "",
    nickName: "",
    mobile: "",
    email: "",
    address: "",
});
const getPerson = async () => {
    try {
        uni.showLoading({
            mask: true,
            title: "加载中...",
        });
        const res: any = await wechatUserInfo();
        userInfo.value = res.data || {};
        const { mobile } = getApp().globalData as GlobalDataType;
        userInfo.value.mobile = mobile || "";
    } catch (error) {
        //
    } finally {
        uni.hideLoading();
    }
};

const logOut = () => {
    uni.showModal({
        content: "确认退出当前账号？",
        cancelText: "取消",
        confirmText: "确认",
        success: async function (res) {
            if (res.confirm) {
                uni.removeStorageSync("mobile");
                uni.removeStorageSync("token");
                uni.removeStorageSync("userInfo");
                const globalData = getApp().globalData as GlobalDataType;
                globalData.mobile = "";
                await wxLogin();
                uni.reLaunch({
                    url: "/pages/home/index",
                });
            }
        },
    });
};
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
        border-bottom: 1px solid #ededed;
        height: 78rpx;
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
    .no_border {
        border-bottom: 0;
    }
}
</style>
