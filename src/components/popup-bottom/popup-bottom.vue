<!--
 * @Author: XHL
 * @Date: 2023-08-30
 * @Description: 底部抽屉组件
-->
<template>
  <!--  catchtouchmove="true" -->
  <view :class="{ show_bac: show }" class="popup_bac" @click.stop="close">
    <view
      :class="{ popup_show: showContent, gray_bac: isGray }"
      class="popup_box"
      @click.stop=""
    >
      <slot name="content" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

//	接受父组件传值
const props = defineProps({
  isBackClick: {
    type: Boolean,
    default: () => true,
  },
  isGray: {
    type: Boolean,
    default: false,
  },
});

const show = ref(false);
const showContent = ref(false);
let timer;
// 打开
const open = () => {
  if (timer) clearTimeout(timer);
  show.value = true;
  showContent.value = false;
  timer = setTimeout(() => {
    showContent.value = true;
  }, 20);
};

// 关闭
const close = () => {
  if (!props.isBackClick) return;
  forceClose();
};

const forceClose = () => {
  if (timer) clearTimeout(timer);
  showContent.value = false;
  timer = setTimeout(() => {
    show.value = false;
  }, 100);
};

// 暴露给父组件
defineExpose({ open, close, forceClose });
</script>

<style lang="scss" scoped>
.popup_bac {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba($color: #000000, $alpha: 0.5);
  display: none;
  .popup_box {
    width: 100%;
    background: #fff;
    border-radius: 32rpx 32rpx 0 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    position: absolute;
    bottom: -100%;
    transition: bottom 0.3s ease-out;
    overflow: hidden;
  }
  .gray_bac.popup_box {
    background: #f7f7f7;
  }
  .popup_show {
    bottom: 0;
  }
}
.show_bac {
  display: block;
}
</style>
