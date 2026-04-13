<!--
 * @Author: XHL
 * @Date: 2023年8月30日
 * @Description: 查看附件简历
-->
<template>
    <view>
        <web-view :src="annex_info.annex_url"></web-view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { reactive } from 'vue'
import { getAnnexDetail } from '@/api/resume'

const annex_info = reactive({
    id: 0,
    annex_id: 0,
    annex_name: '',
    annex_url: '',
})
onLoad((query: any) => {
    annex_info.id = +query.id
    annex_info.annex_name = query.name
    getFileDetail()
})
// 简历列表

const getFileDetail = async () => {
    try {
        const { uid: personnel_id } = getApp().globalData as GlobalDataType
        const params = {
            id: annex_info.id,
            personnel_id,
        }
        const res: any = await getAnnexDetail(params)
        if (res.data && res.data.annex_info) {
            annex_info.annex_id = res.data.annex_info.annex_id
            annex_info.annex_url = res.data.annex_info.annex_url
            uni.setNavigationBarTitle({ title: annex_info.annex_name })
        }
    } catch (error) {
        //
    }
}
</script>

<style lang="scss" scoped>
.file_img {
    width: 100%;
    display: inline-block;
    margin-bottom: 16rpx;
}
</style>
