<!--
 * @Author: XHL
 * @Date: 2023年9月16日
 * @Description: 用户协议/隐私指引
-->
<template>
    <view>
        <web-view :src="web_src"></web-view>
    </view>
</template>

<script setup lang="ts">
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { ref } from "vue";
const web_src = ref("");
onLoad(() => {
    const { signUrl } = getApp().globalData as GlobalDataType;
    web_src.value = decodeURIComponent(signUrl);
});
onUnload(() => {
    const globalData = getApp().globalData as GlobalDataType;
    globalData.signUrl = "";
});
</script>

<style scoped lang="scss"></style>
