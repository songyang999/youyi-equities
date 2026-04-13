<!--
 * @Author: XHL
 * @Date: 2023-08-28
 * @Description: 所获证书
-->
<template>
    <general-custom ref="general_custom" title="所获证书">
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
import { onLoad } from '@dcloudio/uni-app'
import { ref, reactive } from 'vue'
import dayjs from 'dayjs'
import { saveResume } from '@/api/resume'
import test from '@/utils/test'
import { getDate, getResumeInfo, toast } from '@/utils/tool'

let index = 0
onLoad(async (query: any) => {
    index = +query.index
    await getResume()
})

let copyForm: any = {}
const formData = reactive<any>({
    name: '',
    time: '',
})
let credentialList: Array<any> = []
const showDel = ref(false)
const loading = ref(true)
const getResume = async () => {
    try {
        const res: any = await getResumeInfo()
        if (res) {
            copyForm = JSON.parse(JSON.stringify(res))
            showDel.value = res.credentials.length > 1
            credentialList = res.credentials
            if (res.credentials.length && res.credentials[index]) {
                for (const key in res.credentials[index]) {
                    formData[key] = res.credentials[index][key]
                }
                formData['time'] = formData['time'] ? formData['time'].split('-') : []
            }
        }
    } catch (error) {
        //
    } finally {
        loading.value = false
    }
}

const time = getDate(50, -10, 3)

const year = dayjs().year() + ''
const month = dayjs().month() + 1 > 9 ? dayjs().month() + 1 + '' : '0' + (dayjs().month() + 1)
const date = dayjs().date() > 9 ? dayjs().date() + '' : '0' + dayjs().date()
const defaultTime = [year, month, date]
const formList = [
    {
        key: 'name',
        title: '证书名称',
        type: 'input',
        maxlength: 20,
        required: true,
    },
    {
        key: 'time',
        title: '获取日期',
        type: 'threeSelect',
        label: 'val',
        value: 'key',
        joinmark: '.',
        options: time,
        defaultVal: defaultTime,
        required: true,
    },
]

// 校验同名
const checkDoubleName = (rule, value, data, callback) => {
    if (value) {
        for (let i = 0; i < credentialList.length; i++) {
            if (i !== index && credentialList[i]['name'] === value) {
                callback('证书名称不能重复')
            }
        }
        return true
    }
    return true
}

const rules = {
    name: {
        rules: [
            { required: true, errorMessage: '请输入证书名称' },
            { validateFunction: test.checkCommonName },
            { validateFunction: checkDoubleName },
        ],
    },
    time: {
        rules: [{ required: true, errorMessage: '请选择获取日期' }],
    },
}

// 删除
const general_custom = ref()
const delSubmit = async () => {
    try {
        general_custom.value.showLoading(true)
        copyForm.credentials.splice(index, 1)
        await saveResume(copyForm)
        toast('操作成功')
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
        params['time'] = params['time'].join('-')
        copyForm.credentials[index] = params
        copyForm.credentials.sort((a, b) => {
            const timeA = new Date(a['time'])
            const timeB = new Date(b['time'])
            if (timeA < timeB) {
                return 1
            } else if (timeA > timeB) {
                return -1
            } else {
                return 0
            }
        })
        await saveResume(copyForm)
        toast('保存成功')
        uni.navigateBack()
    } catch (error) {
        //
    } finally {
        general_custom.value.hideLoading()
    }
}
</script>

<style lang="scss" scoped></style>
