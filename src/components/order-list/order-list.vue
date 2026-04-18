<!--
 * @Author: XHL
 * @Date: 2026-04-11
 * @Description: 订单列表
-->
<template>
  <scroll-view
    :style="{ maxHeight: `${props.height}px` }"
    :refresher-enabled="enabled"
    :refresher-threshold="100"
    :refresher-triggered="triggered"
    :scroll-y="scrollY"
    :enhanced="options.enhanced"
    :bounces="options.bounces"
    :throttle="options.throttle"
    :upper-threshold="0"
    type="list"
    @scroll="onScroll"
    @refresherrefresh="onRefresh"
    @scrolltolower="scrolltolower"
    @scrolltoupper="scrolltoupper"
  >
    <template v-if="props.list.length || props.loading">
      <view class="list px-30">
        <view
          v-for="item in props.list"
          :key="item.id"
          class="order_item pr"
          @click="gotoDetail(item)"
        >
          <view class="card_head flex justify-between align-center">
            <view>2017-06-24</view>
            <view class="flex align-center">
              未兑换<text class="ml-15 mr-10">|</text
              ><image
                src="/static/images/delete_icon.png"
                class="delete_icon"
              />
            </view>
          </view>
          <view class="card_main py-30 px-20 flex justify-between">
            <image src="/static/images/order_img.png" class="order_img" />
            <view class="order_title flex1 mx-18 fs-28"
              >2元-水电燃气缴费红包</view
            >
            <view class="flex flex-column align-end justify-between">
              <view class="amount fs-28">￥2.00</view>
              <view class="count fs-24">X1</view>
              <view class="view_btn fs-24">查看详情</view>
            </view>
          </view>
          <view class="card_footer">
            <view class="flex align-end justify-end fs-24">
              <view>共1件</view>
              <view class="ml-20"
                >付款总额￥<text class="salary">5.00</text></view
              >
            </view>
            <view class="flex justify-end mt-8" @click.stop="">
              <button
                type="default"
                hover-class="none"
                class="danger_btn"
                @click="handleCash(item)"
              >
                权益兑换
              </button>
              <button
                type="default"
                hover-class="none"
                class="common_btn"
                @click="handleUnreg(item)"
              >
                业务退订
              </button>
            </view>
          </view>
        </view>
      </view>
      <view class="no_more fs-28 py-24">{{
        props.loading ? "加载中" : "没有更多了"
      }}</view>
    </template>
    <template v-else>
      <view class="pt-64">
        <no-data text="暂无数据" />
      </view>
    </template>
  </scroll-view>
</template>

<script setup lang="ts">
import { onReady } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { goPage, salaryFormat, prefixedUrl, rewardRuleFormat } from '@/utils/tool'

interface welfareType {
    id: number
    name: string
}
interface locationType {
    address: string
    lat: number
    lng: number
}
interface rewardType {
    id: number
    node_name: string
    days: number
    amount_format: string
}
interface jobType {
    id: number
    name: string
    salary_min: number
    salary_max: number
    salary_type: number
    company_name: string
    financing_stage_format: string
    company_scale_format: string
    welfare: welfareType[]
    job_locations: locationType
    job_loc: any
    job_has_applied: number
    job_opened: number
    apply_status: number
    high_light: string
    job_reward_status: number,
    reward_rule_recommend: rewardType[]
    reward_rule_apply: rewardType[]
}
//	接受父组件传值
const props = defineProps({
    list: {
        type:  Array<jobType>,
        default: () => []
    },
    height: {
        type: Number,
        default: 0
    },
    loading: {
        type: Boolean,
        default: false
    },
    jobKey: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: ''
    },
    scrollY: {
        type: Boolean,
        default: true
    },
    options: {
        type: Object,
        default: () => ({
            'enhanced': false,
            'bounces': true,
            'throttle': true
        })
    }
})

// 公司信息格式化
const stagFormat = (row) => {
    const { company_name, financing_stage_format, company_scale_format, financing_stage, company_scale } = row
    let format = company_name.length > 16 ? company_name.slice(0, 14) + '...' : company_name
    if (company_scale) format += format ? ` · ${company_scale_format}` : company_scale_format
    if (financing_stage) format += format ? ` · ${financing_stage_format}` : financing_stage_format
    return format
}

const jobAddressFormat = (loc) => {
    let format = loc.address.length > 14 ? loc.address.substring(0, 14) + '...' : loc.address
    let distance = ''
    if (loc.distance) distance = loc.distance > 1000 ? (loc.distance / 1000).toFixed(1) + 'km' : loc.distance + 'm'
    if (distance) format += format ? ` · ${distance}` : distance
    return format
}

const applyStatusFormat = {
    1: '待查看',
    2: '待面试',
    3: '待入职',
    4: '已入职',
    5: '不合适',
}

const applyStatusClass = {
    1: 'primary_color',
    2: 'primary_color',
    3: 'primary_color',
    4: 'main_color',
    5: 'sub_color',
}

const emit = defineEmits(['scroll', 'lower', 'upper', 'detail', 'cash', 'unreg'])
const triggered = ref(false)
const enabled = ref(false)
onReady(() => {
    if (props.jobKey > 0) {
        triggered.value = true
        enabled.value = true
    }
})

const onScroll = (e) => {
    emit('scroll', e)
}

const onRefresh = () => {
    setTimeout(() => {
        triggered.value = false
    },1000)
    setTimeout(() => {
        enabled.value = false
    },1050)
}
// 上滑加载
const scrolltolower = () => {
    if (props.loading) return
    emit('lower')
}
// 滚动到顶部
const scrolltoupper = () => {
    if (props.loading) return
    emit('upper')
}


// 点击跳转
const gotoDetail = (item) => {
    emit('detail', item)
    goPage(`/pages/orderDetail/index?id=${item.id}`)
}
// 权益兑换
const handleCash = (item) => {
  emit('cash', item)
}
// 业务退订
const handleUnreg = (item) => {
  emit('unreg', item)
}
</script>

<style scoped lang="scss">
.scroll_wrap {
  width: 100%;
  box-sizing: border-box;
}
.list {
  padding-top: 4px;
}
.order_item {
  background: #fff;
  width: 100%;
  display: block;
  box-sizing: border-box;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  &:last-child {
    margin-bottom: 0;
  }
  .card_head {
    padding: 24rpx 14rpx 24rpx 20rpx;
    border-bottom: 1px solid #ededed;
    color: $--color-sub;
    font-size: 24rpx;
    .delete_icon {
      display: block;
      width: 40rpx;
      height: 40rpx;
    }
  }
  .card_main {
    .order_img {
      display: block;
      width: 134rpx;
      height: 112rpx;
      flex-shrink: 0;
    }
    .order_title {
      color: $--color-main;
    }
    .amount {
      color: $--color-common;
    }
    .count {
      color: $--color-sub;
    }
    .view_btn {
      color: $--color-danger;
    }
  }
  .card_footer {
    border-top: 1px solid #ededed;
    padding: 20rpx 20rpx 28rpx;
    color: $--color-main;
    .salary {
      color: $--color-danger;
      font-size: 32rpx;
    }
    button {
      margin: 0;
      background: transparent;
      width: 150rpx;
      height: 50rpx;
      line-height: 46rpx;
      font-size: 24rpx;
      font-weight: 400;
      padding: 0;
    }
    .danger_btn {
      color: $--color-danger;
      border-color: $--color-danger;
    }
    .common_btn {
      color: #777;
      border-color: #777;
      margin-left: 16rpx;
    }
  }
}
.no_more {
  width: 100%;
  color: $--color-sub;
  text-align: center;
}
</style>
