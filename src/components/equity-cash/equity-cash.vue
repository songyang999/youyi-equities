<!--
 * @Author: XHL
 * @Date: 2026-04-12
 * @Description: 权益兑换
-->
<template>
  <view class="deliver_bac" catchtouchmove="true" @click.stop="">
    <view class="deliver_wrap">
      <view class="yes_title fs-40">权益兑换</view>
      <view class="form-box">
        <uni-forms
          ref="ruleForm"
          :model-value="formData"
          :rules="rules"
          validate-trigger="blur"
          label-width="105"
        >
          <view class="select-box mb-30">
            <uni-forms-item name="equity" :rules="rules['equity']['rules']">
              <template #label>
                <view class="uni-forms-item__label">
                  <text class="is-required">*</text>
                  <text>权益选择</text>
                </view>
              </template>
              <view
                class="input-box flex justify-between align-center"
                @click="openOnePicker"
              >
                <view v-if="formData.equity" class="fs-26 main_text">
                  {{ formData.equity_format }}
                </view>
                <view v-else class="fs-26 common_text">请选择兑换权益</view>
                <image src="/static/images/down.png" class="down" />
              </view>
            </uni-forms-item>
          </view>
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
          <button type="primary" hover-class="none" @click="handleSubmit">
            确认兑换
          </button>
        </uni-forms>
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
import test from "@/utils/test";
// import { toast } from "@/utils/tool";
const ruleForm = ref();
const formData = ref({
  equity: 0,
  equity_format: "",
  phone: "",
});

const checkequity = (rule, value, data, callback) => {
  if (!value) {
    callback("请选择兑换权益");
  }
  return true;
};
const rules = {
  equity: {
    rules: [{ validateFunction: checkequity }],
  },
  phone: {
    rules: [
      { required: true, errorMessage: "请输入手机号码" },
      { validateFunction: test.checkMobile },
    ],
  },
};
// picker
const firstColumn = ref([
  {
    id: 1,
    name: "腾讯会员",
  },
  { id: 2, name: "爱奇艺会员" },
]);
// 单列选择器
const isShowOnePicker = ref(false);
const onePickerIndex = ref<number[]>([0]);
const openOnePicker = () => {
  isShowOnePicker.value = true;
  if (formData.value.equity) {
    onePickerIndex.value[0] = firstColumn.value.findIndex(
      (opt) => opt["id"] === formData.value.equity,
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
  formData.value.equity = firstColumn.value[onePickerIndex.value[0]]["id"];
  formData.value.equity_format =
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
    height: 478rpx;
    border-radius: 16rpx;
    padding: 0 44rpx;
    box-sizing: border-box;
    background-color: #fff;
    .yes_title {
      width: 100%;
      text-align: center;
      color: $--color-main;
      margin-top: 38rpx;
    }
    .main_text {
      color: $--color-main;
    }
    .common_text {
      color: $--color-sub;
    }
  }
  .form-box {
    padding: 28rpx 0;
    .uni-forms-item__label {
      width: 210rpx;
    }
    .select-box {
      // padding: 0;
      .uni-forms-item__label {
        width: 170rpx;
      }
    }
    .input-box {
      background: #f7f8fa;
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
