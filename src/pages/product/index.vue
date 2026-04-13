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
          <!-- <svg-icon icon-class="search" class="fs-24" /> -->
          <input
            v-model="keyword"
            confirm-type="search"
            placeholder="搜索"
            placeholder-style="font-size: 28rpx; color: #999999;"
            class="search_input fs-28"
            @blur="searchList"
            @confirm="searchList"
          />
          <image
            class="search_icon"
            src="/static/images/search.png"
            mode="aspectFit"
          />
        </view>
      </view>
      <view class="flex">
        <view :style="{ height: goodsHeight + 'px' }" class="left_wrap pt-4">
          <view class="left_list pt-28">
            <view
              v-for="item in navList"
              :key="item.id"
              :class="{ active_nav_item: item.id == activeTab }"
              class="nav_item fs-28"
              @click="handleClick(item)"
              >{{ item.name }}</view
            >
          </view>
        </view>
        <div class="flex1">
          <goods-list
            v-if="show_goods"
            :goods-key="goods_key"
            :list="goods_list"
            :height="goodsHeight"
            :loading="goods_loading"
            :scroll-y="scrollY"
            :options="{
              enhanced: true,
              bounces: false,
              throttle: false,
            }"
            :is-min="true"
            @lower="lowerList"
            @upper="upperList"
          />
        </div>
      </view>
    </template>
  </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onShow, onReady, onShareAppMessage } from "@dcloudio/uni-app";
import { ref, computed, nextTick } from "vue";
import { jobCityList, myRewardSummary } from "@/api/award";
import { getJobList } from "@/api/home";
import {
  getIsLogin,
  handleBurialPoint,
  goPage,
  prefixedUrl,
  getDomHeight,
  getRmainHeight,
  getItem,
  toFixedFun,
} from "@/utils/tool";
const { config, customHeaderHeight } = getApp().globalData as GlobalDataType;

const keyword = ref("");

const goodsHeight = ref(0); // 商品列表高度
onReady(async () => {
  const height = await getRmainHeight(["search_wrap"]);
  goodsHeight.value = height - customHeaderHeight;
});

onLoad((query: any) => {
  if (query.id) {
    activeTab.value = +query.id;
  }
});
// 左侧分类
const navList = [
  { id: 1, name: "生活服务" },
  { id: 2, name: "餐饮美食" },
  { id: 3, name: "车务出行" },
  { id: 4, name: "影音娱乐" },
  { id: 5, name: "运动健康" },
  { id: 6, name: "知识办公" },
  { id: 7, name: "商超购物" },
];
const activeTab = ref(1);
const handleClick = (item) => {
  activeTab.value = item.id;
};

// 商品列表
const show_goods = ref(true);
const goods_key = ref(0);
const scrollY = ref(true);
const goods_loading = ref(false);
onShow(async () => {
  goods_key.value = 0;
});

// 搜索
const searchList = () => {
  //
};
// 商品列表
const goods_list = ref([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
const params = {
  page: 1,
  page_num: 10,
  max_page: 0,
};

// 上拉加载
const lowerList = () => {
  if (params.page < params.max_page) {
    params.page += 1;
    // getList();
  }
};
const upperList = () => {
  //   scrollY.value = false;
  //   nextTick(() => {
  //     scrollHeight.value = scroll_height - 2;
  //   });
  // console.log('到顶了', scrollY.value)
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
