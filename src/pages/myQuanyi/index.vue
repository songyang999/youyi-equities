<!--
 * @Author: XHL
 * @Date: 2026-06-22
 * @Description: 我的权益
-->
<template>
    <general-custom ref="general_custom" title="我的权益">
        <template #content>
            <view class="quanyi_wrap px-30 pb-40">
                <view
                    v-for="(section, index) in benefitSections"
                    :key="section.equityType"
                    class="benefit_card pr mb-30"
                >
                    <image :src="[index === 0 ? '/static/images/video_bac.png' : '/static/images/audio_bac.png']" mode="aspectFill" class="header_bg" />
                    <view class="card_header pr">
                        <view class="header_content">
                            <view class="voucher_tip fs-32">
                                <text class="count">{{ section.explain }}</text>
                                张
                                <text class="highlight">{{ index === 0 ? '视频会员' : '音频会员' }}</text>
                                权益兑换券待使用
                                <!-- {{ section.equityType }} -->
                            </view>
                            <view class="card_title fs-32">{{ section.theme }}</view>
                            <view class="card_subtitle fs-28">{{ section.explain }}</view>
                        </view>
                    </view>
                    <view class="dashed_line pr"></view>
                    <view :class="[index === 0 ? 'grid_video' : 'grid_audio']" class="platform_grid pr">
                        <view
                            v-for="item in section.equityArray"
                            :key="item.productKey"
                            class="platform_item flex flex-column align-center"
                        >
                            <view class="logo_placeholder">
                                <image :src="item.iconUrl" mode="aspectFit" class="logo_img" />
                            </view>
                            <view class="platform_name fs-24">{{ item.equityName }}</view>
                            <view class="redeem_btn fs-24">立即兑换</view>
                        </view>
                    </view>
                </view>
            </view>
        </template>
    </general-custom>
    <exchange-success v-if="exchangeVisible" @close="handleCloseExchange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getEquity } from '@/api/my'

onLoad(() => {
    getList()
})

interface EquityItem {
    productKey: string;
    iconUrl: string;
    equityName: string;
    equityType: number;
}
interface BenefitSection {
    explain: string;
    equityCount: number;
    equityType: string;
    theme: string;
    equityArray: EquityItem[];
}

const benefitSections = ref<BenefitSection[]>([]);
const getList = async() => {
    try {
        const res: any = await getEquity();
        benefitSections.value = res.data || [];
    } catch (error) {
        //
    }
}

const exchangeVisible = ref(false)
const handleCloseExchange = () => {
    exchangeVisible.value = false
}

</script>

<style scoped lang="scss">
.quanyi_wrap {
    padding-top: 24rpx;
}

.benefit_card {
    overflow: hidden;
    height: 758rpx;
}

.card_header {
    height: 200rpx;
    overflow: hidden;
}

.header_bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
}

.header_content {
    position: relative;
    z-index: 1;
    padding: 36rpx 52rpx 28rpx;
}

.dashed_line {
    border-bottom: 1px dashed #BDD9F2;
    margin: 24rpx 44rpx;
}

.voucher_tip {
    color: $--color-main;
    line-height: 40rpx;
    margin-bottom: 12rpx;

    .count {
        font-size: 48rpx;
        font-weight: bold;
        color: $--color-primary;
        margin-right: 4rpx;
    }

    .highlight {
        color: $--color-primary;
        font-weight: bold;
    }
}

.card_title {
    color: $--color-main;
    font-weight: bold;
    line-height: 50rpx;
    margin-bottom: 8rpx;
}

.card_subtitle {
    color: $--color-sub;
    line-height: 34rpx;
}

.platform_grid {
    display: flex;
    flex-wrap: wrap;
    padding: 8rpx 40rpx 28rpx;
    box-sizing: border-box;
    overflow-y: auto;
}

.grid_video .platform_item {
    width: calc(25% - 12rpx);
    margin-bottom: 24rpx;
    margin-right: 16rpx;
    &:nth-child(4n) {
        margin-right: 0;
    }
}

.grid_audio .platform_item {
    width: calc(33.33% - 20rpx);
    margin-bottom: 24rpx;
    margin-right: 20rpx;
    &:nth-child(3n) {
        margin-right: 0;
    }
}

.platform_item {
    box-sizing: border-box;
    padding: 16rpx 6rpx 14rpx;
    background-color: #fff;
    border-radius: 16rpx;
}

.logo_placeholder {
    width: 68rpx;
    height: 68rpx;
    border-radius: 8rpx;
    background: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
    // margin-bottom: 12rpx;
    overflow: hidden;
}

.logo_img {
    width: 56rpx;
    height: 56rpx;
    opacity: 0.35;
}

.platform_name {
    color: $--color-main;
    line-height: 34rpx;
    text-align: center;
    margin-bottom: 14rpx;
    width: 100rpx;
    white-space: wrap;
}

.redeem_btn {
    color: $--color-primary;
    line-height: 34rpx;
    background-color: #ECF5FE;
    padding: 0rpx 12rpx;
    border-radius: 30rpx;
}
</style>
