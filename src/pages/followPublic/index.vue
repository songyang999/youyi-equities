<!--
 * @Author: XHL
 * @Date: 2024-01-12
 * @Description: 关注我们
-->
<template>
    <view class="tab_page">
        <view class="activity_wrap">
            <image :src="code_src" show-menu-by-longpress mode="widthFix" class="preview_url" />
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { prefixedUrl } from '@/utils/tool'

const code_src = computed(() => prefixedUrl('code.jpeg'))
</script>

<style scoped lang="scss">
.tab_page {
    // position: absolute;
    // left: 0;
    // top: 0;
    // right: 0;
    // bottom: 0;
    overflow-y: scroll;
}
.activity_wrap {
    width: 100%;
    background-color: #fff;
    .preview_url {
        display: block;
        width: 100%;
        // height: 1624rpx;
    }
}
</style>
