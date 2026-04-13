<!--
 * @Author: XHL
 * @Date: 2023-08-29
 * @Description: 所获证书
-->
<template>
    <general-custom title="所获证书">
        <template #content>
            <view :class="{ 'no-bottom-form-box': credentials.length >= 5 }" class="form-box">
                <view
                    v-for="(item, index) in credentials"
                    :key="index"
                    class="resume_box pb-32 mb-32"
                    @click="goPage(`/pages/resumeForm/credentials?index=${index}`)"
                >
                    <view class="flex justify-between align-center">
                        <view class="form_title fs-32 line_ovh">{{ item.name }}</view>
                        <view class="flex align-center">
                            <view class="common_text fs-26 mr-8">{{ item.time }}</view>
                            <svg-icon icon-class="next" class="fs-30" />
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="credentials.length < 5" class="footer-box">
                <view class="footer py-24 px-32">
                    <button
                        type="primary"
                        hover-class="none"
                        class="fs-28"
                        @click="goPage(`/pages/resumeForm/credentials?index=${credentials.length}`)"
                    >
                        新增所获证书
                    </button>
                </view>
            </view>
        </template>
    </general-custom>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { goPage, getResumeInfo } from '@/utils/tool'

onShow(() => {
    getResume()
})

// 简历详情
const credentials = ref<any[]>([])

const getResume = async () => {
    const res: any = await getResumeInfo()
    if (res) {
        credentials.value = res.credentials
    }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
