<!--
 * @Author: XHL
 * @Date: 2023-07-24
 * @use: <svg-icon iconClass="home"></svg-icon>
-->
<template>
    <view>
        <image class="svg-icon" :src="iconName" mode="aspectFit" />
    </view>
</template>

<script setup lang="ts">
import { defineComponent, computed } from 'vue'
import { prefixedUrl } from '@/utils/tool'
defineComponent({
    name: 'SvgIcon',
})
interface SvgIconProps {
    iconClass: string
}
const props = defineProps<SvgIconProps>()
const iconName = computed(() => prefixedUrl(`${props.iconClass}.png`))
</script>
<style scoped>
view {
    width: 1em;
    height: 1em;
    line-height: 1em;
}
.svg-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
}
</style>
