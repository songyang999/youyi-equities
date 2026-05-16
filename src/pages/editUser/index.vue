<!--
 * @Author: XHL
 * @Date: 2026-05-16
 * @Description: 修改信息
-->
<template>
    <general-custom ref="general_custom" title="修改信息">
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
                                    :placeholder-style="`font-size: 13px;color:#999999;`"
                                    disabled
                                    placeholder="请输入手机号码"
                                    class="input fs-28"
                                    type="text"
                                />
                            </view>
                        </uni-forms-item>
                    </view>
                    <view class="input-box mb-30">
                        <uni-forms-item name="email" :rules="rules['email']['rules']">
                            <template #label>
                                <view class="uni-forms-item__label">
                                    <text class="is-required hide">*</text>
                                    <text>邮箱</text>
                                </view>
                            </template>
                            <view class>
                                <input
                                    v-model="formData.email"
                                    :maxlength="100"
                                    placeholder="请输入邮箱"
                                    :placeholder-style="`font-size: 13px;color:#999999;`"
                                    class="input fs-28"
                                    type="text"
                                />
                            </view>
                        </uni-forms-item>
                    </view>
                    <view class="input-box mb-30">
                        <uni-forms-item name="address">
                            <template #label>
                                <view class="uni-forms-item__label">
                                    <text class="is-required hide">*</text>
                                    <text>地址</text>
                                </view>
                            </template>
                            <view class>
                                <input
                                    v-model="formData.address"
                                    :maxlength="100"
                                    placeholder="请输入地址"
                                    :placeholder-style="`font-size: 13px;color:#999999;`"
                                    class="input fs-28"
                                    type="text"
                                />
                            </view>
                        </uni-forms-item>
                    </view>
                    <button type="primary" hover-class="none" class="mb-10" @click="handleAgree">确 定</button>
                </uni-forms>
            </view>
        </template>
    </general-custom>
    <!-- 订购成功 -->
    <order-success v-if="dialogVisible" @close="closeSuccess" />
</template>

<script lang="ts" setup type="module">
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { ref } from "vue";
import { toast } from "@/utils/tool";
import { isRedirect, bindMsg, bindCommit } from "@/api/product";
import test from "@/utils/test";
const ruleForm = ref();
const formData = ref({
    account: "",
    mobile: "",
    email: "",
    address: "",
});

onLoad(() => {});

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
    email: {
        rules: [{ validateFunction: test.checkEmail }],
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
// 同意协议
const isFirst = ref(true);
const handleAgree = () => {
    ruleForm.value
        .validate()
        .then((res) => {
            if (isFirst.value) {
                isFirst.value = false;
                checkRedirect();
            } else {
                handleSubmit();
            }
        })
        .catch(() => {
            toast("信息未填写或填写有误，请重新填写");
        });
};

// 验证银行卡
const isGoto = ref(false);
const checkRedirect = async () => {
    try {
        uni.showLoading({
            mask: true,
            title: "加载中...",
        });
        isGoto.value = false;
        const res: any = await isRedirect({
            cardNo: formData.value.cardNo,
        });
        isGoto.value = res.data?.isRedirect;
        bindMsgFn();
    } catch (error) {
        uni.hideLoading();
    }
};
// 发送验证码/获取跳转银行链接
const bindMsgFn = async () => {
    try {
        const res: any = await bindMsg(formData.value);
        if (isGoto.value) {
            const url = res.data?.url || "";
            console.log("url==>", url);
        } else {
            // false时不需要验证码
            mix_setIntervals();
        }
    } catch (error) {
        //
    } finally {
        uni.hideLoading();
    }
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
            bindCommitFn();
        })
        .catch(() => {
            toast("信息未填写或填写有误，请重新填写");
        });
};
const bindCommitFn = async () => {
    try {
        uni.showLoading({
            mask: true,
            title: "加载中...",
        });
        await bindCommit(formData.value);
        dialogVisible.value = true;
    } catch (error) {
        //
    } finally {
        uni.hideLoading();
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
button {
    font-weight: 400;
}
.hide {
    opacity: 0;
}
</style>
