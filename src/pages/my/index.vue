<!--
 * @Author: XHL
 * @Date: 2026-04-11
 * @Description: 个人中心
-->
<template>
  <general-custom ref="general_custom" :hide-back="true" title="个人中心">
    <template #content>
      <view class="user_info pr px-30 pt-20 mb-32">
        <!-- userInfo.avatar || avatar -->
        <image
          src="/static/images/avatar.png"
          mode="aspectFit"
          class="avatar mr-24"
          @click="openLogin"
        />
        <view class="flex flex-column">
          <text class="user_name fs-32 mb-6">七骑士十九</text>
          <view class="member_box flex align-center">
            <image src="/static/images/member.png" class="member_icon" />
            <text class="fs-28">黄金会员</text>
          </view>
        </view>
        <!-- <text v-if="userInfo.personnel_name" class="ml-16 fs-36">{{
          userInfo.personnel_name
        }}</text> -->
        <!-- <button
          v-else
          class="login_btn ml-16 fs-32"
          hover-class="none"
          @click="openLogin"
        >
          登录 / 注册
        </button> -->
        <view class="bell" @click="goPage('/pages/message/index')">
          <image
            src="/static/images/bell.png"
            mode="aspectFit"
            class="bell_icon"
          />
        </view>
      </view>
      <view class="hot_wrap flex mx-30 px-20 py-16">
        <view
          class="hot_item order_item flex1 flex flex-column justify-center align-center"
          @click="goPage('/pages/orderList/index')"
        >
          <image src="/static/images/order.png" class="hot_icon" />
          <text class="fs-28">我的订单</text>
        </view>
        <view
          class="hot_item info_item flex1 flex flex-column justify-center align-center ml-20"
          @click="goPage('/pages/userInfo/index')"
        >
          <image src="/static/images/info.png" class="hot_icon" />
          <text class="fs-28">个人信息</text>
        </view>
      </view>
      <view class="function_wrap mx-30 px-30 py-40">
        <view
          v-for="(item, index) in functionList"
          :key="index"
          class="function_item"
          @click="linkTo(item)"
        >
          <image :src="item.icon" class="fuc_icon mr-10" />
          <text class="fuc_name fs-28">{{ item.label }}</text>
          <text v-if="item.action === 'my_service'" class="fuc_phone fs-28"
            >400-9999-999</text
          >
          <image v-else src="/static/images/right.png" class="next" />
        </view>
      </view>
    </template>
  </general-custom>
</template>

<script setup lang="ts">
import { onReady, onShow, onHide } from "@dcloudio/uni-app";
import { ref, reactive, computed, nextTick } from "vue";
import { getPersonInfo, myWallet } from "@/api/my";
import {
  getIsLogin,
  handleBurialPoint,
  goPage,
  getRmainHeight,
} from "@/utils/tool";
const { config } = getApp()
  .globalData as GlobalDataType;

const pageHeight = ref(0);
const perfect = ref();
onReady(async () => {
  pageHeight.value = await getRmainHeight(["tab-bar-box"]);
});

onShow(async () => {
  // handleBurialPoint("my");
  getPerson();
  getMyWallet();
  if (isPerfect.value) {
    perfect.value.updateInfo();
  }
});

// 获取用户信息
const userInfo = reactive({
  avatar: "",
  personnel_name: "",
});
interface linkType {
  label?: string;
  num?: number | string;
  icon?: string;
  url: string;
  action: string;
}
// 是否已实名认证
const isCertVerify = ref(false);
const getPerson = async () => {
  const isLogin = getIsLogin();
  if (!isLogin) return;
  try {
    const res: any = await getPersonInfo();
    if (res.data) {
      const {
        avatar_url,
        personnel_name,
        phone,
        is_cert_verify,
      } = res.data;
      userInfo.avatar = avatar_url;
      userInfo.personnel_name =
        personnel_name || config.NICK_PR + phone.slice(-6);
      isCertVerify.value = is_cert_verify;
    }
  } catch (error) {
    //
  }
};

const auth_login = ref();
const openLogin = () => {
  //   if (userInfo.personnel_name) return;
  //   handleBurialPoint("my_login");
  //   auth_login.value.login.open();
  //   auth_login.value.isRead = false;
};
const updateInfo = (type) => {
  getPerson();
  if (type === 2) {
    // 是新用户
    isPerfect.value = true;
    nextTick(() => {
      perfect.value.resume.open();
      perfect.value.init();
    });
  }
};

// 获取钱包详情
const wallet = reactive({
  balance_format: "",
  balance_withdrawn_format: "",
  balance_summary_format: "",
});
const getMyWallet = async () => {
  const isLogin = getIsLogin();
  if (!isLogin) return;
  try {
    const res: any = await myWallet();
    if (res.data && res.data.wallet) {
      const data = res.data.wallet;
      wallet.balance_format = data.balance_format;
      wallet.balance_withdrawn_format = data.balance_withdrawn_format;
      wallet.balance_summary_format = data.balance_summary_format;
    }
  } catch (error) {
    //
  }
};
const functionList: linkType[] = [
  {
    label: "常见问题",
    icon: "/static/images/bulb.png",
    url: "/pages/problem/index",
    action: "my_qzjd",
  },
  // {
  //   label: "在线客服",
  //   icon: "/static/images/msg.png",
  //   url: "/pages/epic/index",
  //   action: "",
  // },
  {
    label: "客服热线",
    icon: "/static/images/phone.png",
    url: "",
    action: "my_service",
  },
];
const linkTo = (item: linkType) => {
  // if (!userInfo.personnel_name) {
  //   openLogin();
  //   return;
  // }
  if (item.url) goPage(item.url);
  else makePhoneCall(item.icon);
};

const makePhoneCall = (phone) => {
  uni.makePhoneCall({
    phoneNumber: config[phone],
    success() {},
    fail() {},
  });
};

/** 订阅消息调研 */
// const sendMessage = () => {
//     uni.requestSubscribeMessage({
//         tmplIds: ['I3mR2TBLKy3Wy5jdEmc8ULLhHtgGS7C8tcgUB0LRMX0'],
//         success: (res: any) => {
//             console.log('res==>', res)
//             if (res['I3mR2TBLKy3Wy5jdEmc8ULLhHtgGS7C8tcgUB0LRMX0'] === 'accept') {
//                 console.log('同意')
//             } else {
//                 console.log('拒绝')
//             }
//         },
//     })
// }

const isPerfect = ref(false);
const sub_scuccess = ref(false);
// 关闭完善简历
const closePerfect = (data) => {
  isPerfect.value = false;
  if (data) {
    sub_scuccess.value = true;
  }
};
const closeSuccess = () => {
  sub_scuccess.value = false;
};
// 页面卸载
onHide(() => {
  const globalData = getApp().globalData as GlobalDataType;
  globalData.isInit = true;
});
</script>

<style scoped lang="scss">
.user_info {
  display: flex;
  align-items: center;
  .avatar {
    width: 120rpx;
    height: 120rpx;
    font-size: 120rpx;
    border-radius: 50%;
  }
  .login_btn {
    border: none;
    color: $--color-main;
    padding: 0;
    &::after {
      border: 0px;
    }
  }
  .user_name {
    color: $--color-main;
    font-weight: 500;
  }
  .member_box {
    padding: 2rpx 16rpx;
    height: 46rpx;
    box-sizing: border-box;
    border-radius: 25rpx;
    overflow: hidden;
    background: linear-gradient(140.17deg, #38322a 0%, #735d49 100%);
    .member_icon {
      display: block;
      width: 34rpx;
      height: 34rpx;
      margin-right: 2rpx;
    }
    text {
      color: #f2dbbf;
    }
  }
  .bell {
    position: absolute;
    top: 34rpx;
    right: 30rpx;
    width: 48rpx;
    height: 48rpx;
    .bell_icon {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
.hot_wrap,
.function_wrap {
  background: #fff;
  border-radius: 10rpx;
}
.hot_wrap {
  margin-bottom: 34rpx;
  .hot_item {
    height: 194rpx;
    border-radius: 12rpx;
    .hot_icon {
      display: block;
      width: 72rpx;
      height: 72rpx;
      margin-bottom: 14rpx;
    }
    text {
      color: $--color-main;
    }
  }
  .order_item {
    background: #fff8ec;
  }
  .info_item {
    background: #f1f6ff;
  }
}
.function_wrap {
  .function_item {
    width: 100%;
    height: 44rpx;
    display: flex;
    align-items: center;
    color: $--color-main;
    padding-right: 36rpx;
    position: relative;
    box-sizing: border-box;
    margin-bottom: 36rpx;
    &:last-child {
      margin-bottom: 0;
    }
    .fuc_icon {
      display: block;
      width: 40rpx;
      height: 40rpx;
    }
    .fuc_phone,
    .next {
      position: absolute;
      right: 0;
    }
    .fuc_phone {
      color: #7e7e7e;
    }
    .next {
      display: block;
      width: 24rpx;
      height: 26rpx;
    }
  }
}
.page-title {
  max-width: 100%;
}
.section {
  position: relative;
  .section_bac {
    position: absolute;
    width: 100%;
    height: 341rpx;
    background-color: #fff;
    z-index: 0;
  }

  .space {
    height: 24rpx;
  }
}
</style>
