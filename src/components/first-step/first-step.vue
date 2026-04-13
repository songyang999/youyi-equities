<!--
 * @Author: XHL
 * @Date: 2024-01-10
 * @Description: 完善简历第一步
-->
<template>
    <view class="head_box px-32">
        <view class="head_title main-color fs-36 mb-8">一分钟介绍下<text>自己</text></view>
        <view class="sub-color fs-28">帮助招聘者快速找到你 (必填)</view>
    </view>
    <general-forms
        ref="firstForm"
        :form-data="props.formData"
        :form-list="firstFormList"
        :rules="rules"
        :show-del="true"
        del-text="上传附件"
        save-text="下一步"
        @del="uploadFile"
        @submit="submit"
    />
    <general-loading v-if="loading" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadResumeAnnex } from '@/api/resume'
import test from '@/utils/test'
import { handleBurialPoint, getDate, toast } from '@/utils/tool'

//	接受父组件传值
const props = defineProps({
    formData: {
        type: Object,
        default: () => {},
    },
})

let link = ''
const init = () => {
    handleBurialPoint('improve_jl1')
    setFormList()
}
const firstForm = ref()
defineExpose({ init, firstForm })

// 出生日期
const birthdays = getDate(85, 16)

// 第一步
const firstFormList = ref<formItemType[]>([])
const setFormList = () => {
    const { commonConst } = getApp().globalData as GlobalDataType
    firstFormList.value = [
        {
            key: 'name',
            title: '你的姓名?',
            placeholder: '请输入你的姓名',
            type: 'input',
            maxlength: 20,
        },
        {
            key: 'gender',
            title: '你的性别？',
            type: 'sex',
            label: 'val',
            value: 'key',
            options: commonConst.talent_gender || [],
        },
        {
            key: 'birthday',
            title: '你的出生日？',
            placeholder: '请选择你的出生日',
            type: 'twoSelect',
            label: 'val',
            value: 'key',
            joinmark: '.',
            options: birthdays,
        },
        {
            key: 'education',
            format: 'education_format',
            title: '你的学历？',
            placeholder: '请选择你的学历',
            type: 'select',
            label: 'val',
            value: 'key',
            defalutVal: commonConst.talent_education ? Math.round(commonConst.talent_education.length / 2) : 0,
            options: commonConst.talent_education || [],
        },
    ]
}

const checkEdu = (rule, value, data, callback) => {
    if (!value) {
        callback('请选择你的学历')
    }
    return true
}

const rules = {
    name: {
        rules: [
            { required: true, errorMessage: '请输入你的姓名' },
            { minLength: 2, maxLength: 20, errorMessage: '至少输入2个字' },
            { validateFunction: test.checkName },
        ],
    },
    birthday: {
        rules: [{ required: true, errorMessage: '请选择你的出生日' }],
    },
    education: {
        rules: [{ validateFunction: checkEdu }],
    },
}

const emit = defineEmits(['next', 'update'])
const loading = ref(false)
// 上传附件
const uploadFile = async () => {
    handleBurialPoint('improve_fj')
    loading.value = true
    uni.chooseMessageFile({
        count: 1, //限制选择的文件数量
        type: 'all', //非图片和视频的文件,不选默认为all
        success: async (res) => {
            const tempFile = res.tempFiles && res.tempFiles[0] && res.tempFiles[0]
            const regex = /\.(pdf|PDF|jpg|JPG|jpeg|JPEG)$/i
            if (!regex.test(tempFile.path)) {
                toast('仅支持pdf，jpg，jpeg格式')
                loading.value = false
                return
            }
            if (tempFile.size > 20 * 1000000) {
                toast('文件大小不能超过20M')
                loading.value = false
                return
            }
            try {
                const res: any = await uploadResumeAnnex(tempFile.path)
                if (res.data) {
                    emit('update', res.data.annex_id)
                }
                loading.value = false
            } catch (error) {
                loading.value = false
            }
        },
        fail: () => {
            loading.value = false
        },
    })
}

// 第一步提交
const submit = () => {
    handleBurialPoint('improve_qzxx_next')
    emit('next')
}
</script>

<style lang="scss" scoped>
.head_title {
    font-weight: 600;
    text {
        color: #21dbca;
    }
}
</style>
