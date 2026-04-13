<!--
 * @Author: XHL
 * @Date: 2026-04-12
 * @Description: 权益兑换成功
-->
<template>
  <view class="deliver_bac" catchtouchmove="true" @click.stop="">
    <view class="deliver_wrap">
      <view class="close_btn" @click="close">
        <image src="/static/images/close.png" />
      </view>
      <image class="yes_icon" src="/static/images/success.png" />
      <view class="yes_title fs-40">权益兑换成功</view>
      <view class="yes_content mt-30 fs-28 px-28">
        <text
          >会员权益充值中，预计2分钟内到账......\n有问题可联系客服xooxxxxx</text
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"]);

// 直接咨询
const close = () => {
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
    height: 412rpx;
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
    .close_btn {
      position: absolute;
      top: -96rpx;
      right: 0;
      width: 50rpx;
      height: 50rpx;
      image {
        display: block;
        width: 100%;
        height: 100%;
      }
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
      line-height: 66rpx;
    }
  }
}
</style>
