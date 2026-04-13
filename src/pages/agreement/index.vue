<!--
 * @Author: XHL
 * @Date: 2023年9月16日
 * @Description: 用户协议/隐私指引
-->
<template>
    <view>
        <web-view :src="web_src"></web-view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { prefixedUrl } from '@/utils/tool'
const web_src = ref('')
onLoad((query: any) => {
    const { config } = getApp().globalData as GlobalDataType
    if (+query.type === 1) {
        web_src.value = prefixedUrl(`${config.APP_TYPE}_user_agreement.html`)
        uni.setNavigationBarTitle({ title: '用户协议' })
    } else if (query.link) {
        web_src.value = decodeURIComponent(query.link)
        uni.setNavigationBarTitle({ title: '活动' })
    } else if (query.page === 'wy') {
        web_src.value = decodeURIComponent(
            'https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fprofile_ext%3Faction%3Dhome%26__biz%3DMzI5MzAzODgyNg%3D%3D%23wechat_redirect'
        )
        uni.setNavigationBarTitle({ title: '万云网' })
    } else {
        web_src.value = prefixedUrl(`${config.APP_TYPE}_privacy_agreement.html`)
        uni.setNavigationBarTitle({ title: '隐私指引' })
    }
})
</script>

<style scoped lang="scss"></style>
