<!--
 * @Author: XHL
 * @Date: 2026-04-11
 * @Description: 签约订购
-->
<template>
  <general-custom ref="general_custom" title="签约订购">
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
            <uni-forms-item name="name" :rules="rules['name']['rules']">
              <template #label>
                <view class="uni-forms-item__label">
                  <text class="is-required">*</text>
                  <text>姓名</text>
                </view>
              </template>
              <view class="">
                <input
                  v-model="formData.name"
                  :maxlength="100"
                  placeholder="请输入姓名"
                  :placeholder-style="`font-size: 13px;color:#999999;`"
                  class="input fs-28"
                  type="text"
                />
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
          <view class="input-box mb-30">
            <uni-forms-item name="id_card" :rules="rules['id_card']['rules']">
              <template #label>
                <view class="uni-forms-item__label">
                  <text class="is-required">*</text>
                  <text>身份证</text>
                </view>
              </template>
              <view class="">
                <input
                  v-model="formData.id_card"
                  :maxlength="100"
                  placeholder="请输入身份证"
                  :placeholder-style="`font-size: 13px;color:#999999;`"
                  class="input fs-28"
                  type="text"
                />
              </view>
            </uni-forms-item>
          </view>
          <view class="select-box mb-30">
            <uni-forms-item name="bank" :rules="rules['bank']['rules']">
              <template #label>
                <view class="uni-forms-item__label">
                  <text class="is-required">*</text>
                  <text>银行</text>
                </view>
              </template>
              <view
                class="input-box flex justify-between align-center"
                @click="openOnePicker"
              >
                <view v-if="formData.bank" class="fs-26 main_text">
                  {{ formData.bank_name }}
                </view>
                <view v-else class="fs-26 common_text">请选择银行</view>
                <image src="/static/images/down.png" class="down" />
              </view>
            </uni-forms-item>
          </view>
          <view class="input-box mb-30">
            <uni-forms-item
              name="bank_card"
              :rules="rules['bank_card']['rules']"
            >
              <template #label>
                <view class="uni-forms-item__label">
                  <text class="is-required">*</text>
                  <text>银行卡号</text>
                </view>
              </template>
              <view class="">
                <input
                  v-model="formData.bank_card"
                  :maxlength="100"
                  placeholder="请输入银行卡号"
                  :placeholder-style="`font-size: 13px;color:#999999;`"
                  class="input fs-28"
                  type="text"
                />
              </view>
            </uni-forms-item>
          </view>
          <button
            :disabled="formData.is_agree"
            type="primary"
            hover-class="none"
            class="mb-10"
            @click="handleAgree"
          >
            同意协议并订购
          </button>
          <view class="tips common_text fs-24">资费XX元/月</view>
          <view class="tips common_text fs-24 mb_80"
            >点击按钮为同意<text>《隐私协议》《订购规则》</text></view
          >
          <template v-if="formData.is_agree">
            <view class="select-box mb-30">
              <uni-forms-item
                name="ver_code"
                :rules="rules['ver_code']['rules']"
              >
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
            <button type="primary" hover-class="none" @click="handleSubmit">
              确认签约并付费
            </button>
          </template>
        </uni-forms>
      </view>
    </template>
  </general-custom>
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
  <!-- 订购成功 -->
  <order-success v-if="dialogVisible" @close="closeSuccess" />
</template>

<script lang="ts" setup type="module">
import { onUnload } from '@dcloudio/uni-app'
import { ref } from "vue";
import { toast } from "@/utils/tool";
import test from "@/utils/test";
const ruleForm = ref()
const formData = ref({
  name: "",
  phone: "",
  id_card: "",
  bank: 0,
  bank_name: "",
  bank_card: "",
  is_agree: false,
  ver_code: "",
});

const checkBank = (rule, value, data, callback) => {
  if (!value) {
        callback('请选择银行')
    }
    return true
}
const rules = {
  name: {
    rules: [{ required: true, errorMessage: "请输入姓名" }],
  },
  phone: {
    rules: [
      { required: true, errorMessage: "请输入手机号码" },
      { validateFunction: test.checkMobile },
    ],
  },
  id_card: {
    rules: [
      { required: true, errorMessage: "请输入身份证" },
      { validateFunction: test.checkIdCard },
    ],
  },
  bank: {
    rules: [{ validateFunction: checkBank }],
  },
  bank_card: {
    rules: [
      { required: true, errorMessage: "请输入银行卡号" },
      { validateFunction: test.checkDigits },
    ],
  },
  ver_code: {
    rules: [
      { required: true, errorMessage: "请输入验证码" },
    ],
  }
};

// picker
const firstColumn = ref([{
  id: 1, name: '招商银行'
}, { id: 2, name: '建设银行'}])
// 单列选择器
const isShowOnePicker = ref(false)
const onePickerIndex = ref<number[]>([0])
const openOnePicker = () => {
    isShowOnePicker.value = true
    if (formData.value.bank) {
        onePickerIndex.value[0] = firstColumn.value.findIndex((opt) => opt['id'] === formData.value.bank)
    } else {
        onePickerIndex.value = [0]
    }
}
const changeOnePicker = (e) => {
    onePickerIndex.value = e.detail.value
}
let disabled = false
const pickerStart = () => {
    disabled = true
}
const pickerEnd = () => {
    disabled = false
}
const closeOnePicker = () => {
    if (disabled) return
    isShowOnePicker.value = false
}
const confirmOnePicker = () => {
    if (disabled) return
    formData.value.bank = firstColumn.value[onePickerIndex.value[0]]['id']
    formData.value.bank_name = firstColumn.value[onePickerIndex.value[0]]['name']
    setTimeout(() => {
        isShowOnePicker.value = false
    }, 300)
}

// 获取验证码
let mix_num : any = 60
let mix_timer : any = ref(null)
const mix_codeText : any = ref('重新发送')
const mix_setIntervals = function () {
  mix_timer.value = setInterval(() => {
    mix_num--
    mix_codeText.value = `${mix_num}s`
    if (mix_num < 1) {
      mix_codeText.value = `重新发送`
      mix_num = 60
      clearInterval(mix_timer.value)
      mix_timer.value = null
    }
  }, 1000)
}
// 同意协议
const handleAgree = () => {
  ruleForm.value
    .validate()
    .then((res) => {
        formData.value.is_agree = true
        mix_setIntervals()
    })
    .catch(() => {
        toast('信息未填写或填写有误，请重新填写')
    })
}
// 重新发送
const getCode = () => {
  mix_setIntervals()
}
onUnload(() => {
  clearInterval(mix_timer.value)
})

// 确认签约并付费
const dialogVisible = ref(false)
const handleSubmit = () => {
  ruleForm.value
    .validate()
    .then((res) => {
        dialogVisible.value = true
    })
    .catch(() => {
        toast('信息未填写或填写有误，请重新填写')
    })
}
const closeSuccess = () => {
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.main_text {
  color: $--color-main;
}
.common_text {
  color: $--color-common;
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
.picker_model {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
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
