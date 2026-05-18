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
                    <view class="flex justify-center align-center mb-30">
                        <view class="avatar_box flex align-center">
                            <button class="avatar_btn" hover-class="none" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
                                <image :src="formData.avatar || '/static/images/avatar.png'" />
                            </button>
                        </view>
                    </view>
                    <view class="input-box mb-30">
                        <uni-forms-item name="nickName" :rules="rules['nickName']['rules']">
                            <template #label>
                                <view class="uni-forms-item__label">
                                    <text class="is-required">*</text>
                                    <text>姓名</text>
                                </view>
                            </template>
                            <view class>
                                <input
                                    v-model="formData.nickName"
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
                    <button type="primary" hover-class="none" class="mb-10" @click="handleSubmit">确 定</button>
                </uni-forms>
            </view>
        </template>
    </general-custom>
</template>

<script lang="ts" setup type="module">
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { ref } from "vue";
import { toast } from "@/utils/tool";
import { isRedirect, bindMsg, bindCommit } from "@/api/product";
import { pictureUpload, updateWechatUserInfo } from "@/api/my";
import test from "@/utils/test";
const ruleForm = ref();
const formData = ref({
    avatar: "",
    nickName: "",
    mobile: "",
    email: "",
    address: "",
});

onLoad(() => {});

const rules = {
    nickName: {
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

// 选择头像
const onChooseAvatar = async (e) => {
    try {
        const { avatarUrl } = e.detail;
        const res: any = await pictureUpload(avatarUrl);
        if (res.data) {
            formData.value["iconId"] = res.data.iconId;
            formData.value["avatar"] = res.data.url;
            // generalForm.value.updateForm('avatar', res.data.annex_path)
        }
    } catch (error) {
        //
    }
};

// 确认签约并付费
const handleSubmit = () => {
    ruleForm.value
        .validate()
        .then((res) => {
            updateInfo();
        })
        .catch(() => {
            toast("信息未填写或填写有误，请重新填写");
        });
};
const updateInfo = async () => {
    try {
        uni.showLoading({
            mask: true,
            title: "加载中...",
        });
        await updateWechatUserInfo(formData.value);
        uni.navigateBack({
            delta: 1,
        });
    } catch (error) {
        //
    } finally {
        uni.hideLoading();
    }
};
</script>

<style lang="scss" scoped>
button {
    font-weight: 400;
}
.hide {
    opacity: 0;
}
.avatar_box {
    .avatar_btn {
        border: none;
        height: 230rpx;
        padding: 0;
        > image {
            width: 230rpx;
            height: 230rpx;
            border-radius: 50%;
            display: inline-block;
        }
    }
}
</style>
