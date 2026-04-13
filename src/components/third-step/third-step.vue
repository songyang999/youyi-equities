<!--
 * @Author: XHL
 * @Date: 2023-01-11
 * @Description: 完善简历第三步
-->
<template>
    <view class="head_box px-32">
        <view class="head_title main-color fs-36 mb-8">最近一份<text>工作经历</text></view>
        <view class="sub-color fs-28">填写越详细, 通过成功率越高哦～(非必填)</view>
    </view>
    <general-forms
        ref="thirdForm"
        :form-data="props.formData"
        :form-list="thirdFormList"
        :rules="rules"
        :show-del="true"
        del-text="上一步"
        save-text="完成"
        @del="prevStep"
        @submit="submit"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import test from '@/utils/test'
import { handleBurialPoint, getDate } from '@/utils/tool'

//	接受父组件传值
const props = defineProps({
    formData: {
        type: Object,
        default: () => {},
    },
})

const init = () => {
    handleBurialPoint('improve_gzjl')
    setFormList()
}

const thirdForm = ref()
defineExpose({ init, thirdForm })

// 在职时间
const employ_date = getDate(40, 0)

// 表单
const thirdFormList = ref<formItemType[]>([])
const setFormList = () => {
    thirdFormList.value = [
        {
            key: 'company_name',
            title: '公司名称',
            type: 'input',
            maxlength: 50,
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
        },
        {
            key: 'job_name',
            title: '职位名称',
            type: 'category',
        },
        {
            key: 'work_describe',
            title: '工作内容',
            type: 'textarea',
            maxlength: 500,
        },
    ]
}

const rules = {
    company_name: {
        rules: [{ validateFunction: test.checkCommonName }],
    },
}

const emit = defineEmits(['prev', 'submit'])
const prevStep = async () => {
    emit('prev')
}
// 第三步提交
const submit = async () => {
    handleBurialPoint('improve_gzjl_save')
    emit('submit')
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
