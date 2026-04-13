<!--
 * @Author: XHL
 * @Date: 2023-08-23
 * @Description: 在线简历
-->
<template>
    <general-custom ref="general_custom" title="在线简历">
        <template #content>
            <view class="form-box">
                <view class="resume_box pb-32 mb-32">
                    <view class="flex justify-between align-center" @click="goPage('/pages/resumeForm/personInfo')">
                        <view class="person_info flex align-center">
                            <image :src="formData.avatar_url || avatar" />
                            <view v-if="formData.name" class="ml-32">
                                <view class="form_title fs-36">{{ formData.name }}</view>
                                <view class="common_text fs-26 mt-8">{{ personFromat(formData) }}</view>
                            </view>
                            <view v-else class="form_title fs-36 ml-32">未填写个人信息</view>
                        </view>
                        <svg-icon v-if="formData.name" icon-class="next" class="fs-30" />
                        <svg-icon v-else :icon-class="edit" class="edit fs-44" />
                    </view>
                </view>
                <view class="resume_box pb-32 mb-32" @click="goPage('/pages/resumeForm/jobIntention')">
                    <view class="flex justify-between align-center">
                        <view class="form_title fs-36">求职意向</view>
                        <svg-icon v-if="formData.current_status" icon-class="next" class="fs-30" />
                        <svg-icon v-else :icon-class="edit" class="edit fs-44" />
                    </view>
                    <view class="common_text fs-26 mt-8">{{ intentionFormat(formData) }}</view>
                </view>
                <view class="resume_box pb-32 mb-32">
                    <view class="flex justify-between align-center" @click="goPage(employUrl)">
                        <view class="form_title fs-36">工作经历</view>
                        <svg-icon v-if="isEmploy" icon-class="next" class="fs-30" />
                        <svg-icon v-else :icon-class="edit" class="edit fs-44" />
                    </view>
                    <view v-if="isEmploy" class="mt-24" @click="goPage('/pages/resumeForm/employment?index=0')">
                        <view class="flex justify-between align-center">
                            <view class="form_title fs-32 line_ovh">{{ employments.company_name }}</view>
                            <view v-if="employments.employ_start_date" class="common_text fs-26">{{
                                dateFormat(employments.employ_start_date, employments.employ_end_date)
                            }}</view>
                        </view>
                        <view class="form_title fs-28 line_ovh my-12">{{ employments.job_name }}</view>
                        <view v-if="employments.work_describe" class="common_text fs-26">
                            <text>{{ employments.work_describe }}</text>
                        </view>
                    </view>
                </view>
                <view class="resume_box pb-32 mb-32">
                    <view class="flex justify-between align-center" @click="goPage(projectUrl)">
                        <view class="form_title fs-36">项目经历</view>
                        <svg-icon v-if="isProject" icon-class="next" class="fs-30" />
                        <svg-icon v-else :icon-class="edit" class="edit fs-44" />
                    </view>
                    <view v-if="isProject" class="mt-24" @click="goPage('/pages/resumeForm/projects?index=0')">
                        <view class="flex justify-between align-center">
                            <view class="form_title fs-32 line_ovh">{{ projects.project_name }}</view>
                            <view v-if="projects.project_start_date" class="common_text fs-26">{{
                                dateFormat(projects.project_start_date, projects.project_end_date)
                            }}</view>
                        </view>
                        <view v-if="projects.project_describe" class="common_text fs-26 mt-12">
                            <text>{{ projects.project_describe }}</text>
                        </view>
                    </view>
                </view>
                <view class="resume_box pb-32 mb-32">
                    <view class="flex justify-between align-center" @click="goPage(eductionUrl)">
                        <view class="form_title fs-36">教育经历</view>
                        <svg-icon v-if="isEducation" icon-class="next" class="fs-30" />
                        <svg-icon v-else :icon-class="edit" class="edit fs-44" />
                    </view>
                    <view v-if="isEducation" class="mt-24" @click="goPage('/pages/resumeForm/educations?index=0')">
                        <view class="flex justify-between align-center">
                            <view class="form_title fs-32 line_ovh">{{ educations.school_name }}</view>
                            <view v-if="educations.education_start_date" class="common_text fs-26">{{
                                dateFormat(educations.education_start_date, educations.education_end_date)
                            }}</view>
                        </view>
                        <view v-if="eduFormat(educations)" class="common_text fs-26 mt-12">
                            <text>{{ eduFormat(educations) }}</text>
                        </view>
                    </view>
                </view>
                <view class="resume_box pb-32 mb-32">
                    <view class="flex justify-between align-center" @click="goPage(skillUrl)">
                        <view class="form_title fs-36">专业技能</view>
                        <svg-icon v-if="isSkill" icon-class="next" class="fs-30" />
                        <svg-icon v-else :icon-class="edit" class="edit fs-44" />
                    </view>
                    <view v-if="isSkill" class="mt-24" @click="goPage('/pages/resumeForm/skills?index=0')">
                        <view class="flex justify-between align-center">
                            <view class="form_title fs-32 line_ovh">{{ skills.skill_name }}</view>
                            <view class="common_text fs-26">{{ skills.skill_level_format }}</view>
                        </view>
                    </view>
                </view>
                <view class="resume_box pb-32">
                    <view class="flex justify-between align-center" @click="goPage(credentialUrl)">
                        <view class="form_title fs-36">所获证书</view>
                        <svg-icon v-if="isCredential" icon-class="next" class="fs-30" />
                        <svg-icon v-else :icon-class="edit" class="edit fs-44" />
                    </view>
                    <view v-if="isCredential" class="mt-24" @click="goPage('/pages/resumeForm/credentials?index=0')">
                        <view class="flex justify-between align-center">
                            <view class="form_title fs-32 line_ovh">{{ credentials.name }}</view>
                            <view class="common_text fs-26">{{ credentials.time.replace(/-/g, '.') }}</view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 暂时隐藏 -->
            <!-- <view class="footer-box">
                <view class="footer py-24 px-32">
                    <button type="primary" hover-class="none" class="fs-28" @click="toFile">导入简历</button>
                </view>
            </view> -->
        </template>
    </general-custom>
</template>

<script lang="ts" setup>
import { onShow, onReady, onUnload } from '@dcloudio/uni-app'
import { computed, ref, reactive } from 'vue'
import { goPage, handleBurialPoint, prefixedUrl, getResumeInfo, dateFormat, eduFormat } from '@/utils/tool'
import dayjs from 'dayjs'

const { config } = getApp().globalData as GlobalDataType
const avatar = computed(() => prefixedUrl(`${config.APP_TYPE}_avatar.png`))
const edit = `${config.APP_TYPE}_edit`

const general_custom = ref()
let loading = false
onShow(() => {
    getResume()
})

// 简历详情
const formData = reactive<any>({})
const isEmploy = ref(false)
const employments = ref<any>({})
const isProject = ref(false)
const projects = ref<any>({})
const isEducation = ref(false)
const educations = ref<any>({})
const isSkill = ref(false)
const skills = ref<any>({})
const isCredential = ref(false)
const credentials = ref<any>({})
const getResume = async () => {
    loading = true
    const res: any = await getResumeInfo()
    if (res) {
        for (const key in res) {
            formData[key] = res[key]
        }
        isEmploy.value = formData.employments_info && formData.employments_info.length
        if (isEmploy.value) employments.value = formData.employments_info[0]
        isProject.value = formData.projects_info && formData.projects_info.length
        if (isProject.value) projects.value = formData.projects_info[0]
        isEducation.value = formData.educations_info && formData.educations_info.length
        if (isEducation.value) educations.value = formData.educations_info[0]
        isSkill.value = formData.skills && formData.skills.length
        if (isSkill.value) skills.value = formData.skills[0]
        isCredential.value = formData.credentials && formData.credentials.length
        if (isCredential.value) credentials.value = formData.credentials[0]
        loading = false
    } else {
        loading = false
    }
}

onReady(() => {
    handleBurialPoint('online_resume')
    general_custom.value.showLoading()
    hideLoading()
})

let timer: any = null
const hideLoading = () => {
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
        if (!loading) {
            clearInterval(timer)
            general_custom.value.hideLoading()
        }
    }, 300)
}

onUnload(() => {
    clearInterval(timer)
})

const employUrl = computed(() =>
    isEmploy.value ? '/pages/onlineResume/employmentList' : '/pages/resumeForm/employment?index=0'
)
const projectUrl = computed(() =>
    isProject.value ? '/pages/onlineResume/projectList' : '/pages/resumeForm/projects?index=0'
)
const eductionUrl = computed(() =>
    isEducation.value ? '/pages/onlineResume/educationList' : '/pages/resumeForm/educations?index=0'
)
const skillUrl = computed(() => (isSkill.value ? '/pages/onlineResume/skillList' : '/pages/resumeForm/skills?index=0'))
const credentialUrl = computed(() =>
    isCredential.value ? '/pages/onlineResume/credentialList' : '/pages/resumeForm/credentials?index=0'
)

// 基本信息
const personFromat = (form) => {
    let format = ''
    const end = dayjs()
    if (form.start_year_of_employment) {
        const start = dayjs(form.start_year_of_employment)
        format = end.diff(start, 'year') > 0 ? `工作${end.diff(start, 'year')}年` : '1年以内'
    }
    if (form.birthday) {
        const start = dayjs(form.birthday)
        format += format ? ` · ${end.diff(start, 'year')}岁` : `${end.diff(start, 'year')}岁`
    }
    if (form.education) {
        format += format ? ` · ${form.education_format}` : `${form.education_format}`
    }
    return format
}
// 求职意向
const intentionFormat = (form) => {
    let format = ''
    if (form.expect_job_info && form.expect_job_info.current_expect_job) {
        format = form.expect_job_info.current_expect_job
    }
    if (form.expect_job_info && form.expect_job_info.current_expect_city) {
        format += format ? ` · ${form.expect_job_info.current_expect_city}` : form.expect_job_info.current_expect_city
    }
    if (form.current_status) {
        format += format ? ` · ${form.current_status_format}` : form.current_status_format
    }
    return format
}
// 导入简历 暂时隐藏
// const toFile = () => {
//     handleBurialPoint('online_resume_dr')
//     goPage('/pages/fileResume/index')
// }
</script>

<style lang="scss" scoped>
.form-box {
    padding-bottom: 32rpx;
    padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}
.resume_box {
    border-bottom: 1px solid $--color-border;
    &:last-child {
        border-bottom: 0;
    }
    .form_title {
        max-width: 450rpx;
        font-weight: 600;
        color: $--color-main;
    }
    .person_info {
        flex: 1;
        > image {
            display: inline-block;
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
        }
    }
    .common_text {
        color: $--color-input;
        word-break: break-all;
        white-space: pre-line;
    }
}
.edit {
    position: relative;
    top: 2rpx;
}
</style>
