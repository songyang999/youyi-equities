<!--
 * @Author: XHL
 * @Date: 2026-04-10
 * @Description: 商品列表
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
      <view
        :class="{ min_list: props.isMin }"
        class="list flex justify-between px-30"
      >
        <view
          v-for="item in props.list"
          :key="item.id"
          class="good_item pr"
          @click="gotoDetail(item)"
        >
          <image src="/static/images/good.png" class="good_img mb-16" />
          <view class="good_title line_ovh px-16 mb-10">阳光出行5元优惠券</view>
          <view class="flex justify-between px-16">
            <view class="salary fs-32"><text class="fs-22">¥</text>100</view>
            <!-- <view class="fs-28">¥10.00</view> -->
            <view class="flex align-center">
              <image src="/static/images/rocket.png" class="rocket" />
              <text class="common_color fs-32 rocket_text">100</text>
            </view>
          </view>
        </view>
      </view>
      <view class="no_more fs-28 pb-24">{{
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

const award = computed(() => prefixedUrl('award.png'))
const ypjl = computed(() => prefixedUrl('ypjl.png'))
const { config } = getApp().globalData as GlobalDataType
const tjjl = computed(() => prefixedUrl(`${config.APP_TYPE}_tjjl.png`))
const blue_packet = `${config.APP_TYPE}_blue_packet`

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
    goodsKey: {
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
    },
    isMin: {
      type: Boolean,
      default: false
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

const emit = defineEmits(['scroll', 'lower', 'upper', 'detail'])
const triggered = ref(false)
const enabled = ref(false)
onReady(() => {
    if (props.goodsKey > 0) {
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
    goPage(`/pages/productDetail/index?id=${item.id}`)
}
</script>

<style scoped lang="scss">
.scroll_wrap {
  width: 100%;
  box-sizing: border-box;
}
.list {
  padding-top: 4px;
  flex-wrap: wrap;
}
.good_item {
  background: #fff;
  width: 332rpx;
  height: 472rpx;
  display: block;
  box-sizing: border-box;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 34rpx;
  .good_img {
    display: block;
    width: 100%;
    height: 332rpx;
  }
  .good_title {
    color: $--color-main;
    font-size: 30rpx;
  }
  .salary {
    color: $--color-danger;
  }
  .common_color {
    color: $--color-sub;
  }
  .rocket {
    display: inline-block;
    width: 28rpx;
    height: 28rpx;
    margin-right: 2rpx;
  }
}
.min_list {
  .good_item {
    width: 248rpx;
    height: 330rpx;
    .good_img {
      height: 230rpx;
    }
    .good_title {
      font-size: 26rpx;
    }
    .salary {
      font-size: 24rpx;
    }
    .rocket {
      width: 20rpx;
      height: 20rpx;
    }
    .rocket_text {
      font-size: 24rpx;
    }
  }
}
.no_more {
  width: 100%;
  color: $--color-sub;
  text-align: center;
}
</style>
