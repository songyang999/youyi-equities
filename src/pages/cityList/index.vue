<!--
 * @Author: XHL
 * @Date: 2023-08-21
 * @Description: 选择城市
-->
<template>
    <general-custom title="选择城市">
        <template #content>
            <view class="city_wrap">
                <view class="current_city fs-32 px-32 py-24">当前城市：{{ currentCity }}</view>
                <scroll-view
                    :scroll-top="scrollTop"
                    :style="{ height: `${scrollHeight}px` }"
                    scroll-y="true"
                    class="city_scroll_wrap"
                    @scroll="scrollCity"
                >
                    <view class="city_list fs-32">
                        <template v-for="pro in provinceList" :key="pro.letter">
                            <view v-for="item in pro.data || []" :key="item.id" class="city_title_wrap">
                                <view class="city_title px-32 py-12">{{ item.name }}</view>
                                <view class="city_list_block px-32">
                                    <view
                                        v-for="city in item.children || []"
                                        :key="city.name"
                                        class="city_item"
                                        @click="chooseCity(city)"
                                        >{{ city.name }}</view
                                    >
                                </view>
                            </view>
                        </template>
                    </view>
                </scroll-view>
                <view class="safe_area"></view>
                <view class="city_menu fs-24" @click.stop="">
                    <view
                        v-for="(item, index) in provinceList"
                        :key="item.letter"
                        :class="{ active_menu: active === item.letter }"
                        class="menu"
                        @click="scrollToCity(index)"
                        >{{ item.letter }}</view
                    >
                </view>
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getProvinceList } from '@/api/home'
import { getRmainHeight } from '@/utils/tool'

// 导航栏高度
const { customHeaderHeight } = getApp().globalData as GlobalDataType

// 当前所在城市
const currentCity = ref('')
onLoad((query: any) => {
    currentCity.value = query.city
})

// 城市列表高度
const scrollHeight = ref(0)
onReady(async () => {
    const height = await getRmainHeight(['current_city', 'safe_area'])
    scrollHeight.value = height - customHeaderHeight
    await getProvince()
    await initTop()
})

interface cityType {
    id: number
    name: string
}
interface proType {
    id: number
    name: string
    children: cityType[]
}
interface listType {
    letter: string
    data: proType[]
}

const provinceList = ref<listType[]>([])
const active = ref('')
const getProvince = async () => {
    try {
        const res: any = await getProvinceList()
        if (res.data) {
            provinceList.value = res.data.list || []
            active.value = provinceList.value[0] && provinceList.value[0]['letter']
        }
    } catch (error) {
        //
    }
}

// 选择城市
const chooseCity = (item: cityType) => {
    const { id, name } = item
    const globalData = getApp().globalData as GlobalDataType
    globalData.location.city_id = id
    globalData.location.city_name = name
    uni.setStorageSync('location', JSON.stringify(globalData.location))
    uni.navigateBack()
}

// 右侧索引
let cityTops: Array<number> = []
const initTop = () => {
    const query = uni.createSelectorQuery()
    query
        .selectAll('.city_title_wrap')
        .boundingClientRect()
        .exec((rect?: any) => {
            const tops: Array<number> = []
            let top: number = 0
            tops.push(top)
            if (rect[0].length !== 0) {
                for (let i in rect[0]) {
                    top += rect[0][i].height
                    tops.push(top)
                }
            }
            cityTops = tops
        })
}
const scrollTop = ref<number>(0)
let tapblur = false
const scrollToCity = (index) => {
    scrollTop.value = cityTops[index]
    active.value = provinceList.value[index] && provinceList.value[index]['letter']
    tapblur = true
}

const scrollCity = (e: any) => {
    if (tapblur) {
        tapblur = false
        return
    }
    const top = e.detail.scrollTop
    for (let i = 0; i < cityTops.length; i++) {
        if (top >= cityTops[i] && top < cityTops[i + 1]) {
            active.value = provinceList.value[i] && provinceList.value[i]['letter']
        }
    }
}
</script>

<style scoped lang="scss">
.city_wrap {
    background-color: #f1f2f6;
}
.current_city {
    width: 100%;
    height: 94rpx;
    line-height: 46rpx;
    box-sizing: border-box;
    color: $--color-main;
    background-color: #ffffff;
}
.city_scroll_wrap {
    box-sizing: border-box;
    color: $--color-sub;
    .hot_box {
        background-color: #ffffff;
        box-sizing: border-box;
        .main_circle_button {
            border-radius: 8rpx;
            border: 1px solid $--color-border;
            display: inline-block;
        }
    }
    .city_list {
        width: 100%;
        color: $--color-main;
        view {
            box-sizing: border-box;
        }
        .city_list_block {
            background-color: #ffffff;
            .city_item {
                height: 98rpx;
                display: flex;
                align-items: center;
                border-bottom: 1px solid $--color-border;
                &:last-child {
                    border-bottom: none;
                }
            }
        }
    }
}
.city_menu {
    padding: 0 32rpx;
    position: fixed;
    right: 0;
    top: calc(50% + 50px);
    transform: translateY(-50%);
    color: $--color-main;
    font-weight: bold;
    .menu {
        width: 34rpx;
        height: 34rpx;
        border-radius: 4rpx;
        text-align: center;
        line-height: 34rpx;
        margin-bottom: 8rpx;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .active_menu {
        background-color: $--color-primary;
        color: #ffffff;
    }
}
.safe_area {
    width: 100%;
    height: constant(safe-area-inset-bottom);
    height: env(safe-area-inset-bottom);
}
</style>
