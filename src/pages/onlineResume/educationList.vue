<!--
 * @Author: XHL
 * @Date: 2023-08-29
 * @Description: 教育经历
-->
<template>
    <general-custom title="教育经历">
        <template #content>
            <view :class="{ 'no-bottom-form-box': educations_info.length >= 10 }" class="form-box">
                <view
                    v-for="(item, index) in educations_info"
                    :key="index"
                    class="resume_box pb-32 mb-32"
                    @click="goPage(`/pages/resumeForm/educations?index=${index}`)"
                >
                    <view class="flex justify-between align-center">
                        <view class="form_title fs-32 line_ovh">{{ item.school_name }}</view>
                        <view class="flex align-center">
                            <view v-if="item.education_start_date" class="common_text fs-26 mr-8">{{
                                dateFormat(item.education_start_date, item.education_end_date)
                            }}</view>
                            <svg-icon icon-class="next" class="fs-30" />
                        </view>
                    </view>
                    <view v-if="eduFormat(item)" class="common_text fs-26 mt-12">
                        <text>{{ eduFormat(item) }}</text>
                    </view>
                </view>
            </view>
            <view v-if="educations_info.length < 10" class="footer-box">
                <view class="footer py-24 px-32">
                    <button
                        type="primary"
                        hover-class="none"
                        class="fs-28"
                        @click="goPage(`/pages/resumeForm/educations?index=${educations_info.length}`)"
                    >
                        新增教育经历
                    </button>
                </view>
            </view>
        </template>
    </general-custom>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { goPage, getResumeInfo, dateFormat, eduFormat } from '@/utils/tool'

onShow(() => {
    getResume()
})

// 简历详情
const educations_info = ref<any[]>([])

const getResume = async () => {
    const res: any = await getResumeInfo()
    if (res) {
        educations_info.value = res.educations_info
    }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
