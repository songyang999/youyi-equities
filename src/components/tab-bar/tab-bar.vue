<!--
 * @Author: XHL
 * @Date: 2023-09-12
 * @Description: 自定义tabBar
-->
<template>
  <view class="tab-bar-box flex">
    <view
      v-for="item in list.filter((val) => val.show)"
      :key="item.key"
      class="tab_bar_item flex1"
      @click="switchTab(item)"
    >
      <image
        :src="
          props.selected === item.key ? item.selectedIconPath : item.iconPath
        "
      />
      <view
        :style="{ color: props.selected === item.key ? selectedColor : color }"
        class="tab_text"
        >{{ item.text }}</view
      >
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { handleBurialPoint, prefixedUrl } from "@/utils/tool";

const { config } = getApp().globalData as GlobalDataType;
const selected_home = computed(() =>
  prefixedUrl(`${config.APP_TYPE}_selected_home.png`),
);
const selected_my = computed(() =>
  prefixedUrl(`${config.APP_TYPE}_selected_my.png`),
);

const props = defineProps({
  selected: {
    type: Number,
    default: 1,
  },
});
const color = "#9595BA";
const selectedColor = "#333C5A";
const list = ref([
  {
    pagePath: "/pages/home/index",
    iconPath: "/static/images/home.png",
    selectedIconPath: selected_home,
    text: "首页",
    key: 1,
    show: true,
  },
  {
    pagePath: "/pages/award/index",
    iconPath: "/static/images/activity.png",
    selectedIconPath: "/static/images/selected_activity.png",
    text: "奖励",
    key: 3,
    show: true,
  },
  {
    pagePath: "/pages/my/index",
    iconPath: "/static/images/my.png",
    selectedIconPath: selected_my,
    text: "我的",
    key: 2,
    show: true,
  },
]);

const switchTab = (e) => {
  if (props.selected === e.key) return;
  if (e.key === 2) handleBurialPoint("index_my");
  const url = e.pagePath;
  uni.switchTab({ url });
};
</script>
<style lang="scss" scoped>
.tab_bar_item {
  width: 100%;
  height: 100%;
  position: relative;
  // text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  image {
    display: inline-block;
    width: 22px;
    height: 22px;
  }
  .tab_text {
    font-size: 10px;
    line-height: 14px;
  }
}
</style>
