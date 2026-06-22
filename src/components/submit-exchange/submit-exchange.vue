<!--
 * @Author: XHL
 * @Date: 2026-04-12
 * @Description: 确认兑换
-->
<template>
    <view class="deliver_bac" catchtouchmove="true" @click.stop>
        <view class="deliver_wrap">
            <view class="close_btn" @click="close">
                <image src="/static/images/close.png" />
            </view>
            <image :src="props.iconUrl || '/static/images/no_data.png'" mode="aspectFill" class="platform_icon" />
            <view class="dialog_title fs-36">{{ props.equityName }}</view>
            <view class="dialog_subtitle fs-28">
                {{ props.equityCount }}张兑换券，确认兑换{{ props.platformName }}
            </view>
            <view class="input_box">
                <input
                    v-model="mobile"
                    :maxlength="11"
                    placeholder="请输入充值账号对应手机号码"
                    :placeholder-style="`font-size: 13px;color:#999999;`"
                    class="input fs-28"
                    type="number"
                />
            </view>
            <view class="tip_text fs-24">
                您领取的权益将自动发放至上面所填手机号绑定的平台账号，请确认填写的手机号码无误，权益已经兑换无法退还，逾期视为自动放弃，请及时使用。
            </view>
            <view class="btn_group flex">
                <button hover-class="none" class="flex1 cancel_btn" @click="close">我再想想</button>
                <button hover-class="none" class="flex1 confirm_btn ml-20" @click="handleConfirm">确认兑换</button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import test from "@/utils/test";
import { toast } from "@/utils/tool";

const props = defineProps({
    equityName: {
        type: String,
        default: "",
    },
    iconUrl: {
        type: String,
        default: "",
    },
    equityCount: {
        type: Number,
        default: 1,
    },
    platformName: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["close", "confirm"]);

const mobile = ref("");

const close = () => {
    emit("close");
};

const handleConfirm = () => {
    if (!mobile.value) {
        toast("请输入充值账号对应手机号码");
        return;
    }
    if (!test.mobile(mobile.value)) {
        toast("请输入正确的手机号码");
        return;
    }
    emit("confirm", { mobile: mobile.value });
};
</script>

<style lang="scss" scoped>
.deliver_bac {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;

    .deliver_wrap {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 686rpx;
        padding: 90rpx 44rpx 40rpx;
        box-sizing: border-box;
        border-radius: 16rpx;
        background-color: #fff;

        .close_btn {
            position: absolute;
            top: -96rpx;
            right: 0;
            width: 50rpx;
            height: 50rpx;

            image {
                display: block;
                width: 100%;
                height: 100%;
            }
        }

        .platform_icon {
            position: absolute;
            left: 50%;
            top: -40rpx;
            transform: translateX(-50%);
            display: block;
            width: 104rpx;
            height: 104rpx;
            border-radius: 16rpx;
        }

        .dialog_title {
            width: 100%;
            text-align: center;
            color: $--color-main;
            font-weight: bold;
            line-height: 50rpx;
            margin-bottom: 16rpx;
        }

        .dialog_subtitle {
            width: 100%;
            text-align: center;
            color: $--color-primary;
            line-height: 40rpx;
            margin-bottom: 32rpx;
        }

        .input_box {
            background: #f7f8fa;
            border-radius: 12rpx;
            padding: 0 24rpx;
            margin-bottom: 24rpx;

            .input {
                width: 100%;
                height: 88rpx;
                line-height: 88rpx;
                color: $--color-main;
            }
        }

        .tip_text {
            color: $--color-sub;
            line-height: 36rpx;
            margin-bottom: 40rpx;
        }

        .btn_group {
            button {
                margin: 0;
            }

            .cancel_btn {
                color: $--color-primary;
                border-color: $--color-primary;
            }

            .confirm_btn {
                color: #fff;
                background-color: $--color-primary;
                border-color: $--color-primary;
            }
        }
    }
}
</style>
