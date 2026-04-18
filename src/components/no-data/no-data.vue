<template>
    <view class="node_data flex flex-column align-center fs-28">
        <image src="@/static/images/no_data.png" class="main_img" mode="aspectFit" />
        <view class="none_title fs-32">{{ props.text }}</view>
    </view>
</template>

<script setup lang="ts">
//	接受父组件传值
const props = defineProps({
    text: {
        type: String,
        default: '暂无数据',
    },
})
</script>

<style scoped lang="scss">
.node_data {
    width: 100%;
    text-align: center;
    padding-top: 86rpx;
    .main_img {
        width: 476rpx;
        height: 278rpx;
        display: block;
        margin-bottom: 130rpx;
    }
    .none_title {
        color: $--color-sub;
    }
}
</style>
