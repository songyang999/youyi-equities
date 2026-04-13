<!--
 * @Author: XHL
 * @Date: 2024-01-10
 * @Description: 完善简历
-->
<template>
    <!-- 完善简历 -->
    <popup-bottom ref="resume" :is-back-click="false" @click.stop="">
        <template #content>
            <view :style="{ height: popupHeight + 'px' }" class="perfect_wrap pr">
                <view
                    :style="{
                        backgroundImage: `url(${head_bac})`,
                    }"
                    class="popup_head flex align-center justify-center px-32 pt-32 pr"
                >
                    <view class="popup_title main-color fs-34">完善简历</view>
                    <view v-if="props.type === 1" class="skip_btn primary-color fs-28" @click="close">跳过</view>
                    <view v-else class="close_btn fs-24" @click="close">
                        <svg-icon icon-class="close" />
                    </view>
                </view>
                <view class="form_wrap">
                    <first-step
                        v-show="steps === 1"
                        ref="first_step"
                        :form-data="firstForm"
                        @next="nextStep"
                        @update="getAnnexParse"
                    />
                    <second-step
                        v-show="steps === 2"
                        ref="second_step"
                        :form-data="secondForm"
                        @prev="prevStep"
                        @next="nextStep"
                    />
                    <third-step
                        v-show="steps === 3"
                        ref="third_step"
                        :form-data="thirdForm"
                        @prev="prevStep"
                        @submit="submitHandle"
                    />
                </view>
            </view>
        </template>
    </popup-bottom>
    <general-loading v-if="loading" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { prefixedUrl, getResumeInfo, handleBurialPoint, getCurrentArr, toast, getSortTime } from '@/utils/tool'
import { annexParse, saveResume } from '@/api/resume'
const popupHeight = uni.getWindowInfo()['windowHeight'] * 0.7
const head_bac = computed(() => prefixedUrl('general_custom_bac.jpg'))

//	接受父组件传值
const props = defineProps({
    type: {
        type: Number,
        default: () => 1,
    },
    data: {
        // 职位详情打开传入职位类型
        type: Object,
        default: () => {},
    },
})

const resume = ref()
const first_step = ref()
const second_step = ref()
const third_step = ref()
const steps = ref(1)
const init = () => {
    steps.value = 1
    getResume()
    nextTick(() => {
        first_step.value.init()
    })
}

const updateInfo = () => {
    const { textArea, category } = getApp().globalData as GlobalDataType
    for (const key in textArea) {
        thirdForm[key] = textArea[key]
    }
    for (const key in category) {
        if (steps.value === 2) {
            secondForm[key] = category[key]
        } else if (steps.value === 3) {
            thirdForm[key] = category[key]
        }
    }
}

defineExpose({ resume, init, updateInfo })

const emit = defineEmits(['close'])

const close = () => {
    handleBurialPoint('improve_qzxx_tg')
    clearGlobalData()
    clearValidate()
    resume.value.forceClose()
    emit('close')
}

// 简历信息
let copyForm: any = {}
const firstForm = reactive<any>({
    name: '',
    gender: 1,
    birthday: [],
    education: null,
    education_format: '',
})
const secondForm = reactive<any>({
    current_status: null,
    expect_category_ids: [],
    expect_category_ids_format: [],
    current_expect_city: [],
})
const thirdForm = reactive<any>({
    company_name: '',
    employ_start_date: [],
    employ_end_date: [],
    job_name: [],
    work_describe: '',
})
const getResume = async () => {
    try {
        const res: any = await getResumeInfo()
        if (res) {
            formFormat(res)
        }
    } catch (error) {
        //
    }
}
const getAnnexParse = async (annex_id) => {
    try {
        loading.value = true
        const res: any = await annexParse({ annex_id })
        if (res.data) formFormat(res.data)
    } catch (error) {
        loading.value = false
    }
}

const formFormat = (res) => {
    copyForm = JSON.parse(JSON.stringify(res))
    // 第一步
    firstForm['name'] = res['name']
    firstForm['gender'] = res['gender']
    if (res['birthday']) {
        firstForm['birthday'] = res['birthday'].split('-')
    } else {
        firstForm['birthday'] = []
    }
    firstForm['education'] = res['education']
    firstForm['education_format'] = res['education_format']

    // 第二步
    const expect = res.expect_job_info
    for (const key in expect) {
        secondForm[key] = expect[key]
    }
    secondForm['current_status'] = res['current_status'] || null
    if (
        expect['expect_category_major_id'] &&
        expect['expect_category_minor_id'] &&
        expect['expect_category_detail_id']
    ) {
        secondForm['expect_category_ids'] = [
            expect['expect_category_major_id'],
            expect['expect_category_minor_id'],
            expect['expect_category_detail_id'],
        ]
        secondForm['expect_category_ids_format'] = [
            expect['expect_category_major_name'],
            expect['expect_category_minor_name'],
            expect['expect_category_detail_name'],
        ]
    } else {
        secondForm['expect_category_ids'] = []
        secondForm['expect_category_ids_format'] = []
    }
    // 职位详情打开，如果没选择职位，自动覆盖
    if (
        secondForm['expect_category_ids'].length === 0 &&
        props.data['category_major_id'] &&
        props.data['category_minor_id'] &&
        props.data['category_detail_id']
    ) {
        secondForm['expect_category_ids'] = [
            props.data['category_major_id'],
            props.data['category_minor_id'],
            props.data['category_detail_id'],
        ]
        secondForm['expect_category_ids_format'] = [
            props.data['category_major_name'],
            props.data['category_minor_name'],
            props.data['category_detail_name'],
        ]
    }
    const { cityList, categoryList } = getApp().globalData as GlobalDataType
    if (expect['current_expect_city']) {
        secondForm['current_expect_city'] = getCurrentArr(expect['current_expect_city'], cityList)
    } else secondForm['current_expect_city'] = []
    // 第三步
    if (res.employments_info.length && res.employments_info[0]) {
        for (const key in res.employments_info[0]) {
            thirdForm[key] = res.employments_info[0][key]
        }
        if (thirdForm['job_name']) {
            thirdForm['job_name'] = getCurrentArr(thirdForm['job_name'], categoryList, 3)
        } else {
            thirdForm['job_name'] = []
        }
        if (thirdForm['employ_start_date']) {
            thirdForm['employ_start_date'] = thirdForm['employ_start_date'].split('-')
        }
        if (thirdForm['employ_end_date']) {
            thirdForm['employ_end_date'] = thirdForm['employ_end_date'].split('-')
        }
    }
    loading.value = false
}

const prevStep = () => {
    steps.value -= 1
    initData()
}
const nextStep = () => {
    console.log('secondForm', secondForm.expect_category_ids)
    console.log('secondForm', secondForm.expect_category_ids_format)
    steps.value += 1
    initData()
}

const initData = () => {
    clearGlobalData()
    clearValidate()
    nextTick(() => {
        if (steps.value === 1) {
            first_step.value.init()
        } else if (steps.value === 2) {
            second_step.value.init()
        } else if (steps.value === 3) {
            third_step.value.init()
        }
    })
}

const loading = ref(false)
// 提交
const submitHandle = async () => {
    try {
        loading.value = true
        const params = JSON.parse(JSON.stringify(copyForm))
        for (const key in firstForm) {
            params[key] = firstForm[key]
        }
        params.birthday = params.birthday.length ? params.birthday.join('-') : ''
        params.current_status = secondForm['current_status']
        if (secondForm['expect_category_ids'].length) {
            params['expect_job_info']['expect_category_major_id'] = secondForm['expect_category_ids'][0]
            params['expect_job_info']['expect_category_minor_id'] = secondForm['expect_category_ids'][1]
            params['expect_job_info']['expect_category_detail_id'] = secondForm['expect_category_ids'][2]
            params['expect_job_info']['current_expect_job'] = secondForm['expect_category_ids_format'][2]
        }
        if (secondForm['current_expect_city'].length) {
            params['expect_job_info']['current_expect_city'] = secondForm['current_expect_city'][1]
        }
        const employForm = JSON.parse(JSON.stringify(thirdForm))
        if (employForm['job_name'].length) {
            employForm['job_name'] = employForm['job_name'][2]
        } else {
            employForm['job_name'] = ''
        }
        if (employForm['employ_start_date'].length) {
            employForm['employ_start_date'] = employForm['employ_start_date'].join('-')
        } else {
            employForm['employ_start_date'] = ''
        }

        if (employForm['employ_end_date'].length) {
            employForm['employ_end_date'] = employForm['employ_end_date'].join('-')
        } else if (employForm['employ_start_date']) {
            employForm['employ_end_date'] = '至今'
        } else {
            employForm['employ_end_date'] = ''
        }
        if (
            employForm['employ_end_date'] !== '至今' &&
            new Date(employForm['employ_start_date']) > new Date(employForm['employ_end_date'])
        ) {
            toast('结束时间不可以小于开始时间')
            loading.value = false
            return
        }
        if (params.employments_info && params.employments_info.length) {
            params.employments_info[0] = employForm
        } else {
            params.employments_info = [employForm]
        }
        params.employments_info.sort((a, b) => getSortTime(a, b, 'employ_start_date', 'employ_end_date'))

        const globalData = getApp().globalData as GlobalDataType
        if (globalData.shareData.job_id && globalData.shareData.sharer_id) {
            params.sharer_id = globalData.shareData.sharer_id
            if (globalData.shareData.ut === 1) params.job_id = globalData.shareData.job_id
            else {
                params.ats_job_id = globalData.shareData.job_id
                params.lease_id = globalData.shareData.lease_id
            }
        }
        if (!params.phone) params.phone = globalData.phone
        await saveResume(params)
        clearGlobalData()
        resume.value.forceClose()
        emit('close', true)
    } catch (error) {
        //
    } finally {
        loading.value = false
    }
}

const clearGlobalData = () => {
    const globalData = getApp().globalData as GlobalDataType
    globalData.textArea = {}
    globalData.category = {}
}
const clearValidate = () => {
    steps.value === 1 && first_step.value.firstForm.ruleForm.clearValidate()
    steps.value === 2 && second_step.value.secondForm.ruleForm.clearValidate()
    steps.value === 3 && third_step.value.thirdForm.ruleForm.clearValidate()
}
</script>

<style scoped lang="scss">
.perfect_wrap {
    box-sizing: border-box;
    padding-top: 112rpx;
}
.form_wrap {
    height: 100%;
    overflow-y: auto;
    position: relative;
}
.popup_head {
    width: 100%;
    height: 176rpx;
    padding-bottom: 96rpx;
    box-sizing: border-box;
    background-size: 100% 100%;
    border-radius: 32rpx 32rpx 0 0;
    position: absolute;
    top: 0;
    .skip_btn {
        padding: 32rpx;
        line-height: 48rpx;
        position: absolute;
        right: 0;
        top: 0;
    }
    .close_btn {
        padding: 44rpx 32rpx;
        position: absolute;
        right: 0;
        top: 0;
    }
}
.popup_title {
    font-weight: 600;
}
</style>
