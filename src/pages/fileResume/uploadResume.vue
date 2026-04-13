<!--
 * @Author: XHL
 * @Date: 2023年8月30日
 * @Description: 上传简历
-->
<template>
    <general-custom title="上传简历">
        <template #content>
            <view class="form-box">
                <view class="upload_title mb-16">
                    <image :src="upload_resume" />
                </view>
                <view class="sub_text fs-32">① 将文件发送至微信文件传输助手、自己或好友</view>
                <view class="sub_text fs-32">② 在本页点击上传，选择刚发送文件的聊天对象</view>
                <view class="sub_text fs-32">③ 选择文件，点击确定即可上传成功</view>
                <view class="upload_demo">
                    <image :src="upload_demo" />
                </view>
            </view>
            <view v-if="progress" class="progress_box flex align-center justify-center">
                <no-data :type="2" bar-src="progress_bar.png" text="正在上传文件" />
            </view>
            <view class="footer-box">
                <view class="footer py-24 px-32">
                    <button type="primary" hover-class="none" class="fs-28" @click="uploadResume">立即上传</button>
                </view>
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onUnload } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { uploadResumeAnnex, saveUpload } from '@/api/resume'
import { prefixedUrl, toast } from '@/utils/tool'

const { config } = getApp().globalData as GlobalDataType
const upload_resume = computed(() => prefixedUrl(`${config.APP_TYPE}_upload_resume.png`))
const upload_demo = computed(() => prefixedUrl(`${config.APP_TYPE}_upload_demo.png`))

const progress = ref(false)
// 上传简历
const uploadResume = () => {
    progress.value = true
    uni.chooseMessageFile({
        count: 1, //限制选择的文件数量
        type: 'all', //非图片和视频的文件,不选默认为all
        success: async (res) => {
            const tempFile = res.tempFiles && res.tempFiles[0] && res.tempFiles[0]
            console.log(res.tempFiles)
            const regex = /\.(pdf|PDF|jpg|JPG|jpeg|JPEG)$/i
            if (!regex.test(tempFile.path)) {
                toast('仅支持pdf，jpg，jpeg格式')
                failError()
                return
            }
            if (tempFile.size > 20 * 1000000) {
                toast('文件大小不能超过20M')
                failError()
                return
            }
            try {
                const res: any = await uploadResumeAnnex(tempFile.path)
                if (res.data) {
                    saveSubmit(res.data.annex_id)
                }
            } catch (error) {
                failError()
            }
        },
        fail: () => {
            failError()
        },
    })
}
// 保存附件简历
const saveSubmit = async (annex_id) => {
    try {
        const { uid: personnel_id } = getApp().globalData as GlobalDataType
        const params = {
            personnel_id,
            annex_id,
            resume_action: 1,
        }
        const res: any = await saveUpload(params)
        if (res.data) {
            toast('上传成功')
            failError()
            setTimeout(() => {
                uni.navigateBack()
            }, 1000)
        } else {
            failError()
        }
    } catch (error) {
        failError()
    }
}
const failError = () => {
    progress.value = false
}

onUnload(() => {
    failError()
})
</script>

<style lang="scss" scoped>
.upload_title {
    image {
        display: block;
        width: 197rpx;
        height: 48rpx;
    }
}
.sub_text {
    line-height: 56rpx;
    color: $--color-primary;
    opacity: 0.75;
}
.upload_demo {
    width: 560rpx;
    height: 938rpx;
    margin: 32rpx auto;
    image {
        display: block;
        width: 100%;
        height: 100%;
    }
}
.progress_box {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    background-color: #fff;
}
</style>
