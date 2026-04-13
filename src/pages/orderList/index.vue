<!--
 * @Author: XHL
 * @Date: 2026-04-11
 * @Description: 我的订单
-->
<template>
  <general-custom title="我的订单">
    <template #content>
      <view
        :style="{ top: customHeaderHeight + 'px' }"
        class="tab_wrap pt-40 pb-50 px-40"
      >
        <tabs :tab-nav="tab_list" :active="active" @change="changeTab" />
      </view>
      <view v-if="order_list.length" class="job_wrap">
        <order-list
          :list="order_list"
          :height="scrollHeight"
          :loading="loading"
          type="progress"
          @lower="lowerList"
          @cash="openEquity"
          @unreg="openUnreg"
        />
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
</template>

<script setup lang="ts">
import { onLoad, onReady, onShow } from "@dcloudio/uni-app";
import { defineComponent, ref } from "vue";
import { jobOperateList } from "@/api/my";
import { getRmainHeight } from "@/utils/tool";

defineComponent({
  name: "JobProgress",
});

const { customHeaderHeight } = getApp().globalData as GlobalDataType;

const active = ref<number>(0);
onLoad((query) => {
  if (query.active) {
    active.value = +query.active;
  }
});

const scrollHeight = ref(0);
onReady(async () => {
  const height = await getRmainHeight(["tab_wrap"]);
  scrollHeight.value = height - customHeaderHeight;
});

onShow(() => {
  //   initList();
});

// 切换tab
const tab_list = [
  { label: "全部订单", val: 0 },
  { label: "未兑换", val: 1 },
  { label: "已兑换", val: 2 },
  { label: "已退订/过期", val: 3 },
];
const changeTab = (tab) => {
  if (active.value === tab.val) return;
  active.value = tab.val;
  //   initList();
};

// 求职进度
const order_list = ref([{ id: 1 }, { id: 2 }, { id: 3 }]);
const params = {
  page: 1,
  page_num: 10,
  max_page: 0,
};
const loading = ref(false);
const getList = async () => {
  try {
    loading.value = true;
    const res: any = await jobOperateList({
      action: 3,
      apply_status: active.value,
      ...params,
    });
    if (res.data) {
      params.max_page = res.data.max_page;
      const list = (res.data.list || []).map((item) =>
        Object.assign({}, item, item.job_info),
      );
      order_list.value =
        params.page === 1 ? list : order_list.value.concat(list);
    }
  } catch (error) {
    //
  } finally {
    loading.value = false;
  }
};

// 初始化list
const initList = () => {
  params.page = 1;
  getList();
};
// 上拉加载
const lowerList = () => {
  //   if (params.page < params.max_page) {
  //     params.page += 1;
  //     getList();
  //   }
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
};
</script>

<style scoped lang="scss">
.tab_wrap {
  position: fixed;
  left: 0;
  right: 0;
  height: 40rpx;
}
.job_wrap {
  box-sizing: border-box;
  min-height: 100%;
  padding-top: 132rpx;
}
.no_wrap {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
