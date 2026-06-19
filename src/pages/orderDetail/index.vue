<!--
 * @Author: XHL
 * @Date: 2026-04-27
 * @Description: 我的订单
-->
<template>
    <general-custom ref="general_custom" title="我的订单">
        <template #content>
            <view class="px-30">
                <view class="order_item pr mt-50">
                    <view class="card_head flex justify-between align-center">
                        <view>{{ orderDetail.createTime }}</view>
                        <view class="flex align-center">
                            {{ orderDetail.statusInfo }}
                            <text class="ml-15 mr-10">|</text>
                            <image src="/static/images/delete_icon.png" class="delete_icon" @click="handleDelete" />
                        </view>
                    </view>
                    <view class="card_main py-30 px-20 flex justify-between">
                        <image src="/static/images/order_img.png" class="order_img" />
                        <view class="order_title flex1 mx-18 fs-28">{{ orderDetail.productName }}</view>
                        <view class="flex flex-column align-end justify-between">
                            <view class="amount fs-28">￥{{ orderDetail.price }}</view>
                            <view class="count fs-24">X1</view>
                        </view>
                    </view>
                    <view class="card_footer">
                        <view class="flex align-end justify-end fs-24">
                            <view>共1件</view>
                            <view class="ml-20">
                                付款总额￥
                                <text class="salary">{{ separatorFilter(orderDetail.price, 2) }}</text>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="info_card">
                    <view class="info_title fs-28 mb-30">
                        订单信息
                        <text class="ml-18 fs-24">{{dayjs(orderDetail.createTime).format('YYYY-MM-DD')}}</text>
                    </view>
                    <view class="info_li">
                        <view class="info_li_label">订单编号</view>
                        <view class="info_li_value flex" @click="handleCopy">
                            <view class="line_ovh order_id">{{ orderDetail.orderId }}</view>
                            <text class="mx-8">|</text>
                            <text class="copy">复制</text>
                        </view>
                    </view>
                    <!-- <view class="info_li">
                        <view class="info_li_label">成交时间</view>
                        <view class="info_li_value">{{ orderDetail.createTime }}</view>
                    </view>-->
                    <view class="info_li">
                        <view class="info_li_label">付款时间</view>
                        <view class="info_li_value">{{ orderDetail.feeTime }}</view>
                    </view>
                    <view class="info_li">
                        <view class="info_li_label">支付交易号</view>
                        <view class="info_li_value">{{orderDetail.payTraceNo}}</view>
                    </view>
                    <view class="info_li">
                        <view class="info_li_label">支付方式</view>
                        <view class="info_li_value">{{ orderDetail.serviceName }}</view>
                    </view>
                    <view class="info_li">
                        <view class="info_li_label">兑换时间</view>
                        <view class="info_li_value">{{orderDetail.conversionTime}}</view>
                    </view>
                    <!-- <view class="info_li">
                        <view class="info_li_label">订购方式</view>
                        <view class="info_li_value">微信</view>
                    </view>-->
                </view>
            </view>
            <template v-if="[-1, 1].includes(Number(orderDetail.status))">
                <view class="footer" />
                <view class="footer-box">
                    <view class="btn_box flex align-center py-14">
                        <template v-if="Number(orderDetail.status) === 1">
                            <button type="primary" hover-class="none" @click="openEquity">权益兑换</button>
                            <button type="primary" hover-class="none" @click="openUnreg">业务退订</button>
                        </template>
                        <button v-else type="primary" hover-class="none" @click="handlePayOrder">继续付款</button>
                    </view>
                </view>
            </template>
        </template>
    </general-custom>
    <!-- 权益兑换 -->
    <equity-cash v-if="dialogEquity" @close="openCash" />
    <!-- 权益兑换成功 -->
    <cash-success v-if="dialogVisible" :content="content" @close="handleClose" />
    <!-- 业务退订 -->
    <business-unreg v-if="dialogUnreg" @close="handleCloseUnreg" />
    <!-- 退订成功 -->
    <unreg-success v-if="dialogSuccess" @close="closeSuccessUnreg" />
    <!-- 订购成功 -->
    <order-success v-if="dialogSuccessVisible" :price="orderDetail.price" :name="productName" @close="closeSuccess" />
    <!-- 订购失败 -->
    <order-failure v-if="dialogFailVisible" :error-msg="errorMsg" @close="closeFailure" />
</template>

<script lang="ts" setup type="module">
import { onLoad } from "@dcloudio/uni-app";
import { ref, computed } from "vue";
import { toast, separatorFilter } from "@/utils/tool";
import { getOrder, agiotage, deleteOrder, payOrder } from "@/api/my";
import dayjs from "dayjs";
onLoad((query: any) => {
    if (query?.orderId) {
        getOrderDetail(query.orderId);
    }
});

const orderDetail = ref<OrderItem>({});
const getOrderDetail = async (orderId: string) => {
    try {
        const res: any = await getOrder({ orderId });
        orderDetail.value = res?.data[0] || {};
    } catch (error) {
        //
    }
};

// 复制
const handleCopy = () => {
    uni.setClipboardData({
        data: orderDetail.value.orderId,
        success(res) {
            toast("复制成功");
        },
    });
};

// 权益兑换
const dialogEquity = ref(false);
const openEquity = () => {
    dialogEquity.value = true;
};
// 兑换成功
const dialogVisible = ref(false);
const content = ref("");
const openCash = async (data) => {
    try {
        const params = {
            equityCode: data.equity,
            boundMobile: data.mobile,
            orderId: orderDetail.value.orderId
        };
        const res: any = await agiotage(params);
        content.value = res.result?.msg || "";
        dialogEquity.value = false;
        dialogVisible.value = true;
        getOrderDetail(orderDetail.value.orderId);
    } catch (error) {
        //
    }
};
const handleClose = () => {
    dialogVisible.value = false;
};

// 业务退订
const dialogUnreg = ref(false);
const openUnreg = () => {
    dialogUnreg.value = true;
};
const handleCloseUnreg = () => {
    dialogUnreg.value = false;
    dialogSuccess.value = true;
};
// 退订成功
const dialogSuccess = ref(false);
const closeSuccessUnreg = () => {
    dialogSuccess.value = false;
};

// 删除订单
const handleDelete = () => {
    uni.showModal({
        content: "确定删除当前订单吗？",
        cancelText: "取消",
        confirmText: "确定",
        success: async function (res) {
            if (res.confirm) {
                try {
                    await deleteOrder({ orderId: orderDetail.value.orderId });
                    toast("删除成功");
                    setTimeout(() => {
                        uni.navigateBack();
                    }, 2000);
                } catch (error) {
                    //
                }
            }
        },
    });
};

const productName = computed(() => {
    if (orderDetail.value.productKey === "EQ_P_0000002") {
        return "视频会员"
    } else if (orderDetail.value.productKey === "EQ_P_0000003") {
        return "音频会员"
    } else {
        return orderDetail.value.productName
    }
});
const dialogSuccessVisible = ref(false);
const closeSuccess = () => {
    dialogSuccessVisible.value = false;
    getOrderDetail(orderDetail.value.orderId)
};
const dialogFailVisible = ref(false);
const errorMsg = ref("");
const closeFailure = () => {
    dialogFailVisible.value = false;
    getOrderDetail(orderDetail.value.orderId)
};
// 继续付款
const handlePayOrder = async () => {
    try {
        await payOrder({orderId: orderDetail.value.orderId})
        dialogSuccessVisible.value = true;
    } catch (error: any) {
        if (error?.result?.msg) {
            errorMsg.value = error.result.msg;
            dialogFailVisible.value = true;
        }
    }
}
</script>

<style lang="scss" scoped>
.order_item,
.info_card {
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    border-radius: 16rpx;
}
.order_item {
    margin-bottom: 30rpx;
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
    }
    .card_footer {
        border-top: 1px solid #ededed;
        padding: 20rpx 20rpx 28rpx;
        color: $--color-main;
        .salary {
            color: $--color-danger;
            font-size: 32rpx;
        }
    }
}
.info_card {
    padding: 30rpx 20rpx;
    .info_title {
        color: $--color-main;
        font-weight: 500;
        text {
            color: $--color-sub;
            font-weight: 400;
        }
    }
    .info_li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        margin-bottom: 30rpx;
        &:last-child {
            margin-bottom: 0;
        }
        .info_li_label {
            color: $--color-main;
        }
        .info_li_value {
            color: $--color-sub;
            max-width: 450rpx;
            word-break: break-all;
            .copy {
                color: $--color-main;
            }
        }
        .order_id {
            max-width: 360rpx;
        }
    }
}
.footer {
    width: 100%;
    height: 98rpx;
    height: calc(98rpx + constant(safe-area-inset-bottom));
    height: calc(98rpx + env(safe-area-inset-bottom));
}
.btn_box {
    width: 100%;
    height: 100%rpx;
    justify-content: around;
    button + button {
        margin-left: 0;
    }
    button {
        width: 300rpx;
        border-color: transparent;
        &:last-child {
            background-color: #eaeefd;
            color: $--color-primary;
        }
    }
}
</style>
