<!--
 * @Author: XHL
 * @Date: 2026-04-12
 * @Description: 业务退订
-->
<template>
  <view class="deliver_bac" catchtouchmove="true" @click.stop="">
    <view class="deliver_wrap">
      <view class="close_btn" @click="close">
        <image src="/static/images/close.png" />
      </view>
      <view class="yes_title fs-40">业务退订</view>
      <view class="unreg_condition flex mt-22">
        <image class="yes_icon mr-16" src="/static/images/success.png" />
        <view class="flex1">
          <view class="condition_item sub_text">
            <view class="line_60 fs-30">订单满足退订条件</view>
          </view>
          <view class="condition_item">
            <view class="flex justify-between align-center main_text line_60">
              <text class="fs-30">2元-水电燃气缴费红包</text>
              <text class="fs-24">共1件</text>
            </view>
            <view class="flex justify-end align-end fs-24 mt-4 mb-20"
              >实付款￥<text class="fs-32 danger_text">2.00</text></view
            >
          </view>
          <view class="condition_item py-15">
            <view class="flex justify-between sub_text fs-30 line_60">
              <text>订单编号</text>
              <text>0000000000000000</text>
            </view>
          </view>
        </view>
      </view>
      <view class="form-box">
        <uni-forms
          ref="ruleForm"
          :model-value="formData"
          :rules="rules"
          validate-trigger="blur"
          label-width="90"
        >
          <view class="select-box mb-30">
            <uni-forms-item name="reason" :rules="rules['reason']['rules']">
              <template #label>
                <view class="uni-forms-item__label">
                  <text class="is-required">*</text>
                  <text>退款原因</text>
                </view>
              </template>
              <view
                class="input-box flex justify-between align-center"
                @click="openOnePicker"
              >
                <view v-if="formData.reason" class="fs-26 main_text">
                  {{ formData.reason_format }}
                </view>
                <view v-else class="fs-26 common_text">请选择退款原因</view>
                <image src="/static/images/down.png" class="down" />
              </view>
            </uni-forms-item>
          </view>
          <button type="primary" hover-class="none" @click="handleSubmit">
            提交退订申请
          </button>
        </uni-forms>
      </view>
      <view class="notice_wrap">
        <view class="fs-30 sub_text mb-16">退订须知</view>
        <view class="flex justify-between fs-28 common_text mb-14">
          <text>退款时效</text>
          <text>20天</text>
        </view>
        <view class="flex justify-between fs-28 common_text mb-14">
          <text>退款渠道</text>
          <text>微信</text>
        </view>
        <view class="flex justify-between fs-28 common_text">
          <text>退款查询</text>
          <text>111</text>
        </view>
      </view>
    </view>
  </view>
  <!-- 单列选择 -->
  <view
    v-if="isShowOnePicker"
    class="picker_model"
    catchtouchmove="true"
    @click.stop="closeOnePicker"
  >
    <view class="picker_view" @click.stop="">
      <picker-view
        :value="onePickerIndex"
        @change="changeOnePicker"
        @pickstart="pickerStart"
        @pickend="pickerEnd"
      >
        <picker-view-column class="picker_view_column">
          <view v-for="opt in firstColumn" :key="opt['id']" class="item">{{
            opt["name"]
          }}</view>
        </picker-view-column>
      </picker-view>
      <view class="picker_view_choose flex">
        <button class="flex1" hover-class="none" @click="closeOnePicker">
          取消
        </button>
        <button
          type="primary"
          class="flex1"
          hover-class="none"
          @click="confirmOnePicker"
        >
          确定
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { toast } from "@/utils/tool";
const ruleForm = ref();
const formData = ref({
  reason: 0,
  reason_format: "",
});

const checkReason = (rule, value, data, callback) => {
  if (!value) {
    callback("请选择退款原因");
  }
  return true;
};
const rules = {
  reason: {
    rules: [{ validateFunction: checkReason }],
  },
};
// picker
const firstColumn = ref([
  {
    id: 1,
    name: "退货退款",
  },
  { id: 2, name: "仅退款" },
]);
// 单列选择器
const isShowOnePicker = ref(false);
const onePickerIndex = ref<number[]>([0]);
const openOnePicker = () => {
  isShowOnePicker.value = true;
  if (formData.value.reason) {
    onePickerIndex.value[0] = firstColumn.value.findIndex(
      (opt) => opt["id"] === formData.value.reason,
    );
  } else {
    onePickerIndex.value = [0];
  }
};
const changeOnePicker = (e) => {
  onePickerIndex.value = e.detail.value;
};
let disabled = false;
const pickerStart = () => {
  disabled = true;
};
const pickerEnd = () => {
  disabled = false;
};
const closeOnePicker = () => {
  if (disabled) return;
  isShowOnePicker.value = false;
};
const confirmOnePicker = () => {
  if (disabled) return;
  formData.value.reason = firstColumn.value[onePickerIndex.value[0]]["id"];
  formData.value.reason_format =
    firstColumn.value[onePickerIndex.value[0]]["name"];
  setTimeout(() => {
    isShowOnePicker.value = false;
  }, 300);
};

const handleSubmit = () => {
  ruleForm.value
    .validate()
    .then((res) => {
      emit("close");
    })
    .catch(() => {
      //
    });
};

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
    height: 915rpx;
    border-radius: 16rpx;
    padding: 0 44rpx;
    box-sizing: border-box;
    background-color: #fff;
    .yes_icon {
      display: block;
      width: 30rpx;
      height: 30rpx;
      margin-top: 18rpx;
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
      margin-top: 38rpx;
    }
    .condition_item {
      border-bottom: 1px solid #ededed;
      .line_60 {
        height: 60rpx;
        line-height: 60rpx;
      }
    }
    .main_text {
      color: $--color-main;
    }
    .sub_text {
      color: $--color-common;
    }
    .danger_text {
      color: $--color-danger;
    }
    .common_text {
      color: $--color-sub;
    }
  }
  .form-box {
    padding: 28rpx 0;
    .select-box {
      padding: 0;
      .uni-forms-item__label {
        width: 174rpx;
      }
      .input-box {
        background: #f7f8fa;
      }
    }
  }
}
.down {
  display: block;
  width: 40rpx;
  height: 40rpx;
}
.picker_model {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.34);
  .picker_view {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 644rpx;
    background-color: #fff;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    border-radius: 32rpx 32rpx 0 0;
    overflow: hidden;
    .picker_view_column {
      height: 500rpx;
      color: $--color-main;
      .item {
        line-height: 34px;
        text-align: center;
        font-size: 13px;
      }
    }
    .picker_view_choose {
      padding: 32rpx;
    }
  }
}
</style>
