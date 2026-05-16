<!--
 * @Author: XHL
 * @Date: 2026-04-10
 * @Description: 产品页
-->
<template>
    <general-custom ref="general_custom" :hide-back="true" title="产品">
        <template #content>
            <view class="search_wrap px-30 pt-20 pb-30">
                <view class="search flex align-center">
                    <input
                        v-model="keyword"
                        confirm-type="search"
                        placeholder="搜索"
                        placeholder-style="font-size: 28rpx; color: #999999;"
                        class="search_input fs-28"
                        @blur="searchList"
                        @confirm="searchList"
                    />
                    <image class="search_icon" src="/static/images/search.png" mode="aspectFit" />
                </view>
            </view>
            <view class="flex">
                <view :style="{ height: goodsHeight + 'px' }" class="left_wrap pt-4">
                    <view class="left_list pt-28">
                        <view
                            v-for="item in navList"
                            :key="item.productTypeId"
                            :class="{ active_nav_item: item.productTypeId == activeTab }"
                            class="nav_item fs-28"
                            @click="handleClick(item)"
                        >{{ item.productTypeName }}</view>
                    </view>
                </view>
                <div class="flex1">
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
                        :is-min="true"
                    />
                </div>
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onReady, onShareAppMessage } from "@dcloudio/uni-app";
import { ref } from "vue";
import { productPage } from "@/api/product";
import { getRmainHeight } from "@/utils/tool";
const { customHeaderHeight } = getApp().globalData as GlobalDataType;

const goodsHeight = ref(0); // 商品列表高度
onReady(async () => {
    const height = await getRmainHeight(["search_wrap"]);
    goodsHeight.value = height - customHeaderHeight;
});

onLoad((query: any) => {
    if (query?.productTypeId) {
        activeTab.value = +query.productTypeId;
    }
    getProductPage();
});

// 左侧菜单
interface NavItem {
    productTypeId: number;
    productTypeName: string;
    allProductArray: ProductItem[];
}
const navList = ref<NavItem[]>([]);
const activeTab = ref(0);
const handleClick = (item) => {
    activeTab.value = item.productTypeId;
    // productList.value = item.allProductArray || [];
    searchList();
};

// 商品列表
const productList = ref<ProductItem[]>([]);
const scrollY = ref(true);
const loading = ref(false);

// 获取产品页数据
const getProductPage = async () => {
    try {
        const res: any = await productPage();
        const { allProductTypeArray = [] } = res.data || {};
        navList.value = allProductTypeArray || [];
        if (navList.value.length > 0) {
            let nav: any = navList.value[0];
            if (activeTab.value) {
                nav = navList.value.find(
                    (item) => item.productTypeId === activeTab.value
                );
            }
            handleClick(nav);
        }
    } catch (error) {
        //
    }
};

// 搜索
const keyword = ref("");
const searchList = () => {
    const nav = navList.value.find(
        (item) => item.productTypeId == activeTab.value
    );
    productList.value = (nav?.allProductArray || []).filter((item) =>
        item.productName.includes(keyword.value)
    );
};

// 分享给好友
onShareAppMessage((res: any) => {
    //
});
</script>

<style scoped lang="scss">
.search_wrap {
    width: 100%;
    box-sizing: border-box;
    .search {
        width: 100%;
        height: 82rpx;
        border-radius: 22rpx;
        background-color: #fff;
        padding: 0 40rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        .search_input {
            height: 42rpx;
            flex: 1;
        }
        .search_icon {
            flex-shrink: 0;
            display: block;
            width: 48rpx;
            height: 48rpx;
        }
    }
}
.left_wrap {
    width: 174rpx;
    .left_list {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 0px 20rpx 0px 0px;
    }

    .nav_item {
        width: 100%;
        height: 82rpx;
        line-height: 82rpx;
        text-align: center;
        color: $--color-main;
    }
    .active_nav_item {
        background: #f8f8f8;
        color: $--color-primary;
    }
}
</style>
