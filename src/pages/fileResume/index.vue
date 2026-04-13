<!--
 * @Author: XHL
 * @Date: 2023年8月2日
 * @Description: 附件简历
-->
<template>
    <general-custom ref="general_custom" title="附件简历">
        <template #content>
            <view v-if="annex_info.id" class="file_box py-40 px-32 flex justify-between align-center" @click="viewFile">
                <view class="flex align-center">
                    <svg-icon :icon-class="file" class="file_icon" />
                    <view class="ml-24">
                        <view class="form_title line_ovh fs-32">{{ annex_info.annex_name }}</view>
                        <view class="common_text fs-26 mt-12">更新时间：{{ annex_info.update_time }}</view>
                    </view>
                </view>
                <svg-icon icon-class="next" class="fs-30" />
            </view>
            <view v-else class="no_data_box">
                <no-data text="暂无附件简历" />
            </view>

            <view class="footer-box">
                <view class="footer flex py-24 px-32">
                    <template v-if="annex_info.id">
                        <button hover-class="none" class="flex1 fs-28" @click="deleteSubmit">删除简历</button>
                        <button type="primary" hover-class="none" class="flex1 fs-28" @click="toUpload">
                            重新上传
                        </button>
                    </template>
                    <button v-else type="primary" hover-class="none" class="flex1 fs-28" @click="toUpload">
                        上传简历
                    </button>
                </view>
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref, reactive } from 'vue'
import { getPersonInfo } from '@/api/my'
import { getAnnexList, saveUpload } from '@/api/resume'
import { goPage, handleBurialPoint, toast } from '@/utils/tool'
const { config } = getApp().globalData as GlobalDataType
const file = `${config.APP_TYPE}_file`

onShow(async () => {
    handleBurialPoint('online_attached')
    await getPerson()
    await getFileList()
})

const annex_info = reactive({
    id: 0,
    annex_name: '',
    update_time: '',
    annex_id: 0,
    annex_url: '',
})
let file_name = ''
// 用户信息
const getPerson = async () => {
    try {
        const res: any = await getPersonInfo()
        if (res.data) {
            const { personnel_name, phone } = res.data
            file_name = personnel_name || config.NICK_PR + +phone.slice(-6)
        }
    } catch (error) {
        //
    }
}
// 简历列表
const getFileList = async () => {
    try {
        const { uid: personnel_id } = getApp().globalData as GlobalDataType
        const params = {
            page: 1,
            page_num: 10,
            personnel_id,
        }
        const res: any = await getAnnexList(params)
        if (res.data && res.data.list) {
            const info = res.data.list[0]
            annex_info.id = info.id
            annex_info.annex_name = file_name + '.' + info.annex_info.annex_name.split('.')[1]
            annex_info.update_time = info.update_time.replace(/-/g, '.')
            annex_info.annex_id = info.annex_info.annex_id
            annex_info.annex_url = info.annex_info.annex_url
        } else {
            annex_info.id = 0
            annex_info.annex_name = ''
            annex_info.update_time = ''
            annex_info.annex_id = 0
            annex_info.annex_url = ''
        }
    } catch (error) {
        //
    }
}

// 预览
const general_custom = ref()
const viewFile = async () => {
    goPage(`/pages/fileResume/viewResume?id=${annex_info.id}&name=${annex_info.annex_name}`)
    //
    // general_custom.value.showLoading(true)
    // uni.downloadFile({
    //     url: annex_info.annex_url,
    //     success: function (res: any) {
    //         const filePath = res.tempFilePath
    //         uni.openDocument({
    //             filePath: filePath,
    //             success: function (res) {
    //                 general_custom.value.hideLoading()
    //                 console.log('打开文档成功')
    //             },
    //             fail: function (error: any) {
    //                 general_custom.value.hideLoading()
    //                 console.log('open error:', error)
    //                 goPage(`/pages/fileResume/viewResume?id=${annex_info.id}&name=${annex_info.annex_name}`)
    //             },
    //         })
    //     },
    //     fail: function (error: any) {
    //         console.log('down error:', error)
    //         general_custom.value.hideLoading()
    //     },
    // })
}

// 删除附件简历
const deleteSubmit = async () => {
    try {
        const { uid: personnel_id } = getApp().globalData as GlobalDataType
        const params = {
            personnel_id,
            annex_id: annex_info.annex_id,
            resume_action: 2,
        }
        await saveUpload(params)
        toast('操作成功')
        setTimeout(() => {
            getFileList()
        }, 1000)
    } catch (error) {
        //
    }
}

const toUpload = () => {
    handleBurialPoint('online_attached_sc')
    goPage('/pages/fileResume/uploadResume')
}
</script>

<style lang="scss" scoped>
.file_icon {
    font-size: 64rpx;
}
.file_box {
    width: 100%;
    box-sizing: border-box;
}
.form_title {
    max-width: 450rpx;
    font-weight: 600;
    color: $--color-main;
}
.common_text {
    color: $--color-input;
}
.no_data_box {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
</style>
