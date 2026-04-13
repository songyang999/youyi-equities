<!--
 * @Author: XHL
 * @Date: 2024年2月29日10:11:25
 * @Description: 提现
-->
<template>
    <view :style="{ paddingTop: statusBarHeight + 'px' }" catchtouchmove="return" class="page">
        <!-- 自定义导航栏 -->
        <view :style="{ paddingTop: statusBarHeight + 'px' }" class="custom">
            <image class="custom-bac" :src="page_bac" mode="aspectFill" />
            <view :style="{ paddingTop: statusBarHeight + 'px' }" class="custom-content">
                <view v-if="!hideCustom" :style="{ height: navigationBar + 'px' }" class="page-title fs-34">
                    <view :style="{ width: navigationBar + 'px' }" class="custom-left" @click="navBack">
                        <image :src="back" />
                    </view>
                    <text>提现</text>
                    <view :style="{ width: navigationBar + 'px' }" class="custom-right" />
                </view>
            </view>
        </view>
        <view :style="{ marginTop: navigationBar + 'px' }" class="section">
            <view class="account_balance flex align-center flex-column">
                <view class="fs-32 mb-16">可提现金额 (元)</view>
                <view class="money">{{ balance || '0' }}</view>
            </view>
            <view :style="{ height: detailHeight + 'px' }" class="balance_detail pr mx-32 px-32 py-24">
                <view class="title fs-36">提现金额</view>
                <view class="deposit_wrap pb-16 mb-20">
                    <view class="ren fs-36 mr-24">¥</view>
                    <input
                        v-model="withdraw_amount"
                        class="deposit_input fs-48"
                        placeholder-style="color: #a4afc1; font-size: 36rpx; font-weight: normal;"
                        type="text"
                        placeholder="请输入提现金额"
                        @input="inputMoney"
                        @blur="blurMoney"
                    />
                    <view class="btn_text fs-30" @click="fullDeposit">全部提现</view>
                </view>
                <template v-if="withdraw_amount">
                    <view v-if="+withdraw_amount > +balance" class="error_color fs-26">输入金额不可大于可提现金额</view>
                    <view v-else-if="+withdraw_amount < 0.3" class="error_color fs-26">单笔最低提现金额为0.3元</view>
                    <view v-else-if="+withdraw_amount > 500" class="error_color fs-26">单笔最高提现金额为500元</view>
                    <view v-else class="occupied"></view>
                </template>
                <view v-else class="occupied"></view>
                <view class="rule_box mt-6">
                    <view class="tips fs-28">提现说明</view>
                    <view class="tips fs-26">1、单笔最低提现金额0.3元</view>
                    <view class="tips fs-26">2、单笔最高提现金额500元</view>
                    <view class="tips fs-26">3、单日总提现金额不可超过5000元, 次数最多不可超过10次</view>
                    <view class="tips fs-26">4、提现审核通过后, 将自动发放至微信钱包, 请及时查看</view>
                </view>
            </view>
        </view>
        <!-- 完善信息 -->
        <perfect-info ref="perfect" :title="perfect_title" :type="verify_type" @submit="withdrawSubmit" />
        <!-- 立即提现 -->
        <view class="footer-box">
            <view class="footer flex py-24 px-32">
                <button :disabled="!is_sub" type="primary" hover-class="none" class="flex1 fs-28" @click="applyDeposit">
                    申请提现
                </button>
            </view>
        </view>
    </view>
    <general-loading v-if="loading" />
</template>

<script setup lang="ts">
import { onReady, onLoad, onShow } from '@dcloudio/uni-app'
import { ref, computed, nextTick } from 'vue'
import { getPersonInfo, myWallet, walletWithdrawSubmit, submitIdentityVerify } from '@/api/my'
import { toFixedFun, keyInput, getRmainHeight, prefixedUrl, toast, handleBurialPoint } from '@/utils/tool'
import _ from 'lodash'
const { statusBarHeight, navigationBar, config, hideCustom } = getApp().globalData as GlobalDataType

// 图片 用computed包裹，防止切换页面重新加载
const page_bac = computed(() => prefixedUrl(`${config.APP_TYPE}_page_bac.jpg`))
const back = computed(() => prefixedUrl('white_back.png'))

const detailHeight = ref(0)
onReady(async () => {
    let high = await getRmainHeight(['footer-box', 'account_balance'])
    detailHeight.value = high - statusBarHeight - navigationBar - 16
})

onShow(() => {
    handleBurialPoint('cash_withdrawal')
    getIsVerify()
    getMyWallet()
})

// 获取是否实名认证
let is_cert_verify = false
const getIsVerify = async () => {
    try {
        const res: any = await getPersonInfo()
        if (res.data) {
            is_cert_verify = res.data.is_cert_verify
        }
    } catch (error) {
        //
    }
}

const balance = ref('0')
const getMyWallet = async () => {
    try {
        const res: any = await myWallet()
        if (res.data && res.data.wallet) {
            const data = res.data.wallet
            balance.value = data.balance_format
        }
    } catch (error) {
        //
    }
}

const isBack = ref<boolean>(true)
onLoad(() => {
    const page = getCurrentPages()
    isBack.value = page.length > 1
})
const navBack = () => {
    if (isBack.value) {
        uni.navigateBack()
    } else uni.switchTab({ url: '/pages/home/index' })
}

const withdraw_amount = ref('')
const is_sub = computed(() => +withdraw_amount.value > 0)

const inputMoney = async () => {
    withdraw_amount.value = await keyInput(withdraw_amount.value, 2)
}
const blurMoney = () => {
    withdraw_amount.value = withdraw_amount.value ? toFixedFun(withdraw_amount.value, 2) : ''
}
// 全部提现
const fullDeposit = () => {
    withdraw_amount.value = toFixedFun(balance.value, 2)
}

const perfect = ref()
const perfect_title = ref('实名认证')
const verify_type = ref(1)
const applyDeposit = () => {
    if (+withdraw_amount.value > +balance.value) {
        toast('输入金额不可大于可提现金额')
        return
    }
    if (+withdraw_amount.value < 0.3) {
        toast('单笔最低提现金额为0.3元')
        return
    }
    if (+withdraw_amount.value > 500) {
        toast('单笔最高提现金额为500元')
        return
    }
    handleBurialPoint('cash_withdrawal_tx')
    if (is_cert_verify) {
        perfect_title.value = '实名信息验证'
        verify_type.value = 2
    } else {
        perfect_title.value = '实名认证'
        verify_type.value = 1
    }
    nextTick(() => {
        perfect.value.info.open()
        perfect.value.init()
    })
}

const loading = ref(false)
const withdrawSubmit = async (data = {} as any) => {
    if (loading.value) return
    loading.value = true
    if (is_cert_verify) {
        handleWithdrawSubmit(data)
    } else {
        handleSubmitIdentityVerify(data)
    }
}

// 实名认证
const handleSubmitIdentityVerify = async (data = {} as any) => {
    try {
        const global = getApp().globalData as GlobalDataType
        const params = {
            open_id: global.open_id,
            device_id: global.device_id,
            ...data,
        }
        const res: any = await submitIdentityVerify(params)
        if (res.data && res.data.verify_status === 2) {
            handleWithdrawSubmit(data)
        } else {
            toast('认证失败')
            loading.value = false
        }
    } catch (error) {
        loading.value = false
    }
}

// 执行提现
let cloneData = {}
const handleWithdrawSubmit = async (data = {} as any) => {
    try {
        const params = getParams(data)
        const res: any = await walletWithdrawSubmit(params)
        if (res.data.need_verify_code) {
            verify_type.value = 3
            cloneData = _.cloneDeep(data)
        } else {
            toast('提交成功')
            perfect.value.info.forceClose()
            setTimeout(() => {
                uni.navigateBack()
            }, 1000)
        }
    } catch (error) {
        //
    } finally {
        loading.value = false
    }
}

const getParams = (data = {} as any) => {
    const global = getApp().globalData as GlobalDataType
    const params = {
        withdraw_amount: withdraw_amount.value,
        open_id: global.open_id,
        device_id: global.device_id,
        ...cloneData,
        ...data,
    }
    cloneData = {}
    return params
}
</script>

<style scoped lang="scss">
.page-title {
    justify-content: space-between;
    max-width: 100%;
    .custom-left,
    .custom-right {
        height: 100%;
        position: relative;
        image {
            display: block;
            // width: 100%;
            // height: 100%;
            width: 44px;
            height: 44px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
.section {
    position: relative;
    padding-bottom: 16px;
    .account_balance {
        padding-top: 82rpx;
        padding-bottom: 37rpx;
        color: #fff;
        .money {
            font-size: 80rpx;
            font-weight: bold;
        }
    }
    .balance_detail {
        box-sizing: border-box;
        border-radius: 24rpx;
        background-color: #fff;
        .title {
            font-weight: 600;
            color: $--color-main;
            margin-bottom: 56rpx;
        }
        .deposit_wrap {
            width: 100%;
            border-bottom: 1px solid $--color-border;
            height: 67rpx;
            line-height: 67rpx;
            .ren,
            .deposit_input {
                float: left;
                font-weight: 600;
                color: $--color-main;
                height: 67rpx;
                line-height: 67rpx;
            }
            .deposit_input {
                width: 432rpx;
            }
            .btn_text {
                float: right;
                color: $--color-primary;
            }
        }
        .occupied {
            height: 36rpx;
            width: 100%;
        }
        .tips {
            color: $--color-sub;
            line-height: 56rpx;
        }
        .error_color {
            color: $--color-danger;
        }
    }
}
</style>
