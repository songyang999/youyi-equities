<!--
 * @Author: XHL
 * @Date: 2026-04-10
 * @Description: 首页
-->
<template>
    <general-custom ref="general_custom" :hide-back="true" title="首页">
        <template #content>
            <view class="hot_wrap flex justify-between">
                <view v-for="item in hotList" :key="item.productTypeId" class="hot_item flex flex-column align-center" @click="goProduct(item)">
                    <image :src="item.producttypePictureurl" class="hot_img mb-12" />
                    <view class="hot_name fs-26">{{ item.productTypeName }}</view>
                </view>
            </view>
            <view class="tab_wrap mx-30">
                <image src="/static/images/wnyx.png" class="tab_bac" />
                <view class="tab_sub_text pa fs-24">品质之选，温暖相伴</view>
                <view class="tab_list pa flex justify-center">
                    <view
                        v-for="item in tabList"
                        :key="item.productTypeId"
                        :class="{ tab_item_active: item.productTypeId === activeTab }"
                        class="tab_item fs-32 px-20 pb-28"
                        @click="handleClick(item)"
                    >{{ item.productTypeName }}</view>
                </view>
            </view>
            <view class="gap" />
            <view class="goods_content">
                <!-- !loading &&  -->
                <!-- v-if="show_goods"
                :goods-key="goods_key"-->
                <goods-list
                    :key="activeTab"
                    :list="productList"
                    :height="goodsHeight"
                    :loading="loading"
                    :scroll-y="scrollY"
                    :options="{
                        enhanced: true,
                        bounces: false,
                        throttle: false,
                    }"
                />
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onShow, onReady, onShareAppMessage } from "@dcloudio/uni-app";
import { ref, nextTick } from "vue";
import { homePage } from "@/api/home";
import { getRmainHeight } from "@/utils/tool";
const { customHeaderHeight } = getApp().globalData as GlobalDataType;

const goProduct = (item) => {
    uni.reLaunch({
        url: `/pages/product/index?productTypeId=${item.productTypeId}`,
    });
};

onShow((_) => {
    getHomePage();
});
// 热区
interface HotItem {
    productTypeId: number;
    productTypeName: string;
    producttypePictureurl: string;
}
const hotList = ref<HotItem[]>([]);

// tab列表
interface TabItem {
    productTypeId: number;
    productTypeName: string;
    optimizedProductArray: ProductItem[];
}
const tabList = ref<TabItem[]>([]);
const activeTab = ref(0);
const handleClick = (item) => {
    loading.value = true;
    activeTab.value = item.productTypeId;
    productList.value = item.optimizedProductArray || [];
    nextTick(() => {
        loading.value = false;
    });
};

// 商品列表
const productList = ref<ProductItem[]>([]);
const scrollY = ref(true);
const loading = ref(false);

// 获取首页数据
const getHomePage = async () => {
    try {
        loading.value = true;
        const res: any = await homePage();
        const { hotProductTypeArray = [], optimizedProductTypeArray = [] } =
            res.data || {};
        hotList.value = hotProductTypeArray || [];
        tabList.value = optimizedProductTypeArray || [];
        if (tabList.value.length > 0) {
            handleClick(tabList.value[0]);
        }
    } catch (error) {
        //
        loading.value = false;
    }
};

const goodsHeight = ref(0); // 商品列表高度
onReady(async () => {
    const height = await getRmainHeight(["hot_wrap", "tab_wrap", "gap"]);
    goodsHeight.value = height - customHeaderHeight;
});

// 分享给好友
onShareAppMessage(() => {
    // const { uid } = getApp().globalData as GlobalDataType;
    let path = "/pages/home/index";
    // if (uid) path += `?uid=${uid}&ut=1`;
    const shareObj = {
        title: "快来权益宝领福利吧",
        path,
    };
    return shareObj;
});
</script>

<style scoped lang="scss">
.hot_wrap {
    padding: 35rpx 60rpx 40rpx;
    .hot_item {
        .hot_img {
            display: inline-block;
            width: 84rpx;
            height: 84rpx;
        }
        .hot_name {
            color: $--color-main;
        }
    }
}
.tab_wrap {
    height: 166rpx;
    border-radius: 20rpx 20rpx 0rpx 0rpx;
    overflow: hidden;
    position: relative;
    .tab_bac {
        display: block;
        width: 100%;
        height: 100%;
    }
    .tab_sub_text {
        border: 1rpx solid $--color-blue;
        border-radius: 15rpx 8rpx 8rpx 0rpx;
        top: 15rpx;
        right: 10rpx;
        color: $--color-blue;
        padding: 0 10rpx;
        height: 38rpx;
        line-height: 36rpx;
    }
    .tab_list {
        left: 0;
        bottom: 0;
        width: 100%;
        .tab_item {
            color: $--color-main;
        }
        .tab_item_active {
            color: $--color-primary;
            font-weight: 500;
        }
    }
}
.gap {
    height: 36rpx;
    width: 100%;
}
</style>
