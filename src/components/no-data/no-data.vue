<template>
    <view class="node_data flex flex-column align-center fs-28">
        <image :src="imgSrc" :class="{ up_main_img: props.type === 2 }" class="main_img" mode="aspectFit" />
        <image v-if="barSrc" :src="barSrc" class="bar_img mb-40" />
        <view class="none_title fs-30">{{ props.text }}</view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { prefixedUrl } from '@/utils/tool'

//	接受父组件传值
const props = defineProps({
    type: {
        type: Number,
        default: 1,
    },
    text: {
        type: String,
        default: '暂无数据',
    },
    barSrc: {
        type: String,
        default: '',
    },
})

const { config } = getApp().globalData as GlobalDataType
// 图片 用computed包裹，防止切换页面重新加载
const names = {
    1: 'none_data.png',
    2: 'upload.png',
    3: 'none_money.png',
}
const name = names[props.type]
const imgSrc = computed(() => prefixedUrl(`${config.APP_TYPE}_${name}`))
const barSrc = props.barSrc ? computed(() => prefixedUrl(`${config.APP_TYPE}_${props.barSrc}`)) : ''
</script>

<style scoped lang="scss">
.node_data {
    width: 100%;
    text-align: center;
    .main_img {
        width: 420rpx;
        height: 252rpx;
        display: block;
        margin-bottom: 40rpx;
    }
    .up_main_img.main_img {
        width: 420rpx;
        height: 226rpx;
        margin-bottom: 0;
    }
    .none_title {
        color: $--color-main;
        font-weight: 600;
    }
    .bar_img {
        width: 400rpx;
        height: 16rpx;
        display: block;
    }
}
</style>
