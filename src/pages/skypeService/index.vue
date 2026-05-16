<!--
 * @Author: XHL
 * @Date: 2026-04-27
 * @Description: 包月服务
-->
<template>
  <general-custom ref="general_custom" title="包月服务">
    <template #content>
      <image src="/static/images/success_icon.png" class="success_icon"></image>
      <view class="tips fs-28"
        ><text
          >您已开通如下包月产品服务，\n我们将按约定的规则自动续费。</text
        ></view
      >
      <view class="mx-30">
        <view
          v-for="item in list"
          :key="item.orderId"
          class="service_li mb-30"
          @click="goPage(`/pages/serviceDetail/index?orderId=${item.orderId}`)"
        >
          <view class="sub_text fs-24">{{item.conversionTime}} 开通服务</view>
          <view class="service_info fs-28 flex align-center justify-between">
            <image
              src="/static/images/service_ico.png"
              class="service_ico"
            ></image>
            <view class="name main_text">{{ item.price }}元-{{ item.productName }}</view>
            <view class="common_text">￥{{separatorFilter(item.price, 2)}}</view>
            <image src="/static/images/right.png" class="next"></image>
          </view>
        </view>
      </view>
    </template>
  </general-custom>
</template>

<script lang="ts" setup type="module">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { goPage, separatorFilter } from "@/utils/tool";
import { getMonthlySubscriptionService } from '@/api/my';

onLoad(() => {
    getServiceList()
})

const list = ref<ServiceItem[]>([]);
const getServiceList = async () => {
    try {
        uni.showLoading({
            mask: true,
            title: "加载中...",
        });
        const { mobile } = getApp().globalData as GlobalDataType;
        const res: any = await getMonthlySubscriptionService({ mobile: mobile });
        list.value = res.data || [];
    } catch (error) {
        //
    } finally {
        uni.hideLoading();
    }
}
</script>

<style lang="scss" scoped>
.success_icon {
  display: block;
  width: 189rpx;
  height: 166rpx;
  margin-left: 293rpx;
  margin-top: 12rpx;
  margin-bottom: 30rpx;
}
.tips {
  color: $--color-main;
  text-align: center;
  margin-bottom: 56rpx;
}
.service_li {
  padding: 24rpx 20rpx 34rpx 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
}
.main_text {
  color: $--color-main;
}
.common_text {
  color: $--color-common;
}
.sub_text {
  color: $--color-sub;
}
.service_info {
  margin-top: 28rpx;
  .service_ico {
    display: block;
    width: 134rpx;
    height: 112rpx;
  }
  .name {
    width: 330rpx;
  }
  .next {
    display: block;
    width: 24rpx;
    height: 26rpx;
  }
}
</style>
