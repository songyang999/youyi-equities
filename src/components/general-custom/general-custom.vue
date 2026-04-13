<!--
 * @Author: XHL
 * @Date: 2023-08-21
 * @Description: 二级页自定义导航
-->
<template>
  <view
    :style="{
      paddingTop: customHeaderHeight + 'px',
    }"
    class="page"
  >
    <image src="/static/images/header_bac.png" class="general-custom-bac" />
    <view
      :style="{ height: customHeaderHeight + 'px' }"
      class="custom-head-bac"
    >
      <image src="/static/images/header_bac.png" class="custom-bac" />
    </view>
    <!-- 自定义导航栏 -->
    <view
      :style="{
        paddingTop: statusBarHeight + 'px',
      }"
      class="general-custom"
    >
      <view :style="{ height: navigationBar + 'px' }" class="custom-head">
        <view
          v-if="hideBack"
          :style="{ width: navigationBar + 'px' }"
          class="custom-left"
        />
        <view
          v-else
          :style="{ width: navigationBar + 'px' }"
          class="custom-left"
          @click="navBack"
        >
          <image v-if="isBack" src="/static/images/back.png" />
          <image v-else src="/static/images/house.png" />
        </view>
        <view class="page-title line_ovh">{{ props.title }}</view>
        <view :style="{ width: navigationBar + 'px' }" class="custom-right" />
      </view>
    </view>
    <view class="pr">
      <slot name="content" />
    </view>
    <general-loading v-if="loading" :hide-bac="hide_bac" />
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref, computed } from "vue";
import { prefixedUrl } from "@/utils/tool";

//	接受父组件传值
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  isCallBack: {
    type: Boolean,
    default: false,
  },
  hideBack: {
    type: Boolean,
    default: false,
  },
});

const isBack = ref<boolean>(true);
onLoad(() => {
  const page = getCurrentPages();
  isBack.value = page.length > 1;
});

const { statusBarHeight, navigationBar, customHeaderHeight, hideCustom } =
  getApp().globalData as GlobalDataType;

const emit = defineEmits(["back"]);
const navBack = () => {
  if (props.isCallBack) {
    emit("back");
  } else if (isBack.value) {
    uni.navigateBack();
  } else uni.switchTab({ url: "/pages/home/index" });
};

const loading = ref(false);
const hide_bac = ref(true);
const showLoading = (type = false) => {
  loading.value = true;
  hide_bac.value = type;
};

const hideLoading = () => {
  loading.value = false;
};

defineExpose({ showLoading, hideLoading });
</script>

<style scoped lang="scss"></style>
