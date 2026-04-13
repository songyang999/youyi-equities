<!--
 * @Author: XHL
 * @Date: 2023-08-28
 * @Description: 项目经历
-->
<template>
    <general-custom ref="general_custom" title="项目经历">
        <template #content>
            <general-forms
                :form-data="formData"
                :form-list="formList"
                :rules="rules"
                :show-del="showDel"
                @del="delSubmit"
                @submit="submit"
            />
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { ref, reactive, watch } from 'vue'
import { saveResume } from '@/api/resume'
import test from '@/utils/test'
import { getDate, getResumeInfo, toast, getSortTime } from '@/utils/tool'

let index = 0
onLoad(async (query: any) => {
    index = +query.index
})

onShow(async () => {
    const { textArea } = getApp().globalData as GlobalDataType
    for (const key in textArea) {
        formData[key] = textArea[key]
    }
})
const general_custom = ref()
onReady(async () => {
    await getResume()
})
let copyForm: any = {}
const formData = reactive<any>({
    project_name: '',
    company_name: '',
    project_title: '',
    project_start_date: [],
    project_end_date: [],
    project_describe: '',
    project_performance: '',
})
const showDel = ref(false)
const getResume = async () => {
    try {
        general_custom.value.showLoading()
        const res: any = await getResumeInfo()
        if (res) {
            copyForm = JSON.parse(JSON.stringify(res))
            showDel.value = res.projects_info.length > 1
            if (res.projects_info.length && res.projects_info[index]) {
                for (const key in res.projects_info[index]) {
                    formData[key] = res.projects_info[index][key]
                }
                if (formData['project_start_date'])
                    formData['project_start_date'] = formData['project_start_date'].split('-')
                if (formData['project_end_date']) formData['project_end_date'] = formData['project_end_date'].split('-')
            }
        }
    } catch (error) {
        //
    } finally {
        general_custom.value.hideLoading()
    }
}

// 项目时间
const project_date = getDate(60, 0)

const formList = [
    {
        key: 'project_name',
        title: '项目名称',
        type: 'input',
        maxlength: 50,
        required: true,
    },
    {
        key: 'company_name',
        title: '公司名称',
        type: 'input',
        maxlength: 50,
    },
    {
        key: 'project_title',
        title: '项目职务',
        type: 'input',
        maxlength: 10,
    },
    {
        key: 'project_date',
        startKey: 'project_start_date',
        endKey: 'project_end_date',
        title: '项目时间',
        type: 'monthRange',
        label: 'val',
        value: 'key',
        joinmark: '-',
        options: project_date,
        required: true,
    },
    {
        key: 'project_describe',
        title: '项目描述',
        type: 'textarea',
        maxlength: 500,
    },
    {
        key: 'project_performance',
        title: '项目成绩',
        type: 'textarea',
        maxlength: 500,
    },
]

const rules = {
    project_name: {
        rules: [{ required: true, errorMessage: '请输入项目名称' }, { validateFunction: test.checkCommonName }],
    },
    company_name: {
        rules: [{ validateFunction: test.checkCommonName }],
    },
    project_title: {
        rules: [{ validateFunction: test.checkCommonName }],
    },
    project_date: {
        rules: [{ required: true, errorMessage: '请选择项目时间' }],
    },
}

watch(
    () => formData.project_start_date,
    (val) => {
        if (val.length) formData.project_date = val.join('-')
    },
    { immediate: true, deep: true }
)

// 删除
const delSubmit = async () => {
    try {
        general_custom.value.showLoading(true)
        copyForm.projects_info.splice(index, 1)
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
        params['project_start_date'] = params['project_start_date'].length ? params['project_start_date'].join('-') : ''
        if (params['project_end_date'].length) params['project_end_date'] = params['project_end_date'].join('-')
        else if (params['project_start_date']) params['project_end_date'] = '至今'
        else params['project_end_date'] = ''
        if (
            params['project_end_date'] !== '至今' &&
            new Date(params['project_start_date']) > new Date(params['project_end_date'])
        ) {
            toast('结束时间不可以小于开始时间')
            general_custom.value.hideLoading()
            return
        }
        copyForm.projects_info[index] = params
        copyForm.projects_info.sort((a, b) => getSortTime(a, b, 'project_start_date', 'project_end_date'))
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
