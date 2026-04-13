<!--
 * @Author: XHL
 * @Date: 2024年2月29日10:11:25
 * @Description: 我的钱包
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
                    <text>我的钱包</text>
                    <view :style="{ width: navigationBar + 'px' }" class="custom-right" />
                </view>
            </view>
        </view>
        <view :style="{ marginTop: navigationBar + 'px' }" class="section">
            <view class="account_balance flex align-center flex-column">
                <view class="fs-32 mb-16">账户余额 (元)</view>
                <view class="money">{{ balance || '0' }}</view>
            </view>
            <view :style="{ height: detailHeight + 'px' }" class="balance_detail pr mx-32 px-32 py-24">
                <view class="title fs-36 mb-30">余额明细</view>
                <scroll-view v-if="wallet_list.length" scroll-y class="detail_wrap" @scrolltolower="scrolltolower">
                    <view class="deal_list">
                        <view v-for="(item, index) in wallet_list" :key="index" class="deal_wrap flex justify-between">
                            <view class="deal_left pr-12">
                                <view class="deal_title mb-12 fs-28">{{ item.transaction_title }}</view>
                                <view class="deal_time fs-30">{{ item.transaction_submit_format }}</view>
                            </view>
                            <view class="deal_right flex flex-column justify-center">
                                <view :class="stateClass[item.transaction_status]" class="deal_status mb-12 fs-28">{{
                                    item.transaction_status_format
                                }}</view>
                                <view
                                    :class="[item.transaction_type === 1 ? 'main-color' : 'danger-color']"
                                    class="deal_money fs-30"
                                    >{{ item.transaction_type === 1 ? '-' : '+' }}{{ item.amount_format || '0' }}</view
                                >
                            </view>
                        </view>
                    </view>
                    <view class="no_more fs-28 py-24">{{ loading ? '加载中' : '没有更多了' }}</view>
                </scroll-view>
                <!-- 暂无明细 -->
                <view v-else class="none_wrap">
                    <no-data :type="3" text="暂无明细" />
                </view>
            </view>
        </view>
        <!-- 立即提现 -->
        <view class="footer-box">
            <view class="footer flex py-24 px-32">
                <button
                    :disabled="+balance === 0"
                    type="primary"
                    hover-class="none"
                    class="flex1 fs-28"
                    @click="linkTo"
                >
                    立即提现
                </button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onReady, onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { myWallet, myWalletRecord } from '@/api/my'
import { goPage, getRmainHeight, prefixedUrl, handleBurialPoint } from '@/utils/tool'
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
    handleBurialPoint('wallet')
    getMyWallet()
    getMyWalletRecord()
})

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

const stateClass = {
    1: 'warning-color',
    2: 'primary-color',
    3: 'success-color',
    4: 'danger-color',
}
interface walletType {
    transaction_type: number
    transaction_title: string
    amount_format: string
    transaction_submit_format: string
    transaction_status: number
    transaction_status_format: string
}
const wallet_list = ref<walletType[]>([])
const params = {
    page: 1,
    page_num: 10,
    max_page: 0,
}
const loading = ref(false)
const getMyWalletRecord = async () => {
    try {
        loading.value = true
        const res: any = await myWalletRecord(params)
        if (res.data) {
            params.max_page = res.data.max_page
            const list = res.data.list || []
            wallet_list.value = params.page === 1 ? list : wallet_list.value.concat(list)
        }
    } catch (error) {
        //
    } finally {
        loading.value = false
    }
}
const scrolltolower = () => {
    if (params.page < params.max_page) {
        params.page += 1
        getMyWalletRecord()
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

// 跳转立即提现页
const linkTo = () => {
    handleBurialPoint('wallet_tx')
    goPage('/pages/wallet/deposit')
}

// 页面卸载
onUnload(() => {
    const globalData = getApp().globalData as GlobalDataType
    globalData.isInit = false
})
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
        }
        .none_wrap {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .no_more {
            width: 100%;
            color: $--color-common;
            text-align: center;
        }
        .detail_wrap {
            height: calc(100% - 82rpx);
            .deal_wrap {
                border-bottom: 1px solid $--color-border;
                padding-bottom: 32rpx;
                margin-bottom: 32rpx;
                &:last-child {
                    border-bottom: 0;
                    padding-bottom: 0;
                    margin-bottom: 0;
                }
            }
            .deal_title {
                color: $--color-main;
            }
            .deal_title,
            .deal_money {
                font-weight: 600;
            }
            .deal_status,
            .deal_money {
                text-align: right;
            }
            .deal_time {
                color: $--color-sub;
            }
        }
    }
}
</style>
