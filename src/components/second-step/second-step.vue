<!--
 * @Author: XHL
 * @Date: 2024-01-11
 * @Description: 完善简历第二步
-->
<template>
    <view class="head_box px-32">
        <view class="head_title main-color fs-36 mb-8">您想找份<text>什么工作？</text></view>
        <view class="sub-color fs-28">为你匹配精选优质岗位 (必填)</view>
    </view>
    <general-forms
        ref="secondForm"
        :form-data="props.formData"
        :form-list="secondFormList"
        :rules="rules"
        :show-del="true"
        del-text="上一步"
        save-text="下一步"
        @del="prevStep"
        @submit="submit"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { handleBurialPoint } from '@/utils/tool'

//	接受父组件传值
const props = defineProps({
    formData: {
        type: Object,
        default: () => {},
    },
})

const init = () => {
    handleBurialPoint('improve_jl2')
    setFormList()
}

const secondForm = ref()
defineExpose({ init, secondForm })

// 第二步
const secondFormList = ref<formItemType[]>([])
const setFormList = () => {
    const { commonConst, cityList } = getApp().globalData as GlobalDataType
    secondFormList.value = [
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
            key: 'expect_category_ids',
            format: 'expect_category_ids_format',
            title: '期望职位',
            type: 'category',
            required: true,
        },
        {
            key: 'current_expect_city',
            title: '期望工作城市',
            type: 'twoSelect',
            label: 'name',
            value: 'name',
            lastLevel: true,
            options: cityList,
            required: true,
        },
    ]
}

const rules = {
    current_status: {
        rules: [{ required: true, errorMessage: '请选择求职状态' }],
    },
    expect_category_ids: {
        rules: [{ required: true, errorMessage: '请选择期望职位' }],
    },
    current_expect_city: {
        rules: [{ required: true, errorMessage: '请选择所在城市' }],
    },
}

const emit = defineEmits(['prev', 'next'])
const prevStep = async () => {
    handleBurialPoint('improve_qzxx_next')
    emit('prev')
}

// 第二步提交
const submit = () => {
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
