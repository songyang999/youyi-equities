<!--
 * @Author: XHL
 * @Date: 2026-04-27
 * @Description: 包月服务
-->
<template>
  <general-custom ref="general_custom" title="包月服务">
    <template #content>
      <view class="px-30">
        <view class="order_item pr mt-50">
          <view class="card_head flex justify-between align-center">
            <view>2017-06-24</view>
            <view class="flex align-center">
              未兑换<text class="ml-15 mr-10">|</text
              ><image
                src="/static/images/delete_icon.png"
                class="delete_icon"
              />
            </view>
          </view>
          <view class="card_main py-30 px-20 flex justify-between">
            <image src="/static/images/order_img.png" class="order_img" />
            <view class="order_title flex1 mx-18 fs-28"
              >2元-水电燃气缴费红包</view
            >
            <view class="flex flex-column align-end justify-between">
              <view class="amount fs-28">￥2.00</view>
              <view class="count fs-24">X1</view>
            </view>
          </view>
          <view class="card_footer">
            <view class="flex align-end justify-end fs-24">
              <view>共1件</view>
              <view class="ml-20"
                >付款总额￥<text class="salary">5.00</text></view
              >
            </view>
          </view>
        </view>
        <view class="info_card">
          <view class="info_title fs-28 mb-30"
            >订单信息<text class="ml-18 fs-24">2026-02-04</text></view
          >
          <view class="info_li">
            <view class="info_li_label">订单编号</view>
            <view class="info_li_value" @click="handleCopy"
              >5053260638158690427<text class="mx-8">|</text
              ><text class="copy">复制</text></view
            >
          </view>
          <view class="info_li">
            <view class="info_li_label">成交时间</view>
            <view class="info_li_value">2026-02-04 15:47:49</view>
          </view>
          <view class="info_li">
            <view class="info_li_label">付款时间</view>
            <view class="info_li_value">2026-02-04 15:47:49</view>
          </view>
          <view class="info_li">
            <view class="info_li_label">兑换时间</view>
            <view class="info_li_value">2026-02-04 15:47:49</view>
          </view>
          <view class="info_li">
            <view class="info_li_label">订购方式</view>
            <view class="info_li_value">微信</view>
          </view>
          <view class="info_li">
            <view class="info_li_label">支付宝交易号</view>
            <view class="info_li_value">2026020423001133331416237504</view>
          </view>
          <view class="info_li">
            <view class="info_li_label">支付方式</view>
            <view class="info_li_value">微信支付</view>
          </view>
        </view>
      </view>
      <view class="footer" />
      <view class="footer-box">
        <view class="btn_box flex align-center py-14">
          <button type="primary" hover-class="none" @click="openEquity">
            权益兑换
          </button>
          <button type="primary" hover-class="none" @click="openUnreg">
            业务退订
          </button>
        </view>
      </view>
    </template>
  </general-custom>
  <!-- 权益兑换 -->
  <equity-cash v-if="dialogEquity" @close="openCash" />
  <!-- 权益兑换成功 -->
  <cash-success v-if="dialogVisible" @close="handleClose" />
  <!-- 业务退订 -->
  <business-unreg v-if="dialogUnreg" @close="handleCloseUnreg" />
  <!-- 退订成功 -->
  <unreg-success v-if="dialogSuccess" @close="closeSuccess" />
</template>

<script lang="ts" setup type="module">
import {
  onLoad,
  onShow,
  onReady,
  onUnload,
  onShareAppMessage,
} from "@dcloudio/uni-app";
import { ref, reactive, computed, nextTick } from "vue";
import { toast } from "@/utils/tool";
import dayjs from "dayjs";
onLoad((query: any) => {
  // isLogin.value = getIsLogin()
  // if (query.scene) {
  //     const scene: any = getSceneFormat(query.scene)
  //     // console.log('scene==>', scene)
  //     if (scene.jid) {
  //         job_id = +scene.jid
  //         sharer_id = +scene.uid
  //         ut = +scene.ut
  //     } else {
  //         job_id = base36ToDecimal(scene.j)
  //         sharer_id = base36ToDecimal(scene.u)
  //         ut = +scene.t
  //         lease_id = +scene.l
  //     }
  // } else {
  //     if (+query.job_id || +query.jid) {
  //         job_id = +query.job_id || +query.jid
  //         sharer_id = +query.uid || 0
  //         ut = +query.ut || 1
  //         lease_id = +query.lease_id || 0
  //     } else {
  //         job_id = base36ToDecimal(query.j)
  //         sharer_id = base36ToDecimal(query.u)
  //         ut = +query.t
  //         lease_id = +query.l
  //     }
  // }
  // const page = getCurrentPages()
  // isBack.value = page.length > 1
  // if (job_id && sharer_id) {
  //     const globalData = getApp().globalData as GlobalDataType
  //     globalData.shareData = {job_id, sharer_id, ut, lease_id}
  // }
  // // 自动申请
  // if (query.apply) apply = true
});

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

// 复制
const handleCopy = () => {
  uni.setClipboardData({
    data: "5053260638158690427",
    success(res) {
      toast("复制成功");
    },
  });
};

// 权益兑换
const dialogEquity = ref(false);
const openEquity = () => {
  dialogEquity.value = true;
};
// 兑换成功
const dialogVisible = ref(false);
const openCash = () => {
  dialogEquity.value = false;
  dialogVisible.value = true;
};
const handleClose = () => {
  dialogVisible.value = false;
};

// 业务退订
const dialogUnreg = ref(false);
const openUnreg = () => {
  dialogUnreg.value = true;
};
const handleCloseUnreg = () => {
  dialogUnreg.value = false;
  dialogSuccess.value = true;
};
// 退订成功
const dialogSuccess = ref(false);
const closeSuccess = () => {
  dialogSuccess.value = false;
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
    padding: 24rpx 14rpx 24rpx 20rpx;
    border-bottom: 1px solid #ededed;
    color: $--color-sub;
    font-size: 24rpx;
    .delete_icon {
      display: block;
      width: 40rpx;
      height: 40rpx;
    }
  }
  .card_main {
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
    }
    .count {
      color: $--color-sub;
    }
  }
  .card_footer {
    border-top: 1px solid #ededed;
    padding: 20rpx 20rpx 28rpx;
    color: $--color-main;
    .salary {
      color: $--color-danger;
      font-size: 32rpx;
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
    align-items: center;
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
      max-width: 450rpx;
      .copy {
        color: $--color-main;
      }
    }
  }
}
.footer {
  width: 100%;
  height: 98rpx;
  height: calc(98rpx + constant(safe-area-inset-bottom));
  height: calc(98rpx + env(safe-area-inset-bottom));
}
.btn_box {
  width: 100%;
  height: 100%rpx;
  justify-content: around;
  button + button {
    margin-left: 0;
  }
  button {
    width: 300rpx;
    border-color: transparent;
    &:last-child {
      background-color: #eaeefd;
      color: $--color-primary;
    }
  }
}
</style>
