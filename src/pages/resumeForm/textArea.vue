<template>
    <general-custom :title="title">
        <template #content>
            <scroll-view
                :style="{ top: customHeaderHeight + 'px', bottom: bottomVal + 'px' }"
                scroll-y
                class="area_box px-32 pt-32"
            >
                <textarea
                    v-model="form[key]"
                    :adjust-position="false"
                    :placeholder="'请输入' + title"
                    :show-confirm-bar="false"
                    :maxlength="10000"
                    :auto-focus="true"
                    class="message_input"
                    rows="10"
                    @focus="messageFocus"
                    @blur="messageBlur"
                >
                </textarea>
                <view class="area_length flex justify-end fs-26">
                    <text>
                        <text :class="{ error_color: form[key]?.length > maxlength }">{{ form[key]?.length || 0 }}</text
                        >/{{ maxlength }}
                    </text>
                    <button
                        v-if="showblur"
                        :disabled="!form[key] || form[key]?.length > maxlength"
                        class="complete"
                        type="primary"
                        hover-class="none"
                        @click="submit"
                    >
                        完成
                    </button>
                </view>
            </scroll-view>

            <view class="footer-box">
                <view class="footer py-24 px-32">
                    <button
                        :disabled="!form[key] || form[key]?.length > maxlength"
                        type="primary"
                        hover-class="none"
                        class="fs-28"
                        @click="submit"
                    >
                        保存
                    </button>
                </view>
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onReady } from '@dcloudio/uni-app'
import { ref, reactive } from 'vue'
import { getDomHeight } from '@/utils/tool'

const { customHeaderHeight } = getApp().globalData as GlobalDataType

const title = ref<string>('')
const key = ref<string>('')
const maxlength = ref<number | string>(0)
const form = reactive<any>({})
onLoad(async (query: any) => {
    title.value = query.title
    key.value = query.key
    maxlength.value = +query.length
    uni.setNavigationBarTitle({ title: query.title })
    const { textArea } = getApp().globalData as GlobalDataType
    form[key.value] = textArea[key.value] || ''
})

const bottomVal = ref(0)
const showblur = ref(false)
onReady(async () => {
    bottomVal.value = await getDomHeight('footer-box')
    showblur.value = true
})

const messageFocus = (e: any) => {
    bottomVal.value = e.detail.height
    showblur.value = true
}
const messageBlur = async () => {
    bottomVal.value = await getDomHeight('footer-box')
    showblur.value = false
}

// 提交
const submit = () => {
    const globalData = getApp().globalData as GlobalDataType
    globalData['textArea'][key.value] = form[key.value] || ''
    uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.area_box {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
    .message_input {
        width: 100%;
        height: calc(100% - 30px);
    }
}
.area_length {
    width: 100%;
    height: 30px;
    line-height: 26px;
    box-sizing: border-box;
    padding-bottom: 4px;
    text-align: right;
    color: $--color-sub;
    .complete {
        // font-size: 26rpx;
        height: 26px;
        line-height: 24px;
        border-radius: 6px;
        margin: 0 0 0 10rpx;
    }
}
.error_color {
    color: $--color-danger;
}
</style>
