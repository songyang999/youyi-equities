<!--
 * @Author: XHL
 * @Date: 2026-04-11
 * @Description: 订单详情
-->
<template>
  <general-custom ref="general_custom" title="我的订单">
    <template #content>
      <view class="px-30">
        <view class="order_item pr mt-50">
          <view class="card_head">
            <view>2017-06-24 开通服务</view>
          </view>
          <view class="card_main px-20 flex justify-between align-center">
            <image src="/static/images/order_img.png" class="order_img" />
            <view class="order_title flex1 mx-18 fs-28"
              >2元-水电燃气缴费红包</view
            >
            <view class="amount fs-28">￥2.00</view>
          </view>
        </view>
        <view class="info_card">
          <view class="info_title fs-28 mb-30"
            >订单信息<text class="ml-18 fs-24">2026-02-04</text></view
          >
          <view class="info_li">
            <view class="info_li_label">当前状态</view>
            <view class="info_li_value"><text class="copy">生效中</text></view>
          </view>
          <view class="info_li">
            <view class="info_li_label">开通时间</view>
            <view class="info_li_value">2026-02-04</view>
          </view>
          <view class="info_li">
            <view class="info_li_label">服务介绍</view>
            <view class="info_li_value"
              >权益服务到期当天自动续费xx元/月，如关闭服务，服务到期则不再发起续费。</view
            >
          </view>
          <view class="info_li">
            <view class="info_li_label">扣费方式</view>
            <view class="info_li_value">xxxx银行卡(8790)</view>
          </view>
        </view>
      </view>
      <view class="close_service" @click="openPopup">关闭包月服务</view>
    </template>
  </general-custom>
  <!-- 关闭包月服务 -->
  <popup-bottom ref="close_service" :is-gray="true">
    <template #content>
      <view class="popup_wrap">
        <view class="popup_content fs-34"
          >关闭后，商家服务到期时将不再自动扣费，确定关闭?</view
        >
        <view class="popup_confirm">
          <view class="popup_btn fs-36" @click="closePopup">确定关闭</view>
        </view>
        <view class="popup_cancel">
          <view class="popup_btn fs-36" @click="closePopup">取消</view>
        </view>
      </view>
    </template>
  </popup-bottom>
</template>

<script lang="ts" setup type="module">
import { onLoad, onShow, onReady, onUnload } from "@dcloudio/uni-app";
import { ref, reactive, computed, nextTick } from "vue";
import { toast } from "@/utils/tool";
import dayjs from "dayjs";
onLoad((query: any) => {});

onShow(() => {
  // console.log('job_id', job_id)
  // handleBurialPoint({action: 'position_page', job_id})
  // if (isPerfect.value) {
  //     perfect.value.updateInfo()
  // }
});
onReady(() => {});

// 页面卸载
onUnload(() => {});

// 关闭包月服务
const close_service = ref();
const openPopup = () => {
  close_service.value.open();
};
const closePopup = () => {
  close_service.value.close();
};
</script>

<style lang="scss" scoped>
.order_item,
.info_card {
  background: #fff;
  width: 100%;
  box-sizing: border-box;
  border-radius: 16rpx;
}
.order_item {
  margin-bottom: 30rpx;
  .card_head {
    padding: 24rpx 20rpx 27rpx;
    color: $--color-sub;
    font-size: 24rpx;
    .delete_icon {
      display: block;
      width: 40rpx;
      height: 40rpx;
    }
  }
  .card_main {
    padding-bottom: 34rpx;
    .order_img {
      display: block;
      width: 134rpx;
      height: 112rpx;
      flex-shrink: 0;
    }
    .order_title {
      color: $--color-main;
    }
    .amount {
      color: $--color-common;
      width: 150rpx;
    }
  }
}
.info_card {
  padding: 30rpx 20rpx;
  .info_title {
    color: $--color-main;
    font-weight: 500;
    text {
      color: $--color-sub;
      font-weight: 400;
    }
  }
  .info_li {
    display: flex;
    justify-content: space-between;
    // align-items: center;
    font-size: 28rpx;
    margin-bottom: 30rpx;
    &:last-child {
      margin-bottom: 0;
    }
    .info_li_label {
      color: $--color-main;
    }
    .info_li_value {
      color: $--color-sub;
      max-width: 504rpx;
      text-align: right;
      .copy {
        color: $--color-main;
      }
    }
  }
}
.close_service {
  color: #4386f7;
  font-size: 28rpx;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 30rpx;
  padding: 30rpx;
}
.popup_wrap {
  .popup_content,
  .popup_confirm,
  .popup_cancel {
    background: #fff;
  }
  .popup_content {
    padding: 42rpx 52rpx 20rpx;
    border-bottom: 1px solid #ededed;
    text-align: center;
    color: #737373;
  }
  .popup_confirm {
    width: 100%;
    height: 120rpx;
    text-align: center;
    line-height: 120rpx;
    margin-bottom: 20rpx;
  }
  .popup_cancel {
    width: 100%;
    height: 126rpx;
    text-align: center;
    line-height: 126rpx;
  }
  .popup_btn {
    color: $--color-main;
    font-weight: 500;
  }
}
</style>
