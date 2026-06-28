<!--
 * @Author: XHL
 * @Date: 2026-04-11
 * @Description: 产品详情
-->
<template>
    <general-custom ref="general_custom" title="产品详情">
        <template #content>
            <view class="head_wrap mb-16">
                <view class="product_img">
                    <image :src="detailInfo.productPictureUrl" mode="widthFix" />
                </view>
                <view class="product_info">
                    <view class="product_name fs-36 mb-30">{{ detailInfo.productName }}</view>
                    <view class="flex justify-between align-center">
                        <view class="salary fs-36">
                            <text class="fs-26">¥</text>
                            {{detailInfo.price}}
                        </view>
                        <view class="fs-28 count">
                            已售
                            <text class="fs-26">{{ detailInfo.productSold }}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="introduce_images">
                <image v-for="item in productDetail" :key="item.index" :src="item.content" mode="widthFix" class="introduce_img" />
            </view>
            <view class="footer" />
            <view class="footer-box">
                <view class="flex align-center justify-between py-12 px-30">
                    <view class="home_btn flex flex-column align-center justify-center px-12 mx-20" @click="goHome">
                        <image src="/static/images/to_home.png" class="home_icon mb-8" />
                        <text class="fs-20">首页</text>
                    </view>
                    <view class="btn_box flex">
                        <button type="primary" class="flex1" hover-class="none" @click="singleOrder(1)">单次订购</button>
                        <button type="primary" class="flex1" hover-class="none" @click="singleOrder(2)">包月订购</button>
                    </view>
                </view>
            </view>
        </template>
    </general-custom>
    <!-- 授权登录 -->
    <popup-login ref="auth_login" @update="getDetail" />
</template>

<script lang="ts" setup type="module">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { goPage, toast } from "@/utils/tool";
import { getEquieitsProduct } from "@/api/product";

const productKey = ref("");
// 根据 productKey 判断图片目录：1-视频 2-音频
onLoad((query: any) => {
    productKey.value = query.productKey || "";
    getDetail();
});

// 获取详情
const detailInfo = ref<ProductItem>({
    productTypeId: 0,
    productName: "",
    price: 0,
    productPictureUrl: "",
    productKey: "",
    productDetail: "",
    productSold: "0",
    attribute: 0,
});
interface imgItem {
    index: number;
    content: string;
}
const productDetail = ref<imgItem[]>([]);
const getDetail = async () => {
    try {
        const res: any = await getEquieitsProduct({
            productKey: productKey.value,
        });
        const data = res?.data[0] || {};
        detailInfo.value = data;
        productDetail.value = data.productDetail
            ? JSON.parse(data.productDetail)
            : [];
    } catch (error) {
        //
    }
};

// 单次订购
const singleOrder = (type: number) => {
    const { mobile } = getApp().globalData as GlobalDataType;
    if (!mobile) {
        openLogin();
        return;
    }
    if (type === 1) {
        toast("功能暂未开通，敬请期待");
    } else {
        goPage(
            `/pages/signOrder/index?productKey=${productKey.value}&price=${detailInfo.value.price}&attribute=${detailInfo.value.attribute}`
        );
    }
};

// 登录
const auth_login = ref();
const openLogin = () => {
    auth_login.value.login.open();
    auth_login.value.isRead = false;
};
// 返回首页
const goHome = () => {
    uni.reLaunch({
        url: "/pages/home/index",
    });
};
</script>

<style lang="scss" scoped>
.head_wrap {
    width: 100%;
    background: #fff;
    .product_img {
        width: 100%;
        height: 750rpx;
        overflow: hidden;
        image {
            display: block;
            width: 100%;
        }
    }
    .product_info {
        width: 100%;
        padding: 60rpx 30rpx 36rpx;
        box-sizing: border-box;
        .product_name {
            font-weight: 500;
            color: $--color-main;
        }
        .salary {
            color: $--color-danger;
        }
        .count {
            color: $--color-sub;
        }
    }
}
.introduce_images {
    width: 100%;
    .introduce_img {
        display: block;
        width: 100%;
    }
}
.footer {
    width: 100%;
    height: 100rpx;
    height: calc(100rpx + constant(safe-area-inset-bottom));
    height: calc(100rpx + env(safe-area-inset-bottom));
}
.home_btn {
    height: 76rpx;
    color: $--color-common;
    .home_icon {
        display: block;
        width: 44rpx;
        height: 44rpx;
    }
}
.btn_box {
    width: 520rpx;
    height: 76rpx;
    border-radius: 38rpx;
    overflow: hidden;
    button + button {
        margin-left: 0;
    }
    button {
        border-radius: 0;
        border-color: transparent;
        &:first-child {
            background-color: $--color-blue;
        }
    }
}
</style>
