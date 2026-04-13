<!--
 * @Author: XHL
 * @Date: 2023-08-29
 * @Description: 工作经历
-->
<template>
    <general-custom title="工作经历">
        <template #content>
            <view :class="{ 'no-bottom-form-box': employments_info.length >= 10 }" class="form-box">
                <view
                    v-for="(item, index) in employments_info"
                    :key="index"
                    class="resume_box pb-32 mb-32"
                    @click="goPage(`/pages/resumeForm/employment?index=${index}`)"
                >
                    <view class="flex justify-between align-center">
                        <view class="form_title fs-32 line_ovh">{{ item.company_name }}</view>
                        <view class="flex align-center">
                            <view v-if="item.employ_start_date" class="common_text fs-26 mr-8">{{
                                dateFormat(item.employ_start_date, item.employ_end_date)
                            }}</view>
                            <svg-icon icon-class="next" class="fs-30" />
                        </view>
                    </view>
                    <view v-if="item.job_name" class="form_title fs-28 line_ovh my-12">{{ item.job_name }}</view>
                    <view v-if="item.work_describe" class="common_text fs-26">
                        <text>{{ item.work_describe }}</text>
                    </view>
                </view>
            </view>
            <view v-if="employments_info.length < 10" class="footer-box">
                <view class="footer py-24 px-32">
                    <button
                        type="primary"
                        hover-class="none"
                        class="fs-28"
                        @click="goPage(`/pages/resumeForm/employment?index=${employments_info.length}`)"
                    >
                        新增工作经历
                    </button>
                </view>
            </view>
        </template>
    </general-custom>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { goPage, getResumeInfo, dateFormat } from '@/utils/tool'

onShow(() => {
    getResume()
})

// 简历详情
const employments_info = ref<any[]>([])

const getResume = async () => {
    const res: any = await getResumeInfo()
    if (res) {
        employments_info.value = res.employments_info
    }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
