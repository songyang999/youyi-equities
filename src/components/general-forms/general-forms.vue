<!--
 * @Author: XHL
 * @Date: 2023-08-24
 * @Description: form 表单组件
-->
<template>
    <view class="form-box">
        <uni-forms
            ref="ruleForm"
            :model-value="props.formData"
            :rules="rules"
            validate-trigger="blur"
            label-position="top"
            label-width="100%"
        >
            <template v-for="(item, index) in formList" :key="index">
                <uni-forms-item v-if="item.type === 'slot'" :key="item.key + '_' + index" :name="item.key">
                    <template #label></template>
                    <slot :name="item.key" :data="form" />
                </uni-forms-item>
                <uni-forms-item
                    v-else
                    :key="item.key + '2_' + index"
                    :name="item.key"
                    :rules="rules[item.key] && rules[item.key]['rules']"
                >
                    <template #label>
                        <slot v-if="item.slotLabel" :name="item.key" />
                        <view class="uni-forms-item__label">
                            <text>{{ item.title }}</text>
                            <text v-if="item.required" class="is-required">*</text>
                        </view>
                    </template>
                    <view v-if="item.type === 'input'" class="input-box flex justify-between align-center">
                        <input
                            v-model="form[item.key]"
                            :maxlength="item.maxlength"
                            :placeholder="item.placeholder ? item.placeholder : '请输入' + item.title"
                            :disabled="item.disabled"
                            :class="{ disabled_text: item.disabled }"
                            :placeholder-style="`font-size: ${placeholderSize}px;color:#A4AFC1;`"
                            class="input fs-28 flex1"
                            type="text"
                            @blur="item.blur"
                            @input="setInputVal(form, item)"
                        />
                        <view v-if="item.append" class="append">{{ item.append }}</view>
                        <view v-if="item.clearable && form[item.key]" class="clearable" @click="clearInput(item.key)">
                            <image :src="close" mode="aspectFit" />
                        </view>
                    </view>
                    <view
                        v-else-if="item.type === 'textarea'"
                        class="form_content input-box flex justify-between"
                        @click="gotoTextarea(item)"
                    >
                        <view v-if="form[item.key]" class="main_text">
                            <text>{{ form[item.key] }}</text>
                        </view>
                        <view v-else class="common_text">
                            {{ item.placeholder ? item.placeholder : '请输入' + item.title }}
                        </view>
                        <view class="svg_box flex align-center">
                            <svg-icon icon-class="next" class="fs-30" />
                        </view>
                    </view>
                    <view
                        v-else-if="item.type === 'category'"
                        class="form_content input-box flex justify-between"
                        @click="gotoCategory(item)"
                    >
                        <view v-if="form[item.key] && form[item.key].length" class="main_text">
                            <text>{{ item.format ? form[item.format][2] : form[item.key][2] }}</text>
                        </view>
                        <view v-else class="common_text">
                            {{ item.placeholder ? item.placeholder : '请选择' + item.title }}
                        </view>
                        <view class="svg_box flex align-center">
                            <svg-icon icon-class="next" class="fs-30" />
                        </view>
                    </view>
                    <view
                        v-else-if="item.type === 'select'"
                        class="form_content input-box flex justify-between align-center"
                        @click="openOnePicker(item)"
                    >
                        <view v-if="form[item.key]" class="main_text">
                            {{ item.format ? form[item.format] : form[item.key] }}
                        </view>
                        <view v-else class="common_text">
                            {{ item.placeholder ? item.placeholder : '请选择' + item.title }}
                        </view>
                        <svg-icon icon-class="next" class="fs-30" />
                    </view>
                    <view
                        v-else-if="item.type === 'twoSelect'"
                        class="form_content input-box flex justify-between align-center"
                        @click="openTwoPicker(item)"
                    >
                        <view v-if="form[item.key] && form[item.key].length" class="main_text">
                            <template v-if="item.format">
                                {{
                                    item.lastLevel
                                        ? form[item.format][1]
                                        : form[item.format][0] === form[item.format][1]
                                        ? form[item.format][1]
                                        : form[item.format].join(item.joinmark)
                                }}
                            </template>
                            <template v-else>
                                {{ item.lastLevel ? form[item.key][1] : form[item.key].join(item.joinmark) }}
                            </template>
                        </view>
                        <view v-else class="common_text">
                            {{ item.placeholder ? item.placeholder : '请选择' + item.title }}
                        </view>
                        <svg-icon icon-class="next" class="fs-30" />
                    </view>
                    <view
                        v-else-if="item.type === 'threeSelect'"
                        class="form_content input-box flex justify-between align-center"
                        @click="openThreePicker(item)"
                    >
                        <view v-if="form[item.key] && form[item.key].length" class="main_text">
                            <template v-if="item.format">
                                {{ item.lastLevel ? form[item.format][2] : form[item.format].join(item.joinmark) }}
                            </template>
                            <template v-else>
                                {{ item.lastLevel ? form[item.key][2] : form[item.key].join(item.joinmark) }}
                            </template>
                        </view>
                        <view v-else class="common_text">
                            {{ item.placeholder ? item.placeholder : '请选择' + item.title }}
                        </view>
                        <svg-icon icon-class="next" class="fs-30" />
                    </view>
                    <view
                        v-else-if="item.type === 'monthRange'"
                        class="form_content input-box flex justify-between align-center"
                    >
                        <view
                            v-if="item.startKey && form[item.startKey] && form[item.startKey].length"
                            class="main_text flex1"
                            @click="openStartMonthPicker(item)"
                        >
                            {{ form[item.startKey].join('.') }}
                        </view>
                        <view v-else class="common_text flex1" @click="openStartMonthPicker(item)">开始时间</view>
                        <view class="main_text">-</view>
                        <view class="main_text flex1 text-right" @click="openEndMonthPicker(item)">
                            {{
                                item.endKey && form[item.endKey] && form[item.endKey].length
                                    ? form[item.endKey].join('.')
                                    : '至今'
                            }}
                        </view>
                    </view>
                    <view v-else-if="item.type === 'sex'" class="sex_select flex">
                        <view
                            v-for="sex in item.options"
                            :key="item.value && sex[item.value]"
                            :class="{ sex_act: form[item.key] === (item.value && sex[item.value]) }"
                            class="sex fs-26"
                            @click="form[item.key] = item.value && sex[item.value]"
                        >
                            <view class="sex_avatar">
                                <image :src="(item.value && sex[item.value]) === 1 ? male : female" mode="aspectFit" />
                            </view>
                            <view class="sex_label fs-32">{{ item.label && sex[item.label] }}</view>
                        </view>
                    </view>
                    <view v-else-if="item.type === 'tab'" class="tab_select flex justify-between">
                        <view
                            v-for="(tab, i) in item.options"
                            :key="item.value && tab[item.value]"
                            :class="{
                                tab_act: form[item.key] === (item.value && tab[item.value]),
                                'mb-24': i < 2,
                            }"
                            class="tab fs-28"
                            @click="form[item.key] = item.value && tab[item.value]"
                        >
                            {{ item.label && tab[item.label] }}
                        </view>
                    </view>
                </uni-forms-item>
            </template>
        </uni-forms>
        <!-- 单列选择 -->
        <view v-if="isShowOnePicker" class="picker_model" catchtouchmove="true" @click.stop="closeOnePicker">
            <view class="picker_view" @click.stop="">
                <picker-view
                    :value="onePickerIndex"
                    @change="changeOnePicker"
                    @pickstart="pickerStart"
                    @pickend="pickerEnd"
                >
                    <picker-view-column class="picker_view_column">
                        <view v-for="opt in firstColumn" :key="opt[selectValue]" class="item">{{
                            opt[selectLabel]
                        }}</view>
                    </picker-view-column>
                </picker-view>
                <view class="picker_view_choose flex">
                    <button class="flex1" hover-class="none" @click="closeOnePicker">取消</button>
                    <button type="primary" class="flex1" hover-class="none" @click="confirmOnePicker">确定</button>
                </view>
            </view>
        </view>
        <!-- 双列选择 -->
        <view v-if="isShowTwoPicker" class="picker_model" catchtouchmove="true" @click.stop="closeTwoPicker">
            <view class="picker_view" @click.stop="">
                <picker-view
                    :value="twoPickerIndex"
                    @change="changeTwoPicker"
                    @pickstart="pickerStart"
                    @pickend="pickerEnd"
                >
                    <picker-view-column class="picker_view_column">
                        <view v-for="opt in firstColumn" :key="opt[selectValue]" class="item">{{
                            opt[selectLabel]
                        }}</view>
                    </picker-view-column>
                    <picker-view-column class="picker_view_column">
                        <view v-for="opt in secondColumn" :key="opt[selectValue]" class="item">{{
                            opt[selectLabel]
                        }}</view>
                    </picker-view-column>
                </picker-view>
                <view class="picker_view_choose flex">
                    <button class="flex1" hover-class="none" @click="closeTwoPicker">取消</button>
                    <button type="primary" class="flex1" hover-class="none" @click="confirmTwoPicker">确定</button>
                </view>
            </view>
        </view>
        <!-- 三列选择 -->
        <view v-if="isShowThreePicker" class="picker_model" catchtouchmove="true" @click.stop="closeThreePicker">
            <view class="picker_view" @click.stop="">
                <picker-view
                    :value="threePickerIndex"
                    @change="changeThreePicker"
                    @pickstart="pickerStart"
                    @pickend="pickerEnd"
                >
                    <picker-view-column class="picker_view_column">
                        <view v-for="opt in firstColumn" :key="opt[selectValue]" class="item">{{
                            opt[selectLabel]
                        }}</view>
                    </picker-view-column>
                    <picker-view-column class="picker_view_column">
                        <view v-for="opt in secondColumn" :key="opt[selectValue]" class="item">{{
                            opt[selectLabel]
                        }}</view>
                    </picker-view-column>
                    <picker-view-column class="picker_view_column">
                        <view v-for="opt in thirdColumn" :key="opt[selectValue]" class="item">{{
                            opt[selectLabel]
                        }}</view>
                    </picker-view-column>
                </picker-view>
                <view class="picker_view_choose flex">
                    <button class="flex1" hover-class="none" @click="closeThreePicker">取消</button>
                    <button type="primary" class="flex1" hover-class="none" @click="confirmThreePicker">确定</button>
                </view>
            </view>
        </view>
    </view>
    <view v-if="showFooter" class="footer-box">
        <view class="footer flex py-24 px-32">
            <button v-if="props.showDel" hover-class="none" class="flex1" @click="del">{{ props.delText }}</button>
            <button type="primary" hover-class="none" class="flex2" @click="submit">{{ props.saveText }}</button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, PropType } from 'vue'
import { toast, goPage, prefixedUrl, toFixedFun } from '@/utils/tool'

const male = computed(() => prefixedUrl('male.png'))
const female = computed(() => prefixedUrl('female.png'))
const close = computed(() => prefixedUrl('close2.png'))
const { ratio } = getApp().globalData as GlobalDataType
const placeholderSize = toFixedFun(28 / ratio, 2)

const props = defineProps({
    formData: {
        type: Object,
        default: () => {},
    },
    rules: {
        type: Object,
        required: false,
        default: () => ({}),
    },
    formList: {
        type: Array as PropType<formItemType[]>,
        default: () => [],
    },
    showDel: {
        // 是否展示删除按钮
        type: Boolean,
        default: false,
    },
    delText: {
        type: String,
        default: '删除',
    },
    saveText: {
        type: String,
        default: '保存',
    },
    showFooter: {
        type: Boolean,
        default: true,
    },
})

const form = reactive(props.formData)

const setInputVal = (form, item) => {
    console.log(form[item.key])
    console.log(item.clearable)
    if (item.maxlength) form[item.key] = form[item.key].slice(0, item.maxlength)
}

// 清空输入内容
const clearInput = (key) => {
    form[key] = ''
}

// textarea
const gotoTextarea = (item) => {
    const globalData = getApp().globalData as GlobalDataType
    globalData['textArea'][item.key] = form[item.key] || ''
    const url = `/pages/resumeForm/textArea?key=${item.key}&title=${item.title}&length=${item.maxlength}`
    goPage(url)
}

// category
const gotoCategory = (item) => {
    const globalData = getApp().globalData as GlobalDataType
    globalData['category'][item.key] = form[item.key] || []
    globalData['category'][item.format] = form[item.format] || []
    const url = `/pages/resumeForm/jobCategory?key=${item.key}&format=${item.format || ''}&title=${item.title}`
    goPage(url)
}

// picker
let pickerKey = ''
let pickerFormat = ''
const selectValue = ref<string>('')
const selectLabel = ref<string>('')
const firstColumn = ref<cascaderType[]>([])
const secondColumn = ref<cascaderType[]>([])
const thirdColumn = ref<cascaderType[]>([])

// 单列选择器
const isShowOnePicker = ref(false)
const onePickerIndex = ref<number[]>([0])
const openOnePicker = (item) => {
    isShowOnePicker.value = true
    selectValue.value = item.value
    selectLabel.value = item.label
    pickerKey = item.key
    pickerFormat = item.format || ''
    firstColumn.value = item.options
    if (form[item.key]) {
        onePickerIndex.value[0] = item.options.findIndex((opt) => opt[selectValue.value] === form[item.key])
    } else if (item.defalutVal) {
        onePickerIndex.value = [item.defalutVal]
    } else {
        onePickerIndex.value = [0]
    }
}
const changeOnePicker = (e) => {
    onePickerIndex.value = e.detail.value
}
let disabled = false
const pickerStart = () => {
    disabled = true
}
const pickerEnd = () => {
    disabled = false
}
const closeOnePicker = () => {
    if (disabled) return
    isShowOnePicker.value = false
}
const confirmOnePicker = () => {
    if (disabled) return
    form[pickerKey] = firstColumn.value[onePickerIndex.value[0]][selectValue.value]
    if (pickerFormat) form[pickerFormat] = firstColumn.value[onePickerIndex.value[0]][selectLabel.value]
    setTimeout(() => {
        isShowOnePicker.value = false
    }, 300)
}
// 双列选择器
const isShowTwoPicker = ref(false)
const twoPickerIndex = ref<number[]>([0, 0])
const openTwoPicker = (item) => {
    isShowTwoPicker.value = true
    selectValue.value = item.value
    selectLabel.value = item.label
    pickerKey = item.key
    pickerFormat = item.format || ''
    firstColumn.value = item.options
    if (form[item.key] && form[item.key].length) {
        const index1 = item.options.findIndex((opt) => opt[selectValue.value] === form[item.key][0])
        secondColumn.value = item.options[index1]['children'] || []
        const index2 = secondColumn.value.findIndex((opt) => opt[selectValue.value] === form[item.key][1])
        twoPickerIndex.value = [index1, index2]
    } else {
        twoPickerIndex.value = [0, 0]
        secondColumn.value = item.options.length ? item.options[0]['children'] : []
    }
}
const changeTwoPicker = (e) => {
    twoPickerIndex.value = e.detail.value
    secondColumn.value = firstColumn.value[twoPickerIndex.value[0]]['children'] || []
}
const closeTwoPicker = () => {
    if (disabled) return
    isShowTwoPicker.value = false
}
const confirmTwoPicker = () => {
    if (disabled) return
    const index = twoPickerIndex.value
    form[pickerKey] = secondColumn.value[index[1]]
        ? [firstColumn.value[index[0]][selectValue.value], secondColumn.value[index[1]][selectValue.value]]
        : [firstColumn.value[index[0]][selectValue.value]]
    if (pickerFormat) {
        form[pickerFormat] = secondColumn.value[index[1]]
            ? [firstColumn.value[index[0]][selectLabel.value], secondColumn.value[index[1]][selectLabel.value]]
            : [firstColumn.value[index[0]][selectLabel.value]]
    }
    setTimeout(() => {
        isShowTwoPicker.value = false
    }, 300)
}
// 三列选择器
const isShowThreePicker = ref(false)
const threePickerIndex = ref<number[]>([0, 0, 0])
const openThreePicker = (item) => {
    isShowThreePicker.value = true
    selectValue.value = item.value
    selectLabel.value = item.label
    pickerKey = item.key
    pickerFormat = item.format || ''
    firstColumn.value = item.options
    if (form[item.key] && form[item.key].length) {
        const index1 = item.options.findIndex((opt) => opt[selectValue.value] === form[item.key][0])
        secondColumn.value = (item.options[index1] && item.options[index1]['children']) || []
        const index2 = secondColumn.value.findIndex((opt) => opt[selectValue.value] === form[item.key][1])
        thirdColumn.value = (secondColumn.value[index2] && secondColumn.value[index2]['children']) || []
        const index3 = thirdColumn.value.findIndex((opt) => opt[selectValue.value] === form[item.key][2])
        threePickerIndex.value = [index1, index2, index3]
    } else if (item.defaultVal && item.defaultVal.length) {
        // console.log(item.defaultVal, item.options)
        const index1 = item.options.findIndex((opt) => opt[selectValue.value] === item.defaultVal[0])
        secondColumn.value = (item.options[index1] && item.options[index1]['children']) || []
        const index2 = secondColumn.value.findIndex((opt) => opt[selectValue.value] === item.defaultVal[1])
        thirdColumn.value = (secondColumn.value[index2] && secondColumn.value[index2]['children']) || []
        const index3 = thirdColumn.value.findIndex((opt) => opt[selectValue.value] === item.defaultVal[2])
        threePickerIndex.value = [index1, index2, index3]
    } else {
        threePickerIndex.value = [0, 0, 0]
        secondColumn.value = item.options.length ? item.options[0]['children'] : []
        thirdColumn.value = secondColumn.value.length ? secondColumn.value[0]['children'] : []
    }
}
const changeThreePicker = (e) => {
    threePickerIndex.value = e.detail.value
    secondColumn.value = firstColumn.value[threePickerIndex.value[0]]['children'] || []
    thirdColumn.value = secondColumn.value[threePickerIndex.value[1]]['children'] || []
}
const closeThreePicker = () => {
    if (disabled) return
    isShowThreePicker.value = false
}
const confirmThreePicker = () => {
    if (disabled) return
    const index = threePickerIndex.value
    form[pickerKey] = [
        firstColumn.value[index[0]][selectValue.value],
        secondColumn.value[index[1]][selectValue.value],
        thirdColumn.value[index[2]][selectValue.value],
    ]
    if (pickerFormat) {
        form[pickerFormat] = [
            firstColumn.value[index[0]][selectLabel.value],
            secondColumn.value[index[1]][selectLabel.value],
            thirdColumn.value[index[2]][selectLabel.value],
        ]
    }
    setTimeout(() => {
        isShowThreePicker.value = false
    }, 300)
}

// 月份范围
const openStartMonthPicker = (item) => {
    isShowTwoPicker.value = true
    selectValue.value = item.value
    selectLabel.value = item.label
    pickerKey = item.startKey
    pickerFormat = ''
    firstColumn.value = item.options
    if (form[item.startKey] && form[item.startKey].length) {
        const index1 = item.options.findIndex((opt) => opt[selectValue.value] === form[item.startKey][0])
        secondColumn.value = item.options[index1]['children'] || []
        const index2 = secondColumn.value.findIndex((opt) => opt[selectValue.value] === form[item.startKey][1])
        twoPickerIndex.value = [index1, index2]
    } else {
        twoPickerIndex.value = [0, 0]
        secondColumn.value = item.options.length ? item.options[0]['children'] : []
    }
}
const openEndMonthPicker = (item) => {
    isShowTwoPicker.value = true
    selectValue.value = item.value
    selectLabel.value = item.label
    pickerKey = item.endKey
    pickerFormat = ''
    const sofar = { key: '至今', val: '至今', children: [] }
    firstColumn.value = [sofar].concat(item.options)

    if (form[item.endKey] && form[item.endKey].length) {
        const index1 = firstColumn.value.findIndex((opt) => opt[selectValue.value] === form[item.endKey][0])
        secondColumn.value = (firstColumn.value[index1] && firstColumn.value[index1]['children']) || []
        const index2 = secondColumn.value.findIndex((opt) => opt[selectValue.value] === form[item.endKey][1])
        twoPickerIndex.value = [index1, index2]
    } else {
        twoPickerIndex.value = [0, 0]
        secondColumn.value = firstColumn.value.length ? firstColumn.value[0]['children'] : []
    }
}

// 更新数据
const updateForm = (key, val) => {
    form[key] = val
}
const ruleForm = ref()

// 暴露给父组件
defineExpose({ updateForm, form, ruleForm })

const emit = defineEmits(['del', 'submit'])
// 删除
const del = () => {
    emit('del')
}
// 保存

const submit = () => {
    ruleForm.value
        .validate()
        .then((res) => {
            console.log('表单数据信息：', res)
            emit('submit', form)
        })
        .catch(() => {
            toast('信息未填写或填写有误，请重新填写')
        })
}
</script>

<style scoped lang="scss">
.append {
    font-size: 16px;
    color: $--color-main;
}
.clearable {
    display: flex;
    align-items: center;
    margin-left: 10rpx;
    > image {
        display: inline-block;
        width: 16px;
        height: 16px;
    }
}
.sex_select {
    justify-content: space-around;
    .sex {
        color: $--color-main;
        .sex_avatar {
            width: 120rpx;
            height: 120rpx;
            border-radius: 50%;
            border: 4rpx solid transparent;
            position: relative;
            overflow: hidden;
            > image {
                display: block;
                width: 128rpx;
                height: 128rpx;
                border-radius: 50%;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
        .sex_label {
            text-align: center;
            margin-top: 8rpx;
        }
    }
    .sex_act {
        color: $--color-primary;
        .sex_avatar {
            border-color: $--color-primary;
        }
        .sex_label {
            font-weight: 600;
        }
    }
}
.tab_select {
    flex-wrap: wrap;
    .tab {
        width: 332rpx;
        box-sizing: border-box;
        color: $--color-main;
        padding: 14rpx 0;
        text-align: center;
        border-radius: 8px;
        background-color: #f7f8fa;
        border: 2rpx solid #f7f8fa;
    }
    .tab_act {
        color: $--color-primary;
        font-weight: 600;
        background-color: rgba(43, 43, 252, 0.05);
        border-color: rgba(43, 43, 252, 0.5);
    }
}
.input {
    height: 46rpx;
}
.form_content {
    min-height: 46rpx;
    font-size: 28rpx;
    .main_text {
        color: $--color-main;
        word-break: break-all;
        white-space: pre-line;
    }
    .common_text {
        color: $--color-input;
    }
    .svg_box {
        height: 46rpx;
    }
}

.disabled_text {
    color: $--color-sub;
}

.picker_model {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.34);
    .picker_view {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 644rpx;
        background-color: #fff;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        border-radius: 32rpx 32rpx 0 0;
        overflow: hidden;
        .picker_view_column {
            height: 500rpx;
            color: $--color-main;
            .item {
                line-height: 34px;
                text-align: center;
                font-size: 13px;
            }
        }
        .picker_view_choose {
            padding: 32rpx;
        }
    }
}
</style>
