<!--
 * @Author: XHL
 * @Date: 2026-04-10
 * @Description: 商品列表
-->
<template>
    <scroll-view
        :style="{ maxHeight: `${props.height}px` }"
        :refresher-enabled="enabled"
        :refresher-threshold="100"
        :refresher-triggered="triggered"
        :scroll-y="scrollY"
        :enhanced="options.enhanced"
        :bounces="options.bounces"
        :throttle="options.throttle"
        :upper-threshold="0"
        type="list"
        @scroll="onScroll"
        @refresherrefresh="onRefresh"
        @scrolltolower="scrolltolower"
        @scrolltoupper="scrolltoupper"
    >
        <template v-if="props.list.length || props.loading">
            <view :class="{ min_list: props.isMin }" class="list flex justify-between px-30">
                <view v-for="item in props.list" :key="item.productTypeId" class="good_item pr" @click="gotoDetail(item)">
                    <image :src="item.productPictureUrl" class="good_img mb-16" />
                    <view class="good_title line_ovh px-16 mb-10">{{ item.productName }}</view>
                    <view class="flex justify-between px-16">
                        <view class="salary fs-32">
                            <text class="fs-22">¥</text>
                            {{ item.price }}
                        </view>
                        <!-- <view class="fs-28">¥10.00</view> -->
                        <view class="flex align-center">
                            <image src="/static/images/rocket.png" class="rocket" />
                            <text class="common_color fs-32 rocket_text">100</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="no_more fs-28 pb-24">
                {{
                props.loading ? "加载中" : "没有更多了"
                }}
            </view>
        </template>
        <template v-else>
            <view class="pt-64">
                <no-data text="暂无数据" />
            </view>
        </template>
    </scroll-view>
</template>

<script setup lang="ts">
import { onReady } from "@dcloudio/uni-app";
import { ref } from "vue";
import { goPage } from "@/utils/tool";

// const { config } = getApp().globalData as GlobalDataType;
//	接受父组件传值
const props = defineProps({
    list: {
        type: Array<ProductItem>,
        default: () => [],
    },
    height: {
        type: Number,
        default: 0,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    goodsKey: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
        default: "",
    },
    scrollY: {
        type: Boolean,
        default: true,
    },
    options: {
        type: Object,
        default: () => ({
            enhanced: false,
            bounces: true,
            throttle: true,
        }),
    },
    isMin: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["scroll", "lower", "upper", "detail"]);
const triggered = ref(false);
const enabled = ref(false);
onReady(() => {
    if (props.goodsKey > 0) {
        triggered.value = true;
        enabled.value = true;
    }
});

const onScroll = (e) => {
    emit("scroll", e);
};

const onRefresh = () => {
    setTimeout(() => {
        triggered.value = false;
    }, 1000);
    setTimeout(() => {
        enabled.value = false;
    }, 1050);
};
// 上滑加载
const scrolltolower = () => {
    if (props.loading) return;
    emit("lower");
};
// 滚动到顶部
const scrolltoupper = () => {
    if (props.loading) return;
    emit("upper");
};

// 点击跳转
const gotoDetail = (item: ProductItem) => {
    emit("detail", item);
    goPage(`/pages/productDetail/index?productKey=${item.productKey}`);
};
</script>

<style scoped lang="scss">
.scroll_wrap {
    width: 100%;
    box-sizing: border-box;
}
.list {
    padding-top: 4px;
    flex-wrap: wrap;
}
.good_item {
    background: #fff;
    width: 332rpx;
    height: 472rpx;
    display: block;
    box-sizing: border-box;
    border-radius: 20rpx;
    overflow: hidden;
    margin-bottom: 34rpx;
    .good_img {
        display: block;
        width: 100%;
        height: 332rpx;
    }
    .good_title {
        color: $--color-main;
        font-size: 30rpx;
    }
    .salary {
        color: $--color-danger;
    }
    .common_color {
        color: $--color-sub;
    }
    .rocket {
        display: inline-block;
        width: 28rpx;
        height: 28rpx;
        margin-right: 2rpx;
    }
}
.min_list {
    .good_item {
        width: 248rpx;
        height: 330rpx;
        .good_img {
            height: 230rpx;
        }
        .good_title {
            font-size: 26rpx;
        }
        .salary {
            font-size: 24rpx;
        }
        .rocket {
            width: 20rpx;
            height: 20rpx;
        }
        .rocket_text {
            font-size: 24rpx;
        }
    }
}
.no_more {
    width: 100%;
    color: $--color-sub;
    text-align: center;
}
</style>
