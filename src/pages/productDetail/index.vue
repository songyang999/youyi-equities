<!--
 * @Author: XHL
 * @Date: 2026-04-11
 * @Description: 产品详情
-->
<template>
  <general-custom ref="general_custom" title="产品详情">
    <template #content>
      <view class="head_wrap mb-16">
        <view class="product_img">
          <image src="/static/images/product_bac.png" mode="widthFix" />
        </view>
        <view class="product_info">
          <view class="product_name fs-36 mb-30">阳光出行5元优惠券</view>
          <view class="flex justify-between align-center">
            <view class="salary fs-36"><text class="fs-26">¥</text>100</view>
            <view class="fs-28 count"
              >已售 <text class="fs-26">344</text>
            </view>
          </view>
        </view>
      </view>
      <view class="product_introduce">
        <view class="product_title flex justify-center align-center">
          <image class="star" src="/static/images/star_left.png" />
          <view class="fs-40 mx-2">阳光出行5元优惠券</view>
          <image class="star" src="/static/images/star_right.png" />
        </view>
        <view>
          <view class="introduce_title fs-34">产品介绍</view>
          <view class="introduce_content fs-26">
            <text
              >11天2G大湾区港澳流量包，7.99元;\n3天6G大湾区港澳流量包，16.99元;注:1.仅限中国移动(上海)用户(暂不支持副卡订购使用，\n11天2G大湾区港澳流量包，7.99元;\n23天6G大湾区港澳流量包，16.99元;注:1.仅限中国移动(上海)用户(暂不支持副卡订购使用，</text
            >
          </view>
        </view>
      </view>
      <view class="footer" />
      <view class="footer-box">
        <view class="flex align-center justify-between py-12 px-30">
          <view
            class="home_btn flex flex-column align-center justify-center px-12 mx-20"
            @click="goHome"
          >
            <image src="/static/images/to_home.png" class="home_icon mb-8" />
            <text class="fs-20">首页</text>
          </view>
          <view class="btn_box flex">
            <button
              type="primary"
              class="flex1"
              hover-class="none"
              @click="goPage('/pages/signOrder/index')"
            >
              单次订购
            </button>
            <button
              type="primary"
              class="flex1"
              hover-class="none"
              @click="goPage('/pages/signOrder/index')"
            >
              包月订购
            </button>
          </view>
        </view>
      </view>
    </template>
  </general-custom>
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
import { goPage } from "@/utils/tool";
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

// 返回首页
const goHome = () => {
  uni.reLaunch({
    url: "/pages/home/index",
  });
};
</script>

<style lang="scss" scoped>
.head_wrap {
  width: 100%;
  background: #fff;
  .product_img {
    width: 100%;
    height: 630rpx;
    overflow: hidden;
    image {
      display: block;
      width: 100%;
    }
  }
  .product_info {
    width: 100%;
    padding: 60rpx 30rpx 36rpx;
    box-sizing: border-box;
    .product_name {
      font-weight: 500;
      color: $--color-main;
    }
    .salary {
      color: $--color-danger;
    }
    .count {
      color: $--color-sub;
    }
  }
}
.product_introduce {
  background: #fff;
  width: 100%;
  padding: 62rpx;
  box-sizing: border-box;
  .product_title {
    height: 68rpx;
    font-weight: 500;
    color: $--color-primary;
    margin-bottom: 54rpx;
    .star {
      display: block;
      width: 54rpx;
      height: 54rpx;
    }
  }
  .introduce_title {
    color: $--color-main;
    font-weight: 500;
    line-height: 50rpx;
  }
  .introduce_content {
    color: $--color-sub;
    line-height: 38rpx;
  }
}
.footer {
  width: 100%;
  height: 100rpx;
  height: calc(100rpx + constant(safe-area-inset-bottom));
  height: calc(100rpx + env(safe-area-inset-bottom));
}
.home_btn {
  height: 76rpx;
  color: $--color-common;
  .home_icon {
    display: block;
    width: 44rpx;
    height: 44rpx;
  }
}
.btn_box {
  width: 520rpx;
  height: 76rpx;
  border-radius: 38rpx;
  overflow: hidden;
  button + button {
    margin-left: 0;
  }
  button {
    border-radius: 0;
    border-color: transparent;
    &:first-child {
      background-color: $--color-blue;
    }
  }
}
</style>
