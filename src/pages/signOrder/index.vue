<!--
 * @Author: XHL
 * @Date: 2026-04-11
 * @Description: 签约订购
-->
<template>
    <general-custom ref="general_custom" title="签约订购">
        <template #content>
            <view class="form-box">
                <uni-forms ref="ruleForm" :model-value="formData" :rules="rules" validate-trigger="blur" label-width="90">
                    <view class="input-box mb-30">
                        <uni-forms-item name="account" :rules="rules['account']['rules']">
                            <template #label>
                                <view class="uni-forms-item__label">
                                    <text class="is-required">*</text>
                                    <text>姓名</text>
                                </view>
                            </template>
                            <view class>
                                <input
                                    v-model="formData.account"
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
                        <uni-forms-item name="mobile" :rules="rules['mobile']['rules']">
                            <template #label>
                                <view class="uni-forms-item__label">
                                    <text class="is-required">*</text>
                                    <text>手机号码</text>
                                </view>
                            </template>
                            <view class>
                                <input
                                    v-model="formData.mobile"
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
                        <uni-forms-item name="idCard" :rules="rules['idCard']['rules']">
                            <template #label>
                                <view class="uni-forms-item__label">
                                    <text class="is-required">*</text>
                                    <text>身份证</text>
                                </view>
                            </template>
                            <view class>
                                <input
                                    v-model="formData.idCard"
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
                        <uni-forms-item name="bankInsCd" :rules="rules['bankInsCd']['rules']">
                            <template #label>
                                <view class="uni-forms-item__label">
                                    <text class="is-required">*</text>
                                    <text>银行</text>
                                </view>
                            </template>
                            <view class="input-box flex justify-between align-center" @click="openOnePicker">
                                <view v-if="formData.bankInsCd" class="fs-26 main_text">{{ formData.bank_name }}</view>
                                <view v-else class="fs-26 common_text">请选择银行</view>
                                <image src="/static/images/down.png" class="down" />
                            </view>
                        </uni-forms-item>
                    </view>
                    <view class="input-box mb-30">
                        <uni-forms-item name="cardNo" :rules="rules['cardNo']['rules']">
                            <template #label>
                                <view class="uni-forms-item__label">
                                    <text class="is-required">*</text>
                                    <text>银行卡号</text>
                                </view>
                            </template>
                            <view class>
                                <input
                                    v-model="formData.cardNo"
                                    :maxlength="100"
                                    placeholder="请输入银行卡号"
                                    :placeholder-style="`font-size: 13px;color:#999999;`"
                                    class="input fs-28"
                                    type="text"
                                    @blur="_ => {formData.cardNo = trim(formData.cardNo, 'all')}"
                                />
                            </view>
                        </uni-forms-item>
                    </view>
                    <!-- <template v-if="!isFirst && !isGoto"> -->
                    <view class="select-box mb-30">
                        <uni-forms-item name="msgCode" :rules="rules['msgCode']['rules']">
                            <template #label>
                                <view class="uni-forms-item__label">
                                    <text class="is-required">*</text>
                                    <text>验证码</text>
                                </view>
                            </template>
                            <view class="input-box flex justify-between align-center">
                                <input
                                    v-model="formData.msgCode"
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
                                    @click="checkRedirect"
                                >{{ mix_codeText }}</button>
                            </view>
                        </uni-forms-item>
                    </view>
                    <!-- </template> -->
                    <button type="primary" hover-class="none" class="mb-10" @click="handleAgree">签约订购</button>
                    <view class="tips common_text fs-24">资费{{ separatorFilter(price, 2) }}元/月</view>
                    <view class="tips common_text fs-24 mb_80">
                        点击按钮视为同意
                        <text @click="goPage('/pages/privacy/index')">《隐私协议》</text>及
                        <text @click="goPage('/pages/agreement/index')">《扣款授权确认书》</text>
                    </view>
                </uni-forms>
            </view>
        </template>
    </general-custom>
    <!-- 单列选择 -->
    <view v-if="isShowOnePicker" class="picker_model" catchtouchmove="true" @click.stop="closeOnePicker">
        <view class="picker_view" @click.stop>
            <picker-view :value="onePickerIndex" @change="changeOnePicker" @pickstart="pickerStart" @pickend="pickerEnd">
                <picker-view-column class="picker_view_column">
                    <view v-for="opt in firstColumn" :key="opt['sKey']" class="item">{{ opt["sValue"] }}</view>
                </picker-view-column>
            </picker-view>
            <view class="picker_view_choose flex">
                <button class="flex1" hover-class="none" @click="closeOnePicker">取消</button>
                <button type="primary" class="flex1" hover-class="none" @click="confirmOnePicker">确定</button>
            </view>
        </view>
    </view>
    <!-- 订购成功 -->
    <order-success v-if="dialogVisible" :price="price" :name="productName" @close="closeSuccess" />
    <!-- 订购失败 -->
    <order-failure v-if="dialogFailVisible" :error-msg="errorMsg" @close="closeFailure" />
</template>

<script lang="ts" setup type="module">
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { ref, computed } from "vue";
import { toast, goPage, separatorFilter, trim } from "@/utils/tool";
import { isRedirect, bindMsg, bindCommit, comboBank } from "@/api/product";
import test from "@/utils/test";
import _ from "lodash";
const ruleForm = ref();
const formData = ref({
    account: "",
    mobile: "",
    idCard: "",
    bankInsCd: "",
    bank_name: "",
    cardNo: "",
    msgCode: "",
    productKey: "",
    bindMchntssn: "",
});

const price = ref(0);
onLoad((query: any) => {
    formData.value.productKey = query?.productKey || "";
    price.value = Number(query?.price) || 0;
    getComboBank();
});

const productName = computed(() => {
    if (formData.value.productKey === "EQ_P_0000002") {
        return "视频会员"
    } else if (formData.value.productKey === "EQ_P_0000003") {
        return "音频会员"
    } else {
        return ""
    }
});

const checkBank = (rule, value, data, callback) => {
    if (!value) {
        callback("请选择银行");
    }
    return true;
};
const rules = {
    account: {
        rules: [{ required: true, errorMessage: "请输入姓名" }],
    },
    mobile: {
        rules: [
            { required: true, errorMessage: "请输入手机号码" },
            { validateFunction: test.checkMobile },
        ],
    },
    idCard: {
        rules: [
            { required: true, errorMessage: "请输入身份证" },
            { validateFunction: test.checkIdCard },
        ],
    },
    bankInsCd: {
        rules: [{ validateFunction: checkBank }],
    },
    cardNo: {
        rules: [
            { required: true, errorMessage: "请输入银行卡号" },
            { validateFunction: test.checkDigits },
        ],
    },
    msgCode: {
        rules: [{ required: true, errorMessage: "请输入验证码" }],
    },
};

// picker
interface bankType {
    sKey: string;
    sValue: string;
}
const firstColumn = ref<bankType[]>([]);
const getComboBank = async () => {
    try {
        const res: any = await comboBank();
        firstColumn.value = res.data || [];
    } catch (error) {
        //
    }
};
// 单列选择器
const isShowOnePicker = ref(false);
const onePickerIndex = ref<number[]>([0]);
const openOnePicker = () => {
    isShowOnePicker.value = true;
    if (formData.value.bankInsCd) {
        onePickerIndex.value[0] = firstColumn.value.findIndex(
            (opt) => opt["sKey"] === formData.value.bankInsCd
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
    formData.value.bankInsCd =
        firstColumn.value[onePickerIndex.value[0]]["sKey"];
    formData.value.bank_name =
        firstColumn.value[onePickerIndex.value[0]]["sValue"];
    setTimeout(() => {
        isShowOnePicker.value = false;
    }, 300);
};

// 获取验证码
let mix_num: any = 60;
let mix_timer: any = ref(null);
const mix_codeText: any = ref("发送验证码");
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
// 同意协议
const handleAgree = () => {
    ruleForm.value
        .validate()
        .then((res) => {
            handleSubmit();
        })
        .catch(() => {
            toast("信息未填写或填写有误，请重新填写");
        });
};

// 验证银行卡
const checkRedirect = async () => {
    try {
        const res: any = await isRedirect({
            cardNo: formData.value.cardNo,
            bankInsCd: formData.value.bankInsCd,
        });
        if (!res.data?.isRedirect) {
            bindMsgFn();
        }
    } catch (error) {
        //
    }
};
// 发送验证码/获取跳转银行链接
const bindMsgFn = async () => {
    try {
        const params = _.cloneDeep(formData.value);
        const res: any = await bindMsg(params);
        formData.value.bindMchntssn = res.data?.bindMchntssn || "";
        // false时需要验证码
        mix_setIntervals();
    } catch (error) {
        //
    }
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
            bindCommitFn();
        })
        .catch(() => {
            toast("信息未填写或填写有误，请重新填写");
        });
};
const dialogFailVisible = ref(false);
const errorMsg = ref("");
const closeFailure = () => {
    dialogFailVisible.value = false;
};
const bindCommitFn = async () => {
    try {
        const params = _.cloneDeep(formData.value);
        await bindCommit(params);
        dialogVisible.value = true;
    } catch (error: any) {
        if (error?.result?.msg) {
            errorMsg.value = error.result.msg;
            dialogFailVisible.value = true;
        }
    }
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
