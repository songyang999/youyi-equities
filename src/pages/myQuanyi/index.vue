<!--
 * @Author: XHL
 * @Date: 2026-06-22
 * @Description: 我的权益
-->
<template>
    <general-custom ref="general_custom" title="我的权益">
        <template #content>
            <view class="quanyi_wrap px-30 pb-40">
                <view v-for="(section, index) in benefitSections" :key="index" class="benefit_card pr mb-30">
                    <image :src="[isVideo(section) ? '/static/images/video_bac.png' : '/static/images/audio_bac.png']" mode="aspectFill" class="header_bg" />
                    <view class="card_header pr">
                        <view class="header_content">
                            <view class="voucher_tip fs-32">
                                <text class="count">{{ section.equityCount }}</text>张
                                <text class="highlight">{{ isVideo(section) ? '视频会员' : '音频会员' }}</text>权益兑换券待使用
                            </view>
                            <view class="card_title fs-32">{{ section.theme }}</view>
                            <view class="card_subtitle fs-28">{{ section.explain }}</view>
                        </view>
                    </view>
                    <view class="dashed_line pr"></view>
                    <view :class="[isVideo(section) ? 'grid_video' : 'grid_audio']" class="platform_grid pr">
                        <view class="grid_box">
                            <view v-for="item in section.equityArray" :key="item.equityCode" class="platform_item flex flex-column align-center">
                                <view class="logo_placeholder">
                                    <image :src="item.iconUrl" mode="aspectFit" class="logo_img" />
                                </view>
                                <view class="platform_name fs-24">
                                    <text>{{ item.displayName }}</text>
                                </view>
                                <view class="redeem_btn fs-24" @click="handleExchange(item, section)">立即兑换</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-if="!benefitSections.length" class="no_wrap">
                    <no-data />
                </view>
            </view>
        </template>
    </general-custom>
    <!-- 兑换成功 -->
    <exchange-success v-if="successVisible" @close="closeSuccess" />
    <!-- 兑换失败 -->
    <order-failure v-if="dialogFailVisible" :error-msg="errorMsg" title="兑换失败" @close="closeFailure" />
    <submit-exchange
        v-if="exchangeVisible"
        :equity-name="equityName"
        :display-name="displayName"
        :icon-url="iconUrl"
        @close="closeExchange"
        @confirm="confirmExchange"
    />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getEquity, agiotage } from "@/api/my";

onLoad(() => {
    getList();
});

interface EquityItem {
    equityCode: string;
    iconUrl: string;
    equityName: string;
    displayName: string;
    attribute: number;
}
interface BenefitSection {
    explain: string;
    equityCount: number;
    equityType: string;
    theme: string;
    attribute: number;
    equityArray: EquityItem[];
}

const isVideo = (section: BenefitSection) => {
    return section.attribute === 1;
};
// 权益名字格式化
const formatDisplayName = (name: string) => {
    if (!name) return "";
    const index = name.lastIndexOf("会员");
    if (index <= 0) return name;
    return `${name.slice(0, index)}\n${name.slice(index)}`;
};
// 权益列表
const benefitSections = ref<BenefitSection[]>([]);
const getList = async () => {
    try {
        const res: any = await getEquity();
        benefitSections.value = (res.data || []).map(
            (section: BenefitSection) => ({
                ...section,
                attribute: section.equityArray[0]?.attribute || 1,
                equityArray: (section.equityArray || []).map((item) => ({
                    ...item,
                    displayName: formatDisplayName(item.displayName),
                })),
            })
        );
    } catch (error) {
        //
    }
};

// 兑换成功
const successVisible = ref(false);
const closeSuccess = () => {
    successVisible.value = false;
};

const exchangeVisible = ref(false);
const equityName = ref("");
const displayName = ref("");
const equityCode = ref("");
const iconUrl = ref("");
const handleExchange = (item: EquityItem, section: BenefitSection) => {
    exchangeVisible.value = true;
    equityName.value = item.equityName;
    displayName.value = item.displayName.replace("\n", "");
    equityCode.value = item.equityCode;
    iconUrl.value = item.iconUrl;
};

// 关闭兑换
const closeExchange = () => {
    exchangeVisible.value = false;
    equityName.value = "";
    displayName.value = "";
    equityCode.value = "";
    iconUrl.value = "";
};

const dialogFailVisible = ref(false);
const errorMsg = ref("");
const closeFailure = () => {
    dialogFailVisible.value = false;
};
// 确认兑换
const confirmExchange = async (data) => {
    try {
        const params = {
            equityCode: equityCode.value,
            boundMobile: data.mobile,
        };
        await agiotage(params);
        getList();
        successVisible.value = true;
    } catch (error: any) {
        if (error?.result?.msg) {
            errorMsg.value = error.result.msg;
            dialogFailVisible.value = true;
        }
    } finally {
        closeExchange();
    }
};
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
    border-bottom: 1px dashed #bdd9f2;
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
    padding: 8rpx 40rpx 28rpx;
    box-sizing: border-box;
    .grid_box {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        overflow: hidden;
        height: 450rpx;
    }
}

.grid_video .platform_item {
    width: calc(25% - 12rpx);
    margin-bottom: 24rpx;
    margin-right: 14rpx;
    &:nth-child(4n) {
        margin-right: 0;
    }
}

.grid_audio .platform_item {
    width: calc(33.33% - 20rpx);
    margin-bottom: 24rpx;
    margin-right: 28rpx;
    &:nth-child(3n) {
        margin-right: 0;
    }
}

.platform_item {
    box-sizing: border-box;
    padding: 16rpx 6rpx 14rpx;
    background-color: #fff;
    border-radius: 16rpx;
    height: 210rpx;
}

.logo_placeholder {
    width: 68rpx;
    height: 68rpx;
    border-radius: 8rpx;
    overflow: hidden;
    .logo_img {
        width: 100%;
        height: 100%;
        display: block;
    }
}

.platform_name {
    color: $--color-main;
    line-height: 34rpx;
    text-align: center;
    margin-bottom: 14rpx;
    // width: 100rpx;
    white-space: wrap;
}

.redeem_btn {
    color: $--color-primary;
    line-height: 34rpx;
    background-color: #ecf5fe;
    padding: 0rpx 12rpx;
    border-radius: 30rpx;
}

.no_wrap {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
