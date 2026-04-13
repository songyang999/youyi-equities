<!--
 * @Author: XHL
 * @Date: 2024-03-05
 * @Description: 全局tab切换
-->
<template>
  <view class="tab_list fs-28">
    <view
      v-for="tab in props.tabNav.filter((it) => !it.hide)"
      :id="`tab_${tab[value]}`"
      :key="tab[value]"
      :class="{ act_tab: props.active === tab[value] }"
      class="tab"
      @click="changeTab(tab)"
      >{{ tab[label] }}
      <image
        v-if="props.active === tab[value]"
        src="/static/images/order_active.png"
        class="tab_icon"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
interface tabType {
    hide?: boolean
}
const props = defineProps({
    tabNav: {
        type: Array<tabType>,
        required: true
    },
    value: {
        type: String,
        default: () => 'val'
    },
    label: {
        type: String,
        default: () => 'label'
    },
    active: {
        type: Number,
        default: () => 0
    },
    scrollIntoView: {
        type: String,
        default: () => ''
    }
})

const emit = defineEmits(['change'])
const changeTab = (tab) => {
    emit('change', tab)
}
</script>

<style lang="scss" scoped>
.tab_list {
  width: 100%;
  height: 100%;
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
  .tab {
    // float: left;
    display: inline-block;
    // margin-right: 68rpx;
    color: $--color-main;
    height: 40rpx;
    line-height: 40rpx;
    position: relative;
    &:last-child {
      margin-right: 0;
    }
    .tab_icon {
      display: none;
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      height: 18rpx;
    }
  }
  .act_tab {
    font-size: 36rpx;
    // font-weight: 500;
    .tab_icon {
      display: block;
    }
  }
}
</style>
