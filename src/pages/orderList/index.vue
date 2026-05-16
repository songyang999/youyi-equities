<!--
 * @Author: XHL
 * @Date: 2026-04-11
 * @Description: 我的订单
-->
<template>
    <general-custom title="我的订单">
        <template #content>
            <view :style="{ top: customHeaderHeight + 'px' }" class="tab_wrap pt-40 pb-50 px-40">
                <tabs :tab-nav="tabList" :active="active" @change="changeTab" />
            </view>
            <view v-if="orderList.length" class="job_wrap">
                <order-list :list="orderList" :height="scrollHeight" :loading="loading" type="progress" @cash="openEquity" @unreg="openUnreg" />
            </view>
            <view v-else class="no_wrap">
                <no-data />
            </view>
        </template>
    </general-custom>
    <!-- 权益兑换 -->
    <equity-cash v-if="dialogEquity" @close="openCash" />
    <!-- 权益兑换成功 -->
    <cash-success v-if="dialogVisible" @close="handleClose" />
    <!-- 业务退订 -->
    <business-unreg v-if="dialogUnreg" @close="handleCloseUnreg" />
    <!-- 退订成功 -->
    <unreg-success v-if="dialogSuccess" @close="closeSuccess" />
</template>

<script setup lang="ts">
import { onLoad, onReady } from "@dcloudio/uni-app";
import { ref, nextTick } from "vue";
import { myOrder } from "@/api/my";
import { getRmainHeight } from "@/utils/tool";

const { customHeaderHeight } = getApp().globalData as GlobalDataType;

onLoad((query) => {
    // if (query.active) {
    //     active.value = +query.active;
    // }
    getList();
});

const scrollHeight = ref(0);
onReady(() => {
    nextTick(async () => {
        const height = await getRmainHeight(["tab_wrap"]);
        scrollHeight.value = height - customHeaderHeight;
        //  - customHeaderHeight;
    });
});

// 订单
const orderList = ref<OrderItem[]>([]);
// 切换tab
const active = ref<number>(0);
interface TabItem {
    label: string;
    val: number;
    listKey: string;
    orderList: OrderItem[];
}
const tabList = ref<TabItem[]>([
    { label: "全部订单", val: 1, listKey: "allOrderListArray", orderList: [] },
    {
        label: "未兑换",
        val: 2,
        listKey: "unredeemedOrderListArray",
        orderList: [],
    },
    {
        label: "已兑换",
        val: 3,
        listKey: "exchangedOrderListArray",
        orderList: [],
    },
    {
        label: "已退订/过期",
        val: 4,
        listKey: "unsubscribeOrderListArray",
        orderList: [],
    },
]);
const changeTab = (tab) => {
    if (active.value === tab.val) return;
    active.value = tab.val;
    orderList.value = tab.orderList || [];
};
const loading = ref(false);
const getList = async () => {
    const { mobile } = getApp().globalData as GlobalDataType;
    try {
        loading.value = true;
        const res: any = await myOrder({ mobile: mobile });
        tabList.value.forEach((item) => {
            item.orderList = res.data[item.listKey] || [];
        });
        changeTab(tabList.value[0]);
    } catch (error) {
        //
    } finally {
        loading.value = false;
    }
};

// 权益兑换
const dialogEquity = ref(false);
const openEquity = (item) => {
    dialogEquity.value = true;
};
// 兑换成功
const dialogVisible = ref(false);
const openCash = () => {
    dialogEquity.value = false;
    dialogVisible.value = true;
};
const handleClose = () => {
    dialogVisible.value = false;
};

// 业务退订
const dialogUnreg = ref(false);
const openUnreg = (item) => {
    dialogUnreg.value = true;
};
const handleCloseUnreg = () => {
    dialogUnreg.value = false;
    dialogSuccess.value = true;
};
// 退订成功
const dialogSuccess = ref(false);
const closeSuccess = () => {
    dialogSuccess.value = false;
};
</script>

<style scoped lang="scss">
.tab_wrap {
    position: fixed;
    left: 0;
    right: 0;
    height: 130rpx;
    box-sizing: border-box;
}
.job_wrap {
    box-sizing: border-box;
    min-height: 100%;
    padding-top: 130rpx;
}
.no_wrap {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
