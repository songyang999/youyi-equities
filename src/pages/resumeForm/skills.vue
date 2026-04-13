<!--
 * @Author: XHL
 * @Date: 2023-08-28
 * @Description: 专业技能
-->
<template>
    <general-custom ref="general_custom" title="专业技能">
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
import { saveResume } from '@/api/resume'
import test from '@/utils/test'
import { getResumeInfo, toast } from '@/utils/tool'
const { commonConst } = getApp().globalData as GlobalDataType

let index = 0
onLoad(async (query: any) => {
    index = +query.index
    await getResume()
})

let copyForm: any = {}
const formData = reactive<any>({
    skill_name: '',
    skill_duration: '',
    skill_level: null,
    skill_level_format: '',
})
let skillList: Array<any> = []
const showDel = ref(false)
const loading = ref(true)
const getResume = async () => {
    try {
        const res: any = await getResumeInfo()
        if (res) {
            copyForm = JSON.parse(JSON.stringify(res))
            showDel.value = res.skills.length > 1
            skillList = res.skills
            if (res.skills.length && res.skills[index]) {
                for (const key in res.skills[index]) {
                    formData[key] = res.skills[index][key] === 0 ? null : res.skills[index][key]
                }
            }
        }
    } catch (error) {
        //
    } finally {
        loading.value = false
    }
}

const formList = [
    {
        key: 'skill_name',
        title: '技能名称',
        type: 'input',
        maxlength: 20,
        required: true,
    },
    {
        key: 'skill_duration',
        title: '使用时长',
        type: 'input',
        maxlength: 4,
        append: '月',
        required: true,
    },
    {
        key: 'skill_level',
        format: 'skill_level_format',
        title: '掌握情况',
        type: 'select',
        label: 'val',
        value: 'key',
        options: commonConst.skill_level || [],
        required: true,
    },
]

// 校验同名
const checkDoubleName = (rule, value, data, callback) => {
    if (value) {
        for (let i = 0; i < skillList.length; i++) {
            if (i !== index && skillList[i]['skill_name'] === value) {
                callback('技能名称不能重复')
            }
        }
        return true
    }
    return true
}

const rules = {
    skill_name: {
        rules: [
            { required: true, errorMessage: '请输入技能名称' },
            { validateFunction: test.checkCommonName },
            { validateFunction: checkDoubleName },
        ],
    },
    skill_duration: {
        rules: [{ required: true, errorMessage: '请输入使用时长' }, { validateFunction: test.checkDigits }],
    },
    skill_level: {
        rules: [{ required: true, errorMessage: '请选择掌握情况' }],
    },
}

// 删除
const general_custom = ref()
const delSubmit = async () => {
    try {
        general_custom.value.showLoading(true)
        copyForm.skills.splice(index, 1)
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
        params['skill_duration'] = +params['skill_duration']
        if (copyForm.skills.length) {
            copyForm.skills.splice(index, 1)
            copyForm.skills.unshift(params)
        } else {
            copyForm.skills = [params]
        }
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
