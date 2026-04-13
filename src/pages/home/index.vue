<!--
 * @Author: XHL
 * @Date: 2026-04-10
 * @Description: 首页
-->
<template>
  <general-custom ref="general_custom" :hide-back="true" title="首页">
    <template #content>
      <view class="hot_wrap flex justify-between">
        <view
          v-for="item in hotList"
          :key="item.id"
          class="hot_item flex flex-column align-center"
          @click="goProduct(item)"
        >
          <image :src="item.url" class="hot_img mb-12" />
          <view class="hot_name fs-26">{{ item.name }}</view>
        </view>
      </view>
      <view class="tab_wrap mx-30">
        <image src="/static/images/wnyx.png" class="tab_bac" />
        <view class="tab_sub_text pa fs-24">品质之选，温暖相伴</view>
        <view class="tab_list pa flex justify-center">
          <view
            v-for="item in tabList"
            :key="item.id"
            :class="{ tab_item_active: item.id === activeTab }"
            class="tab_item fs-32 px-20 pb-28"
            @click="handleClick(item)"
          >
            {{ item.name }}
          </view>
        </view>
      </view>
      <view class="gap" />
      <view class="goods_content">
        <!-- !loading &&  -->
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
          @lower="lowerList"
          @upper="upperList"
        />
      </view>
    </template>
  </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onReady, onShow, onShareAppMessage } from "@dcloudio/uni-app";
import { ref, reactive, computed, nextTick } from "vue";
import { getJobList } from "@/api/home";
import { getJobBannerList } from "@/utils";
import {
  getIsLogin,
  handleBurialPoint,
  goPage,
  getRmainHeight,
  getDomHeight,
  prefixedUrl,
  shortCity,
  getLatelyLoc,
  toFixedFun,
} from "@/utils/tool";
import qqmapsdk from "@/utils/qqmap";
const { customHeaderHeight } = getApp().globalData as GlobalDataType;

const hotList = [
  {
    id: 1,
    name: "影音娱乐",
    url: "/static/images/music.png",
    path: "",
    key: "4",
  },
  {
    id: 2,
    name: "生活服务",
    url: "/static/images/life.png",
    path: "",
    key: "1",
  },
  {
    id: 3,
    name: "餐饮美食",
    url: "/static/images/food.png",
    path: "",
    key: 2,
  },
  {
    id: 4,
    name: "车务出行",
    url: "/static/images/car.png",
    path: "",
    key: 3,
  },
];

const goProduct = (item) => {
  uni.reLaunch({ url: `/pages/product/index?id=${item.key}` });
};

onLoad((query: any) => {});

const goodsHeight = ref(0); // 商品列表高度
onReady(async () => {
  const height = await getRmainHeight(["hot_wrap", "tab_wrap", "gap"]);
  goodsHeight.value = height - customHeaderHeight;
});

// 商品列表
const show_goods = ref(true);
const goods_key = ref(0);
const scrollY = ref(true);
const goods_loading = ref(false);
onShow(async () => {
  goods_key.value = 0;
});

// 为您优选
const tabList = [
  { id: 1, name: "车务出行" },
  { id: 2, name: "餐饮美食" },
  { id: 3, name: "运动健康" },
  { id: 4, name: "影音娱乐" },
];
const activeTab = ref(1);
const handleClick = (item) => {
  activeTab.value = item.id;
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
onShareAppMessage(() => {
  const { uid } = getApp().globalData as GlobalDataType;
  let path = "/pages/home/index";
  if (uid) path += `?uid=${uid}&ut=1`;
  const shareObj = {
    title: "好友推荐给你一波好工作，快来看看吧~",
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
