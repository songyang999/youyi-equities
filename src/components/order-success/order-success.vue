<!--
 * @Author: XHL
 * @Date: 2026-04-12
 * @Description: 订购成功
-->
<template>
  <view class="deliver_bac" catchtouchmove="true" @click.stop="">
    <view class="deliver_wrap">
      <image class="yes_icon" src="/static/images/success.png" />
      <view class="yes_title fs-40">订购成功</view>
      <view class="yes_content mt-30 fs-28 px-28">
        <text
          >您已成功提交“资费xx元/月的视频会员权益产品”\n的产品订单，请点击下方按钮\n或去小程序“xxx”“我的订单”中查看订单状态\n后完成权益领取</text
        >
      </view>
      <view class="mt-30 px-40 flex">
        <button
          type="primary"
          hover-class="none"
          class="flex1"
          @click="consult"
        >
          领取权益
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"]);

// 直接咨询
const consult = () => {
  emit("close");
  //   uni.openCustomerServiceChat({
  //     extInfo: { url: "https://work.weixin.qq.com/kfid/kfc70bc77c2769842eb" },
  //     corpId: "wx25d1a90f42649304",
  //   });
};
</script>

<style lang="scss" scoped>
// 投递成功
.deliver_bac {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  .deliver_wrap {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 686rpx;
    height: 465rpx;
    border-radius: 16rpx;
    background-color: #fff;
    .yes_icon {
      position: absolute;
      left: 50%;
      top: -40rpx;
      transform: translateX(-50%);
      display: block;
      width: 104rpx;
      height: 104rpx;
    }
    .yes_title {
      width: 100%;
      text-align: center;
      color: $--color-main;
      margin-top: 90rpx;
    }
    .yes_content {
      color: #777777;
      text-align: center;
    }
  }
}
</style>
