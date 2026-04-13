<!--
 * @Author: XHL
 * @Date: 2023-08-25
 * @Description: 工作经历
-->
<template>
    <general-custom ref="general_custom" title="工作经历">
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
import { getDate, getResumeInfo, toast, getCurrentArr, getSortTime } from '@/utils/tool'

const { cityList, categoryList } = getApp().globalData as GlobalDataType

let index = 0
onLoad(async (query: any) => {
    index = +query.index
    await setFormList()
    await getResume()
})

// 任职日期
const employ_date = getDate(60, 0)

// 表单
const formList = ref<formItemType[]>([])
const setFormList = () => {
    formList.value = [
        {
            key: 'company_name',
            title: '公司名称',
            type: 'input',
            maxlength: 50,
            required: true,
        },
        {
            key: 'job_name',
            title: '职位名称',
            type: 'category',
        },
        {
            key: 'department',
            title: '所属部门',
            type: 'input',
            maxlength: 10,
        },
        {
            key: 'employ_date',
            startKey: 'employ_start_date',
            endKey: 'employ_end_date',
            title: '在职时间',
            type: 'monthRange',
            label: 'val',
            value: 'key',
            joinmark: '-',
            options: employ_date,
            required: true,
        },
        {
            key: 'citys',
            format: 'citys_format',
            title: '工作城市',
            type: 'threeSelect',
            label: 'name',
            value: 'id',
            joinmark: '·',
            options: cityList,
        },
        {
            key: 'work_describe',
            title: '工作描述',
            type: 'textarea',
            maxlength: 500,
        },
        {
            key: 'work_duty',
            title: '工作职责',
            type: 'textarea',
            maxlength: 500,
        },
        {
            key: 'work_performance',
            title: '工作业绩',
            type: 'textarea',
            maxlength: 500,
        },
        {
            key: 'leave_reason',
            title: '离职原因',
            type: 'textarea',
            maxlength: 100,
        },
    ]
}

// 校验
const rules = {
    company_name: {
        rules: [{ required: true, errorMessage: '请输入公司名称' }, { validateFunction: test.checkCommonName }],
    },
    employ_date: {
        rules: [{ required: true, errorMessage: '请选择在职时间' }],
    },
}

onShow(async () => {
    const { textArea, category } = getApp().globalData as GlobalDataType
    for (const key in textArea) {
        formData[key] = textArea[key]
    }
    for (const key in category) {
        formData[key] = category[key]
    }
})

let copyForm: any = {}
const formData = reactive<any>({
    company_name: '',
    job_name: [],
    report_object: '',
    employ_start_date: [],
    employ_end_date: [],
    citys: [],
    citys_format: [],
    work_describe: '',
    work_duty: '',
    work_performance: '',
    leave_reason: '',
})
const showDel = ref(false)
const loading = ref(true)
const getResume = async () => {
    try {
        const res: any = await getResumeInfo()
        if (res) {
            copyForm = JSON.parse(JSON.stringify(res))
            showDel.value = res.employments_info.length > 1
            if (res.employments_info.length && res.employments_info[index]) {
                for (const key in res.employments_info[index]) {
                    formData[key] = res.employments_info[index][key]
                }
                if (formData['job_name']) {
                    formData['job_name'] = getCurrentArr(formData['job_name'], categoryList, 3)
                } else formData['job_name'] = []

                if (formData['employ_start_date'])
                    formData['employ_start_date'] = formData['employ_start_date'].split('-')
                if (formData['employ_end_date']) formData['employ_end_date'] = formData['employ_end_date'].split('-')
                if (formData['province_id'] && formData['city_id'] && formData['area_id']) {
                    formData['citys'] = [formData['province_id'], formData['city_id'], formData['area_id']]
                    formData['citys_format'] = [
                        formData['province_format'],
                        formData['city_format'],
                        formData['area_format'],
                    ]
                }
            }
        }
    } catch (error) {
        //
    } finally {
        loading.value = false
    }
}

watch(
    () => formData.employ_start_date,
    (val) => {
        if (val.length) formData.employ_date = val.join('-')
    },
    { immediate: true, deep: true }
)

// 删除
const general_custom = ref()
const delSubmit = async () => {
    try {
        general_custom.value.showLoading(true)
        copyForm.employments_info.splice(index, 1)
        await saveResume(copyForm)
        toast('操作成功')
        const globalData = getApp().globalData as GlobalDataType
        globalData.textArea = {}
        globalData.category = {}
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
        params['job_name'] = params['job_name'].length ? params['job_name'][2] : (params['job_name'] = '')
        if (params['employ_start_date'].length) params['employ_start_date'] = params['employ_start_date'].join('-')
        else params['employ_start_date'] = ''

        if (params['employ_end_date'].length) params['employ_end_date'] = params['employ_end_date'].join('-')
        else if (params['employ_start_date']) params['employ_end_date'] = '至今'
        else params['employ_end_date'] = ''

        if (params['citys'].length) {
            params['province_id'] = params['citys'][0]
            params['city_id'] = params['citys'][1]
            params['area_id'] = params['citys'][2]
        } else {
            params['province_id'] = 0
            params['city_id'] = 0
            params['area_id'] = 0
        }
        if (
            params['employ_end_date'] !== '至今' &&
            new Date(params['employ_start_date']) > new Date(params['employ_end_date'])
        ) {
            toast('结束时间不可以小于开始时间')
            general_custom.value.hideLoading()
            return
        }
        copyForm.employments_info[index] = params
        copyForm.employments_info.sort((a, b) => getSortTime(a, b, 'employ_start_date', 'employ_end_date'))
        await saveResume(copyForm)
        toast('保存成功')
        const globalData = getApp().globalData as GlobalDataType
        globalData.textArea = {}
        globalData.category = {}
        uni.navigateBack()
    } catch (error) {
        //
    } finally {
        general_custom.value.hideLoading()
    }
}
</script>

<style lang="scss" scoped>
.head_title {
    display: inline-block;
    width: 411rpx;
    height: 50rpx;
}
</style>
