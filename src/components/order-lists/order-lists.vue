<!--
 * @Author: XHL
 * @Date: 2026-04-11
 * @Description: 订单列表
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
            <view class="list px-30">
                <view v-for="item in props.list" :key="item.orderId" class="order_item pr" @click="gotoDetail(item)">
                    <view class="card_head flex justify-between align-center">
                        <view>{{ item.createTime }}</view>
                        <view class="flex align-center">
                            <template v-if="[-1].includes(Number(item.status))">
                                {{ item.statusInfo }}
                                <text class="ml-15 mr-10">|</text>
                            </template>
                            <image src="/static/images/delete_icon.png" class="delete_icon" @click.stop="handleDelete(item)" />
                        </view>
                    </view>
                    <view class="card_main py-30 px-20 flex justify-between">
                        <image src="/static/images/order_img.png" class="order_img" />
                        <view class="order_title flex1 mx-18 fs-28">{{ item.productName }}</view>
                        <view class="flex flex-column align-end justify-between">
                            <view class="amount fs-28">￥{{ item.price }}</view>
                            <view class="count fs-24">X1</view>
                            <view class="view_btn fs-24">查看详情</view>
                        </view>
                    </view>
                    <view class="card_footer">
                        <view class="flex align-end justify-end fs-24">
                            <view>共1件</view>
                            <view class="ml-20">
                                付款总额￥
                                <text class="salary">{{ separatorFilter(item.price, 2) }}</text>
                            </view>
                        </view>
                        <view v-if="[-1].includes(Number(item.status))" class="flex justify-end mt-8" @click.stop>
                            <!-- <template v-if="Number(item.status) === 1">
                                <button type="default" hover-class="none" class="danger_btn" @click="handleCash(item)">权益兑换</button>
                                <button type="default" hover-class="none" class="common_btn" @click="handleUnreg(item)">申请退款</button>
                            </template>-->
                            <button type="default" hover-class="none" class="primary_btn" @click="handleRefresh(item)">继续付款</button>
                        </view>
                    </view>
                </view>
            </view>
            <view class="no_more fs-28 py-24">{{ props.loading ? "加载中" : "没有更多了" }}</view>
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
import { goPage, separatorFilter } from "@/utils/tool";

//	接受父组件传值
const props = defineProps({
    list: {
        type: Array<OrderItem>,
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
    jobKey: {
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
});

const emit = defineEmits([
    "scroll",
    "lower",
    "upper",
    "detail",
    "cash",
    "unreg",
    "delete",
    "refresh",
]);
const triggered = ref(false);
const enabled = ref(false);
onReady(() => {
    if (props.jobKey > 0) {
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
const gotoDetail = (item) => {
    emit("detail", item);
    goPage(`/pages/orderDetail/index?orderId=${item.orderId}`);
};
// 权益兑换
const handleCash = (item) => {
    emit("cash", item);
};
// 申请退款
const handleUnreg = (item) => {
    emit("unreg", item);
};
// 删除
const handleDelete = (item) => {
    emit("delete", item.orderId);
};
// 继续付款
const handleRefresh = (item) => {
    emit("refresh", item);
};
</script>

<style scoped lang="scss">
.scroll_wrap {
    width: 100%;
    box-sizing: border-box;
}
.list {
    padding-top: 4px;
}
.order_item {
    background: #fff;
    width: 100%;
    display: block;
    box-sizing: border-box;
    border-radius: 16rpx;
    margin-bottom: 30rpx;
    &:last-child {
        margin-bottom: 0;
    }
    .card_head {
        padding: 24rpx 14rpx 24rpx 20rpx;
        border-bottom: 1px solid #ededed;
        color: $--color-sub;
        font-size: 24rpx;
        .delete_icon {
            display: block;
            width: 40rpx;
            height: 40rpx;
        }
    }
    .card_main {
        .order_img {
            display: block;
            width: 134rpx;
            height: 112rpx;
            flex-shrink: 0;
        }
        .order_title {
            color: $--color-main;
        }
        .amount {
            color: $--color-common;
        }
        .count {
            color: $--color-sub;
        }
        .view_btn {
            color: $--color-danger;
        }
    }
    .card_footer {
        border-top: 1px solid #ededed;
        padding: 20rpx 20rpx 28rpx;
        color: $--color-main;
        .salary {
            color: $--color-danger;
            font-size: 32rpx;
        }
        button {
            margin: 0;
            background: transparent;
            width: 150rpx;
            height: 50rpx;
            line-height: 46rpx;
            font-size: 24rpx;
            font-weight: 400;
            padding: 0;
        }
        .danger_btn {
            color: $--color-danger;
            border-color: $--color-danger;
        }
        .common_btn {
            color: #777;
            border-color: #777;
            margin-left: 16rpx;
        }
        .primary_btn {
            color: $--color-primary;
            border-color: $--color-primary;
        }
    }
}
.no_more {
    width: 100%;
    color: $--color-sub;
    text-align: center;
}
</style>
