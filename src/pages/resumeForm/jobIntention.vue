<!--
 * @Author: XHL
 * @Date: 2023-08-25
 * @Description: 求职意向
-->
<template>
    <general-custom ref="general_custom" title="求职意向">
        <template #content>
            <view v-if="show_head" class="head-box">
                <view class="flex align-end mb-16">
                    <image class="head_title" :src="qzyx" />
                </view>
                <view class="head-sub-title">根据填写的信息推荐合适您的工作</view>
            </view>
            <general-forms :form-data="formData" :form-list="formList" :rules="rules" @submit="submit" />
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { ref, reactive, computed } from 'vue'
import { saveResume } from '@/api/resume'
import { prefixedUrl, getResumeInfo, toast, getCurrentArr, getItem } from '@/utils/tool'

const { config } = getApp().globalData as GlobalDataType
const qzyx = computed(() => prefixedUrl(`${config.APP_TYPE}_qzyx.png`))

const { commonConst, cityList } = getApp().globalData as GlobalDataType

const getNumberArray = (max: number, min = 0) => {
    const arr: number[] = []
    for (let i = min; i < max; ) {
        if (i < 30) {
            i += 1
        } else if (i < 100) {
            i += 5
        } else {
            i += 10
        }
        arr.push(i)
    }
    return arr
}
interface salaryType {
    key: string | number
    val: string
}
// 获取目前薪资
const getCurrentSalary = () => {
    const arr = getNumberArray(260)
    const list: salaryType[] = []
    arr.forEach((item) => {
        list.push({
            key: item * 1000,
            val: item + 'K',
        })
    })
    return list
}
const current_salary = getCurrentSalary()
// 获取期望薪资
const getExpectSalary = () => {
    const arr = getNumberArray(250)
    interface salaryListType extends salaryType {
        children: salaryType[]
    }
    const list: salaryListType[] = [
        {
            key: 0,
            val: '面议',
            children: [{ key: 0, val: '面议' }],
        },
    ]
    arr.forEach((item) => {
        list.push({
            key: item * 1000,
            val: item + 'K',
            children: (getNumberArray(260, item) || []).map((child) => {
                return {
                    key: child * 1000,
                    val: child + 'K',
                }
            }),
        })
    })
    return list
}
const current_expect_salary = getExpectSalary()

const show_head = ref(false)
onLoad(async (query: any) => {
    if (query.page) show_head.value = true
})

// 获取简历信息
onShow(() => {
    const { category } = getApp().globalData as GlobalDataType
    for (const key in category) {
        formData[key] = category[key]
    }
})

const general_custom = ref()
onReady(async () => {
    general_custom.value.showLoading()
    await setFormList()
    await getResume()
})

// 表单
const formList = ref<formItemType[]>([])
const setFormList = () => {
    formList.value = [
        {
            key: 'expect_job_type',
            format: 'expect_job_type_format',
            title: '求职类型',
            type: 'select',
            label: 'val',
            value: 'key',
            options: commonConst.expect_job_type || [],
            required: true,
        },
        {
            key: 'current_status',
            title: '求职状态',
            type: 'tab',
            label: 'val',
            value: 'key',
            options: commonConst.talent_current_status || [],
            required: true,
        },
        {
            key: 'current_salary',
            format: 'current_salary_format',
            title: '目前薪资',
            type: 'select',
            label: 'val',
            value: 'key',
            options: current_salary,
        },
        {
            key: 'expect_category_ids',
            format: 'expect_category_ids_format',
            title: '期望职位',
            type: 'category',
        },
        {
            key: 'current_expect_salary',
            format: 'current_expect_salary_format',
            title: '期望薪资',
            type: 'twoSelect',
            label: 'val',
            value: 'key',
            joinmark: '-',
            options: current_expect_salary,
        },
        {
            key: 'current_expect_city',
            title: '期望城市',
            type: 'twoSelect',
            label: 'name',
            value: 'name',
            lastLevel: true,
            options: cityList,
        },
    ]
}

// 校验
const rules = {
    expect_job_type: {
        rules: [{ required: true, errorMessage: '请选择求职类型' }],
    },
    current_status: {
        rules: [{ required: true, errorMessage: '请选择求职状态' }],
    },
}

// 简历信息
let copyForm = {}
const formData = reactive({})
const getResume = async () => {
    try {
        const res: any = await getResumeInfo()
        if (res) {
            copyForm = JSON.parse(JSON.stringify(res))
            for (const key in res.expect_job_info) {
                formData[key] = res.expect_job_info[key]
            }
            if (formData['expect_job_type']) {
                formData['expect_job_type_format'] = getItem(
                    commonConst.expect_job_type || [],
                    formData['expect_job_type'],
                    'key'
                )['val']
            } else {
                formData['expect_job_type'] = null
                formData['expect_job_type_format'] = ''
            }
            formData['current_status'] = res['current_status'] || null
            formData['current_salary_format'] = formData['current_salary']
                ? ~~(formData['current_salary'] / 1000) + 'K'
                : ''
            if (
                formData['expect_category_major_id'] &&
                formData['expect_category_minor_id'] &&
                formData['expect_category_detail_id']
            ) {
                formData['expect_category_ids'] = [
                    formData['expect_category_major_id'],
                    formData['expect_category_minor_id'],
                    formData['expect_category_detail_id'],
                ]
                formData['expect_category_ids_format'] = [
                    formData['expect_category_major_name'],
                    formData['expect_category_minor_name'],
                    formData['expect_category_detail_name'],
                ]
            } else {
                formData['expect_category_ids'] = []
                formData['expect_category_ids_format'] = []
            }
            if (formData['current_expect_salary_max'] && formData['current_expect_salary_min']) {
                formData['current_expect_salary'] = [
                    formData['current_expect_salary_min'],
                    formData['current_expect_salary_max'],
                ]
                formData['current_expect_salary_format'] = [
                    ~~(formData['current_expect_salary_min'] / 1000) + 'K',
                    ~~(formData['current_expect_salary_max'] / 1000) + 'K',
                ]
            } else if (formData['current_status']) {
                formData['current_expect_salary'] = [0, 0]
                formData['current_expect_salary_format'] = ['面议', '面议']
            } else {
                formData['current_expect_salary'] = []
                formData['current_expect_salary_format'] = []
            }
            if (formData['current_expect_city']) {
                formData['current_expect_city'] = getCurrentArr(formData['current_expect_city'], cityList)
            } else formData['current_expect_city'] = []
        }
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
        copyForm['current_status'] = data['current_status']
        copyForm['expect_job_info']['expect_job_type'] = data['expect_job_type']
        copyForm['expect_job_info']['current_salary'] = data['current_salary']
        if (data['expect_category_ids'].length) {
            copyForm['expect_job_info']['expect_category_major_id'] = data['expect_category_ids'][0]
            copyForm['expect_job_info']['expect_category_minor_id'] = data['expect_category_ids'][1]
            copyForm['expect_job_info']['expect_category_detail_id'] = data['expect_category_ids'][2]
            copyForm['expect_job_info']['current_expect_job'] = data['expect_category_ids_format'][2]
        }
        if (data['current_expect_salary'].length) {
            copyForm['expect_job_info']['current_expect_salary_min'] = data['current_expect_salary'][0]
            copyForm['expect_job_info']['current_expect_salary_max'] = data['current_expect_salary'][1]
        }
        if (data['current_expect_city'].length) {
            copyForm['expect_job_info']['current_expect_city'] = data['current_expect_city'][1]
        }
        await saveResume(copyForm)
        toast('保存成功')
        const globalData = getApp().globalData as GlobalDataType
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
    width: 205rpx;
    height: 50rpx;
}
</style>
