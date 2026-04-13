<!--
 * @Author: XHL
 * @Date: 2024年2月29日
 * @Description: 活动规则
-->
<template>
    <general-custom title="活动规则">
        <template #content>
            <view class="px-40 py-32">
                <view class="rule_title fs-34 flex align-center mb-24">
                    <svg-icon :icon-class="rule_one" class="fs-32 mr-8" />
                    <text>奖励说明:</text>
                </view>
                <view class="rule_text fs-26 mb-32"
                    >推荐和应聘奖励会在审核通过后发放至账户余额, 可直接提现至微信钱包, 提现时需收集用户真实信息,
                    超过活动时间或核实涉嫌虚假参与活动, 奖励将不予发放</view
                >
                <view class="rule_title fs-34 flex align-center mb-24">
                    <svg-icon icon-class="rule_two" class="fs-32 mr-8" />
                    <text>违规说明:</text>
                </view>
                <view class="rule_text fs-26"
                    >以任何不正当手段或舞弊方式参与本活动, 一经发现,
                    万古有权对该用户的账号进行异常标记。对于账号异常的用户万古有权采取不发放奖励等措施,
                    并保留追究该用户责任的权利。如因此给用户造成的损失,
                    万古不进行任何赔偿或补偿。不正当手段及舞弊行为包括但不限于使用非法工具分享、注册、登录多个账号、虚假入职及其他不正当手段;
                    如果用户存在违规行为(包括但不限于洗钱、虚假交易、赌博、恶意套现、作弊、刷信誉),
                    万古将取消用户的活动资格、并有权撤销相关违规交易、收回奖励(包括已消费金额)等利益,
                    同时依照相关规则进行处理。如因不可抗力(包括但不限于重大自然灾害事件、政府主管部门指今停止举办活动遭受严重网络攻击等)</view
                >
            </view>
            <view class="bottom_text fs-26">本活动最终解释权归{{ config.TITLE }}所有</view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onUnload } from '@dcloudio/uni-app'
const { config } = getApp().globalData as GlobalDataType
const rule_one = `${config.APP_TYPE}_rule_one`

// 页面卸载
onUnload(() => {
    const globalData = getApp().globalData as GlobalDataType
    globalData.isInit = false
})
</script>

<style lang="scss" scoped>
.rule_title {
    font-weight: bold;
    color: $--color-main;
}
.rule_text {
    color: $--color-common;
    line-height: 48rpx;
}
.bottom_text {
    position: absolute;
    bottom: 80rpx;
    width: 100%;
    color: $--color-common;
    text-align: center;
}
</style>
