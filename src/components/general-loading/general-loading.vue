<!--
 * @Author: XHL
 * @Date: 2023-09-04
 * @Description: 全局loading
-->
<template>
    <view :clas="props.hideBac ? '' : 'bac_white'" class="loading_wrap" @click.stop="">
        <svg-icon :icon-class="`${config.APP_TYPE}_loading`" class="loading fs-46" />
    </view>
</template>

<script setup lang="ts">
const { config } = getApp().globalData as GlobalDataType
const props = defineProps({
    hideBac: {
        type: Boolean,
        default: false,
    },
})
</script>

<style scoped lang="scss">
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.loading_wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2000;
    .loading {
        position: absolute;
        top: 40%;
        left: calc(50% - 23rpx);
        animation: rotate 1s linear infinite;
    }
}
.bac_white {
    background-color: rgba($color: #fff, $alpha: 1);
}
</style>
