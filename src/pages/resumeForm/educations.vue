<!--
 * @Author: XHL
 * @Date: 2023-08-28
 * @Description: 教育经历
-->
<template>
    <general-custom ref="general_custom" title="教育经历">
        <template #content>
            <general-forms
                :form-data="formData"
                :form-list="formList"
                :rules="rules"
                :show-del="showDel"
                @del="delSubmit"
                @submit="submit"
            />
            <general-loading v-if="loading" />
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, reactive, watch } from 'vue'
import { saveResume } from '@/api/resume'
import test from '@/utils/test'
import { getDate, getResumeInfo, toast, getItem, getSortTime } from '@/utils/tool'
const { commonConst } = getApp().globalData as GlobalDataType

let index = 0
onLoad(async (query: any) => {
    index = +query.index
    await getResume()
})

let copyForm: any = {}
const formData = reactive<any>({
    school_name: '',
    major_name: '',
    education: 0,
    education_format: '',
    education_start_date: [],
    education_end_date: [],
    is_recruit: 0,
    is_recruit_format: '',
    experience_at_school: '',
})
const showDel = ref(false)
const loading = ref(true)
const getResume = async () => {
    try {
        const res: any = await getResumeInfo()
        if (res) {
            copyForm = JSON.parse(JSON.stringify(res))
            showDel.value = res.educations_info.length > 1
            if (res.educations_info.length && res.educations_info[index]) {
                for (const key in res.educations_info[index]) {
                    formData[key] = res.educations_info[index][key]
                }
                if (formData['education'])
                    formData['education_format'] = getItem(
                        commonConst.talent_education || [],
                        formData['education'],
                        'key'
                    )['val']
                if (formData['is_recruit'])
                    formData['is_recruit_format'] = getItem(
                        commonConst.is_recruit || [],
                        formData['is_recruit'],
                        'key'
                    )['val']
                if (formData['education_start_date'])
                    formData['education_start_date'] = formData['education_start_date'].split('-')
                if (formData['education_end_date'])
                    formData['education_end_date'] = formData['education_end_date'].split('-')
            }
        }
    } catch (error) {
        //
    } finally {
        loading.value = false
    }
}

const education_date = getDate(80, 0)

const formList = [
    {
        key: 'school_name',
        title: '学校名称',
        type: 'input',
        maxlength: 20,
        required: true,
    },
    {
        key: 'major_name',
        title: '专业名称',
        type: 'input',
        maxlength: 20,
    },
    {
        key: 'education',
        format: 'education_format',
        title: '学历',
        type: 'select',
        label: 'val',
        value: 'key',
        defalutVal: Math.round(commonConst.talent_education.length / 2),
        options: commonConst.talent_education || [],
    },
    {
        key: 'education_date',
        startKey: 'education_start_date',
        endKey: 'education_end_date',
        title: '在校时间',
        type: 'monthRange',
        label: 'val',
        value: 'key',
        joinmark: '-',
        options: education_date,
        required: true,
    },
    {
        key: 'is_recruit',
        format: 'is_recruit_format',
        title: '是否统招',
        type: 'select',
        label: 'val',
        value: 'key',
        options: commonConst.is_recruit || [],
    },
    {
        key: 'experience_at_school',
        title: '在校经历',
        type: 'textarea',
        maxlength: 500,
    },
]

const rules = {
    school_name: {
        rules: [{ required: true, errorMessage: '请输入学校名称' }, { validateFunction: test.checkCommonName }],
    },
    major_name: {
        rules: [{ validateFunction: test.checkCommonName }],
    },
    education_date: {
        rules: [{ required: true, errorMessage: '请选择在校时间' }],
    },
}

watch(
    () => formData.education_start_date,
    (val) => {
        if (val.length) formData.education_date = val.join('-')
    },
    { immediate: true, deep: true }
)

onShow(async () => {
    const { textArea } = getApp().globalData as GlobalDataType
    for (const key in textArea) {
        formData[key] = textArea[key]
    }
})

// 删除
const general_custom = ref()
const delSubmit = async () => {
    try {
        general_custom.value.showLoading(true)
        copyForm.educations_info.splice(index, 1)
        await saveResume(copyForm)
        toast('操作成功')
        const globalData = getApp().globalData as GlobalDataType
        globalData.textArea = {}
        uni.navigateBack()
    } catch (error) {
        //
    } finally {
        general_custom.value.hideLoading()
    }
}

// 提交
const submit = async (data) => {
    try {
        general_custom.value.showLoading(true)
        const params = JSON.parse(JSON.stringify(data))

        if (params['education_start_date'].length)
            params['education_start_date'] = params['education_start_date'].join('-')
        else params['education_start_date'] = ''

        if (params['education_end_date'].length) params['education_end_date'] = params['education_end_date'].join('-')
        else if (params['education_start_date']) params['education_end_date'] = '至今'
        else params['education_end_date'] = ''
        if (
            params['education_end_date'] !== '至今' &&
            new Date(params['education_start_date']) > new Date(params['education_end_date'])
        ) {
            toast('结束时间不可以小于开始时间')
            general_custom.value.hideLoading()
            return
        }
        copyForm.educations_info[index] = params
        copyForm.educations_info.sort((a, b) => getSortTime(a, b, 'education_start_date', 'education_end_date'))
        await saveResume(copyForm)
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

<style lang="scss" scoped></style>
