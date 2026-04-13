<!--
 * @Author: XHL
 * @Date: 2024-02-29
 * @Description: 提现-完善信息
-->
<template>
    <!-- 完善简历 -->
    <popup-bottom ref="info" :is-back-click="false">
        <template #content>
            <view :style="{ height: popupHeight + 'px' }" class="perfect_wrap pr">
                <view
                    :style="{
                        backgroundImage: `url(${head_bac})`,
                    }"
                    class="popup_head px-32 pt-32"
                >
                    <view class="popup_title main-color fs-34">{{ props.title }}</view>
                    <view class="close_btn fs-24" @click="close">
                        <svg-icon icon-class="close" />
                    </view>
                </view>
                <view class="sub_title px-32 fs-26">{{ subTexts[props.type] }}</view>
                <scroll-view scroll-y class="form_wrap">
                    <general-forms
                        ref="infoForm"
                        :form-data="formData"
                        :form-list="formList"
                        :rules="rules"
                        save-text="确定提交"
                        @submit="submit"
                    >
                        <template #verify_code="scope">
                            <view>
                                <view class="label mb-24">短信验证码<text>*</text></view>
                                <view class="input-box flex justify-between align-center">
                                    <input
                                        v-model="scope.data.verify_code"
                                        placeholder="请输入短信验证码"
                                        :placeholder-style="`font-size: ${placeholderSize}px;color:#A4AFC1;`"
                                        class="input fs-28 flex1"
                                        type="text"
                                    />
                                    <view class="send_btn" @click="handleSendCode">{{
                                        count_down ? `${count_down}s` : send_text
                                    }}</view>
                                </view>
                            </view>
                        </template>
                    </general-forms>
                </scroll-view>
            </view>
            <general-loading v-if="loading" />
        </template>
    </popup-bottom>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { sendCode } from '@/api/my'
import test from '@/utils/test'
import { prefixedUrl, toFixedFun } from '@/utils/tool'
const popupHeight = uni.getWindowInfo()['windowHeight'] * 0.7
const { ratio } = getApp().globalData as GlobalDataType
const placeholderSize = toFixedFun(28 / ratio, 2)
const head_bac = computed(() => prefixedUrl('general_custom_bac.jpg'))
const subTexts = {
    1: '提现需进行实名认证, 确保以下信息为本人真实信息, 且需与微信认证信息一致, 如不一致将提现失败',
    2: '为保障您的账户资金安全, 请输入已实名认证信息, 若填写错误将会提现失败',
    3: '为保障您的账户资金安全, 请输入已实名认证信息, 若填写错误将会提现失败',
}

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    type: {
        type: Number,
        default: 1,
    },
})

const info = ref()
const infoForm = ref()
// 简历信息

const formData = reactive<any>({
    real_name: '',
    certificate_id: '',
    phone: '',
    nonce: '',
    verify_code: '',
})
const init = () => {
    infoForm.value.ruleForm.clearValidate()
    const { phone } = getApp().globalData as GlobalDataType
    formData.real_name = ''
    formData.certificate_id = ''
    formData.phone = phone
    formData.nonce = ''
    formData.verify_code = ''
    if (props.type === 1) {
        rules.value.certificate_id.rules = [
            { required: true, errorMessage: '请输入证件号码' },
            { validateFunction: test.checkIdCard },
        ]
    } else {
        rules.value.certificate_id.rules = [{ required: true, errorMessage: '请输入证件号码后六位' }]
    }
}

defineExpose({ info, init })

const emit = defineEmits(['close', 'submit'])

const close = () => {
    infoForm.value.ruleForm.clearValidate()
    info.value.forceClose()
    emit('close')
}

const formList = computed(() => {
    const list1 = [
        {
            key: 'real_name',
            title: '身份证姓名',
            type: 'input',
            maxlength: 20,
            required: true,
            clearable: true,
        },
        {
            key: 'certificate_id',
            title: '证件号码',
            type: 'input',
            maxlength: 18,
            required: true,
            clearable: true,
        },
        {
            key: 'phone',
            title: '手机号码',
            type: 'input',
            maxlength: 11,
            disabled: true,
        },
        {
            key: 'verify_code',
            title: '短信验证码',
            type: 'slot',
            required: true,
        },
    ]
    const list2 = [
        {
            key: 'real_name',
            title: '实名认证姓名',
            type: 'input',
            maxlength: 20,
            required: true,
            clearable: true,
        },
        {
            key: 'certificate_id',
            title: '证件号码后六位',
            type: 'input',
            maxlength: 18,
            required: true,
            clearable: true,
        },
        {
            key: 'phone',
            title: '手机号码',
            type: 'input',
            maxlength: 11,
            disabled: true,
        },
    ]
    const list3 = [
        {
            key: 'verify_code',
            title: '短信验证码',
            type: 'slot',
            required: true,
        },
    ]
    const lists = {
        1: list1,
        2: list2,
        3: list3,
    }
    return lists[props.type]
})
// 校验
const rules = ref({
    real_name: {
        rules: [
            { required: true, errorMessage: '请输入真实姓名' },
            { minLength: 2, maxLength: 20, errorMessage: '至少输入2个字' },
            { validateFunction: test.checkName },
        ],
    },
    certificate_id: {
        rules: [{ required: true, errorMessage: '请输入手机号码' }],
    },
    verify_code: {
        rules: [{ required: true, errorMessage: '请输入短信验证码' }],
    },
})

const loading = ref(false)

const send_text = ref('获取验证码')
const count_down = ref(0)
let timer
// 获取验证码
const handleSendCode = async () => {
    if (count_down.value > 0) return
    else if (count_down.value === 0) count_down.value = 60
    timer = setInterval(() => {
        if (count_down.value === 0) {
            clearInterval(timer)
            return
        }
        count_down.value--
    }, 1000)
    try {
        const global = getApp().globalData as GlobalDataType
        const params = {
            open_id: global.open_id,
            device_id: global.device_id,
            phone: global.phone,
            scene: props.type === 1 ? 1 : 2,
        }
        const res: any = await sendCode(params)
        if (res.data) {
            formData.nonce = res.data.nonce
        }
    } catch (error) {
        count_down.value = 0
        clearInterval(timer)
    }
}

// 提交
const submit = async () => {
    // info.value.forceClose()
    emit('submit', formData)
}
</script>

<style scoped lang="scss">
.perfect_wrap {
    box-sizing: border-box;
    padding-top: 184rpx;
}
.form_wrap {
    height: 100%;
}
.popup_head {
    width: 100%;
    height: 216rpx;
    padding-bottom: 136rpx;
    box-sizing: border-box;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    text-align: center;
    z-index: 10;
    // > view:first-child {
    //     opacity: 0;
    // }
    .close_btn {
        padding: 44rpx 32rpx;
        position: absolute;
        right: 0;
        top: 0;
    }
}
.popup_title {
    font-weight: 600;
    line-height: 48rpx;
}
.sub_title {
    color: $--color-danger;
    position: absolute;
    top: 112rpx;
    z-index: 11;
}
.label {
    font-size: 28rpx;
    color: $--color-main;
    font-weight: 600;
    text {
        color: $--color-danger;
        margin-left: 8rpx;
    }
}
.send_btn {
    font-size: 15px;
    color: $--color-primary;
    font-weight: 600;
}
</style>
