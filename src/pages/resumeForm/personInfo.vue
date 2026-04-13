<!--
 * @Author: XHL
 * @Date: 2023-08-23
 * @Description: 个人信息
-->
<template>
    <general-custom ref="general_custom" title="个人信息">
        <template #content>
            <general-forms
                ref="generalForm"
                :form-data="formData"
                :form-list="formList"
                :rules="rules"
                @submit="submit"
            >
                <template #avatar="scope">
                    <view class="flex justify-between align-center">
                        <view class="label">头像</view>
                        <view class="avatar_box flex align-center">
                            <button
                                class="avatar_btn"
                                hover-class="none"
                                open-type="chooseAvatar"
                                @chooseavatar="onChooseAvatar"
                            >
                                <image :src="scope.data.avatar || avatar" />
                            </button>
                            <svg-icon icon-class="next" class="fs-30 ml-16" />
                        </view>
                    </view>
                </template>
            </general-forms>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onShow, onReady } from '@dcloudio/uni-app'
import { ref, reactive, computed } from 'vue'
import { uploadResumeAvatar, saveResume } from '@/api/resume'
import test from '@/utils/test'
import { getDate, prefixedUrl, getResumeInfo, toast } from '@/utils/tool'
import _ from 'lodash'

const { phone, commonConst, cityList, config } = getApp().globalData as GlobalDataType
const avatar = computed(() => prefixedUrl(`${config.APP_TYPE}_avatar.png`))

const general_custom = ref()
onReady(async () => {
    general_custom.value.showLoading()
    await setFormList()
    await getResume()
})

// 出生日期
const birthdays = getDate(85, 16)
// 首次参加工作时间
const start_year_of_employment = getDate(60, 0)
// 表单
const formList = ref<formItemType[]>([])
const setFormList = () => {
    formList.value = [
        {
            key: 'avatar',
            title: '头像',
            type: 'slot',
        },
        {
            key: 'name',
            title: '姓名',
            type: 'input',
            maxlength: 20,
            required: true,
        },
        {
            key: 'phone',
            title: '手机号码',
            type: 'input',
            maxlength: 11,
            disabled: true,
            required: true,
        },
        {
            key: 'gender',
            title: '性别',
            type: 'sex',
            label: 'val',
            value: 'key',
            options: commonConst.talent_gender || [],
            required: true,
        },
        {
            key: 'wechat',
            title: '微信号',
            type: 'input',
            maxlength: 20,
        },
        {
            key: 'email',
            title: '个人邮箱',
            type: 'input',
            maxlength: 50,
        },
        {
            key: 'birthday',
            title: '出生日期',
            type: 'twoSelect',
            label: 'val',
            value: 'key',
            joinmark: '.',
            options: birthdays,
            required: true,
        },
        {
            key: 'education',
            format: 'education_format',
            title: '最高学历',
            type: 'select',
            label: 'val',
            value: 'key',
            defalutVal: Math.round(commonConst.talent_education.length / 2),
            options: commonConst.talent_education || [],
        },
        {
            key: 'start_year_of_employment',
            title: '首次参加工作时间',
            type: 'twoSelect',
            label: 'val',
            value: 'key',
            joinmark: '.',
            options: start_year_of_employment,
            required: true,
        },
        {
            key: 'political_status',
            format: 'political_status_format',
            title: '政治面貌',
            type: 'select',
            label: 'val',
            value: 'key',
            options: commonConst.political_status || [],
        },
        {
            key: 'citys',
            format: 'citys_format',
            title: '所在城市',
            type: 'twoSelect',
            label: 'name',
            value: 'id',
            joinmark: '·',
            options: cityList || [],
            required: true,
        },
        {
            key: 'native',
            format: 'native_format',
            title: '籍贯',
            type: 'twoSelect',
            label: 'name',
            value: 'id',
            joinmark: '·',
            options: cityList || [],
        },
        {
            key: 'summary',
            title: '个人评价',
            type: 'textarea',
            maxlength: 500,
        },
    ]
}
// 校验
const rules = {
    name: {
        rules: [
            { required: true, errorMessage: '请输入姓名' },
            { minLength: 2, maxLength: 20, errorMessage: '至少输入2个字' },
            { validateFunction: test.checkName },
        ],
    },
    wechat: {
        rules: [{ validateFunction: test.checkWechat }],
    },
    email: {
        rules: [{ validateFunction: test.checkEmail }],
    },
    birthday: {
        rules: [{ required: true, errorMessage: '请选择出生日期' }],
    },
    start_year_of_employment: {
        rules: [{ required: true, errorMessage: '请选择首次参加工作时间' }],
    },
    citys: {
        rules: [{ required: true, errorMessage: '请选择所在城市' }],
    },
}

// 简历信息
const formData = reactive<any>({
    gender: 1,
})
const getResume = async () => {
    try {
        const res: any = await getResumeInfo()
        if (res) {
            for (const key in res) {
                formData[key] = res[key]
            }
            if (res['avatar_url']) formData['avatar'] = res['avatar_url']
            if (!formData['phone']) formData['phone'] = phone
            if (formData['birthday']) {
                formData['birthday'] = formData['birthday'].split('-')
            } else formData['birthday'] = []

            if (formData['start_year_of_employment']) {
                formData['start_year_of_employment'] = formData['start_year_of_employment'].split('-')
            } else formData['start_year_of_employment'] = []

            if (formData['province_id'] && formData['city_id']) {
                formData.citys = [formData['province_id'], formData['city_id']]
                formData.citys_format = [formData['province_format'], formData['city_format']]
            } else {
                formData.citys = []
                formData.citys_format = []
            }

            if (formData['native_place'] && formData['native_city']) {
                formData.native = [formData['native_place'], formData['native_city']]
                formData.native_format = [formData['native_place_format'], formData['native_city_format']]
            } else {
                formData.native = []
                formData.native_format = []
            }
        }
    } catch (error) {
        //
    } finally {
        general_custom.value.hideLoading()
    }
}

// 获取简历信息
onShow(() => {
    const { textArea } = getApp().globalData as GlobalDataType
    for (const key in textArea) {
        formData[key] = textArea[key]
    }
})

const generalForm = ref()
// 选择头像
const onChooseAvatar = async (e) => {
    try {
        const { avatarUrl } = e.detail
        const res: any = await uploadResumeAvatar(avatarUrl)
        if (res.data) {
            formData['avatar_id'] = res.data.annex_id
            generalForm.value.updateForm('avatar', res.data.annex_path)
        }
    } catch (error) {
        //
    }
}
// 提交
const submit = async (data) => {
    try {
        general_custom.value.showLoading(true)
        const params = _.cloneDeep(data)
        params.birthday = params.birthday.length ? params.birthday.join('-') : ''
        params.start_year_of_employment = params.start_year_of_employment.length
            ? params.start_year_of_employment.join('-')
            : ''
        if (params.citys.length) {
            params['province_id'] = params.citys[0]
            params['city_id'] = params.citys[1]
        }
        params['area_id'] = 0
        if (params.native.length) {
            params['native_place'] = params.native[0]
            params['native_city'] = params.native[1]
        }
        await saveResume(params)
        toast('保存成功')
        const globalData = getApp().globalData as GlobalDataType
        globalData.textArea = {}
        uni.navigateBack()
    } catch (error) {
        //
    } finally {
        general_custom.value.hideLoading()
    }
}
</script>

<style lang="scss" scoped>
.label {
    font-size: 28rpx;
    font-weight: 600;
    color: $--color-main;
}
.avatar_box {
    .avatar_btn {
        border: none;
        height: 80rpx;
        padding: 0;
        > image {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            display: inline-block;
        }
    }
}
</style>
