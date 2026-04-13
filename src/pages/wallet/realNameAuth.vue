<!--
 * @Author: XHL
 * @Date: 2024-07-25
 * @Description: 实名认证
-->
<template>
    <general-custom ref="general_custom" title="实名认证">
        <template #content>
            <general-forms :form-data="formData" :form-list="formList" :show-footer="false" />
            <view class="tips fs-28">
                <text>如需变更实名认证信息请联系客服进行办理\n给您带来不便敬请谅解～</text>
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { reactive } from 'vue'
import { getIdentityVerify } from '@/api/my'

onShow(() => {
    getIsVerify()
})

const formData = reactive<any>({
    real_name: '',
    certificate_id: '',
    phone: '',
})

const getIsVerify = async () => {
    const res: any = await getIdentityVerify()
    if (res.data && res.data.verify_info) {
        const { real_name, certificate_id, phone } = res.data.verify_info
        formData.real_name = real_name
        formData.certificate_id = certificate_id
        formData.phone = phone
    }
}

const formList = [
    {
        key: 'real_name',
        title: '真实姓名',
        type: 'input',
        disabled: true,
    },
    {
        key: 'certificate_id',
        title: '证件号码',
        type: 'input',
        disabled: true,
    },
    {
        key: 'phone',
        title: '手机号码',
        type: 'input',
        disabled: true,
    },
]
</script>

<style scoped lang="scss">
.tips {
    text-align: center;
    color: $--color-sub;
    line-height: 56rpx;
    position: absolute;
    width: 100%;
    bottom: 198rpx;
}
</style>
