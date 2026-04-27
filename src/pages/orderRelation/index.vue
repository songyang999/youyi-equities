<!--
 * @Author: XHL
 * @Date: 2026-04-27
 * @Description: 订单关联
-->
<template>
  <general-custom ref="general_custom" title="订单关联">
    <template #content>
      <view class="form-box">
        <uni-forms
          ref="ruleForm"
          :model-value="formData"
          :rules="rules"
          validate-trigger="blur"
          label-width="90"
        >
          <view class="input-box mb-30">
            <uni-forms-item name="phone" :rules="rules['phone']['rules']">
              <template #label>
                <view class="uni-forms-item__label">
                  <text class="is-required">*</text>
                  <text>手机号码</text>
                </view>
              </template>
              <view class="">
                <input
                  v-model="formData.phone"
                  :maxlength="100"
                  placeholder="请输入手机号码"
                  :placeholder-style="`font-size: 13px;color:#999999;`"
                  class="input fs-28"
                  type="text"
                />
              </view>
            </uni-forms-item>
          </view>
          <view class="select-box mb-30">
            <uni-forms-item name="ver_code" :rules="rules['ver_code']['rules']">
              <template #label>
                <view class="uni-forms-item__label">
                  <text class="is-required">*</text>
                  <text>验证码</text>
                </view>
              </template>
              <view class="input-box flex justify-between align-center">
                <input
                  v-model="formData.ver_code"
                  :maxlength="100"
                  placeholder="请输入验证码"
                  :placeholder-style="`font-size: 13px;color:#999999;`"
                  class="input fs-28"
                  type="text"
                />
                <button
                  :disabled="mix_timer < 1 ? false : true"
                  type="primary"
                  hover-class="none"
                  class="send_btn"
                  @click="getCode"
                >
                  {{ mix_codeText }}
                </button>
              </view>
            </uni-forms-item>
          </view>
          <button
            type="primary"
            hover-class="none"
            class="mb-30"
            @click="handleSubmit"
          >
            确认关联
          </button>
        </uni-forms>
        <view class="explain_wp">
          <view class="explain_title flex align-center justify-center mb-40">
            <image
              src="/static/images/explain_left.png"
              mode="aspectFit"
              class="mr-6"
            />
            <view class="fs-28 common_text">订单关联说明</view>
            <image
              src="/static/images/explain_right.png"
              mode="aspectFit"
              class="ml-6"
            />
          </view>
          <view class="explain_li flex justify-between">
            <view class="count mr-12">1</view>
            <view class="sub_text fs-28 flex1"
              >请输入订购产品时提供的手机号码</view
            >
          </view>
          <view class="explain_li flex justify-between">
            <view class="count mr-12">2</view>
            <view class="sub_text fs-28 flex1"
              >需要接收回填验证码，以验明身份</view
            >
          </view>
          <view class="explain_li flex justify-between">
            <view class="count mr-12">3</view>
            <view class="sub_text fs-28 flex1"
              >订单关联，即时生效，一个账户最多只能关联两个手机号下的订单</view
            >
          </view>
        </view>
      </view>
    </template>
  </general-custom>
  <!-- 订购成功 -->
  <relation-success v-if="dialogVisible" @close="closeSuccess" />
</template>

<script lang="ts" setup type="module">
import { onUnload } from "@dcloudio/uni-app";
import { ref } from "vue";
import { toast } from "@/utils/tool";
import test from "@/utils/test";
const ruleForm = ref();
const formData = ref({
  phone: "",
  ver_code: "",
});

const rules = {
  phone: {
    rules: [
      { required: true, errorMessage: "请输入手机号码" },
      { validateFunction: test.checkMobile },
    ],
  },
  ver_code: {
    rules: [{ required: true, errorMessage: "请输入验证码" }],
  },
};

// 获取验证码
let mix_num: any = 60;
let mix_timer: any = ref(null);
const mix_codeText: any = ref("重新发送");
const mix_setIntervals = function () {
  mix_timer.value = setInterval(() => {
    mix_num--;
    mix_codeText.value = `${mix_num}s`;
    if (mix_num < 1) {
      mix_codeText.value = `重新发送`;
      mix_num = 60;
      clearInterval(mix_timer.value);
      mix_timer.value = null;
    }
  }, 1000);
};
// 重新发送
const getCode = () => {
  mix_setIntervals();
};
onUnload(() => {
  clearInterval(mix_timer.value);
});

// 确认签约并付费
const dialogVisible = ref(false);
const handleSubmit = () => {
  ruleForm.value
    .validate()
    .then((res) => {
      dialogVisible.value = true;
    })
    .catch(() => {
      toast("信息未填写或填写有误，请重新填写");
    });
};
const closeSuccess = () => {
  dialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.main_text {
  color: $--color-main;
}
.common_text {
  color: $--color-common;
}
.sub_text {
  color: $--color-sub;
}
.down {
  display: block;
  width: 40rpx;
  height: 40rpx;
}
.tips {
  text-align: center;
  line-height: 40rpx;
  text {
    color: $--color-primary;
  }
}
.mb_80 {
  margin-bottom: 80rpx;
}
.send_btn {
  font-size: 24rpx;
  padding: 0;
  width: 160rpx;
  height: 60rpx;
  line-height: 56rpx;
}
button {
  font-weight: 400;
}
.explain_wp {
  margin: 0 22rpx;
  padding: 32rpx;
  border: 1px solid #689bf2;
  border-radius: 16rpx;
  .explain_title {
    image {
      display: block;
      width: 32rpx;
      height: 32rpx;
    }
  }
  .explain_li {
    margin-bottom: 20rpx;
    &:last-child {
      margin-bottom: 0;
    }
    .count {
      width: 26rpx;
      height: 26rpx;
      border-radius: 50%;
      background-color: #b1ccfa;
      color: #fff;
      font-size: 24rpx;
      text-align: center;
      line-height: 26rpx;
      flex-shrink: 0;
      margin-top: 7rpx;
    }
  }
}
</style>
