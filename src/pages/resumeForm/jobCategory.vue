<!--
 * @Author: XHL
 * @Date: 2023-10-23
 * @Description: 职位分类
-->
<template>
    <general-custom ref="general_custom" :title="title">
        <template #content>
            <!--  :style="{ top: customHeaderHeight + 'px' }" -->
            <view class="search_wrap px-24 py-28">
                <view class="search flex align-center">
                    <svg-icon icon-class="search" class="fs-24" />
                    <input
                        v-model="keyword"
                        confirm-type="search"
                        placeholder="搜索职位"
                        placeholder-style="font-size: 26rpx;"
                        class="search_input fs-26 ml-16"
                        @input="searchList"
                        @confirm="searchList"
                    />
                    <view v-if="!!keyword" class="close_btn" @click="clearKeyword">
                        <svg-icon icon-class="close" class="fs-28" />
                    </view>
                </view>
            </view>
            <!--  :style="{ height: scrollHeight + 'px' }" -->
            <view class="category_wrap">
                <template v-if="isSearch">
                    <scroll-view
                        v-if="searchCategoryList.length"
                        :style="{ height: `${scrollHeight}px` }"
                        scroll-y
                        class="search_list pt-10 px-24 pb-30"
                    >
                        <view
                            v-for="item in searchCategoryList"
                            :key="item.id"
                            class="category_item"
                            @click="selectKey(item)"
                        >
                            <view class="category_title fs-32 mb-8">
                                <rich-text class="rich" :nodes="item.nodes"></rich-text>
                            </view>
                            <view class="category_sub fs-26">{{ item.level1_name }} - {{ item.level2_name }}</view>
                        </view>
                    </scroll-view>
                    <view v-else class="no_data_box">
                        <no-data text="暂无数据" />
                    </view>
                </template>
                <template v-else>
                    <scroll-view :style="{ height: `${scrollHeight}px` }" scroll-y class="first_order_list">
                        <view
                            v-for="item in categoryList"
                            :key="item.id"
                            :class="{ first_order_active: item.id === level1_id }"
                            class="first_order pr fs-28 pl-24"
                            @click="selectFirst(item)"
                            >{{ item.name }}</view
                        >
                    </scroll-view>
                    <scroll-view :style="{ height: `${scrollHeight}px` }" scroll-y class="level2_list">
                        <view v-for="item in level2_list" :key="item.id" class="level2_box">
                            <view class="level2_name fs-32 mb-24">{{ item.name }}</view>
                            <view class="three_level_list">
                                <view
                                    v-for="child in item.children"
                                    :key="child.id"
                                    :class="{ three_level_active: three_key === child.id }"
                                    class="three_level_name fs-26 py-10 px-16 mb-24"
                                    @click="selectThree({ level2_id: item.id, level2_name: item.name, ...child })"
                                >
                                    {{ child.name }}
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </template>
            </view>
        </template>
    </general-custom>
</template>

<script setup lang="ts">
import { onLoad, onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getRmainHeight, getItem } from '@/utils/tool'
import { searchJobCategory } from '@/api/resume'
const { customHeaderHeight, categoryList } = getApp().globalData as GlobalDataType

const title = ref<string>('')
const key = ref<string>('')
const format = ref<string>('')
interface categoryType {
    id: number
    name: string
    children: categoryType[]
}
const level1_id = ref(0)
const level1_name = ref('')
const level2_list = ref<categoryType[]>([])
const three_key = ref(0)

onLoad(async (query: any) => {
    title.value = query.title
    key.value = query.key
    format.value = query.format || ''
    uni.setNavigationBarTitle({ title: query.title })
    const { category } = getApp().globalData as GlobalDataType
    if (category[key.value] && category[key.value][0]) {
        const val_key = format.value ? 'id' : 'name'
        const obj = getItem(categoryList, category[key.value][0], val_key) as categoryType
        level1_id.value = obj.id || 0
        level1_name.value = obj.name || ''
        level2_list.value = obj['children'] || []
        const second_obj = getItem(level2_list.value, category[key.value][1], val_key) as categoryType
        const three_obj = getItem(second_obj['children'] || [], category[key.value][2], val_key) as categoryType
        three_key.value = three_obj.id || 0
    } else {
        level1_id.value = categoryList[0]['id']
        level1_name.value = categoryList[0]['name']
        level2_list.value = categoryList[0]['children'] || []
    }
})

// 选择一级
const show_second = ref(true)
const selectFirst = (item) => {
    show_second.value = false
    level1_id.value = item.id
    level1_name.value = item.name
    setTimeout(() => {
        level2_list.value = getItem(categoryList, level1_id.value, 'id')['children'] || []
        show_second.value = true
    })
}

// 选择三级
const selectThree = (child) => {
    three_key.value = child.id
    const globalData = getApp().globalData as GlobalDataType
    if (format.value) {
        globalData['category'][key.value] = [level1_id.value, child.level2_id, child.id]
        globalData['category'][format.value] = [level1_name.value, child.level2_name, child.name]
    } else {
        globalData['category'][key.value] = [level1_name.value, child.level2_name, child.name]
    }
    uni.navigateBack()
}

// 职位列表高度
const scrollHeight = ref(0)
onReady(async () => {
    const height = await getRmainHeight(['search_wrap'])
    scrollHeight.value = height - customHeaderHeight
})

// 搜索
interface searchType {
    id: number
    level1_id: number
    level2_id: number
    name: string
    level1_name: string
    level2_name: string
    nodes: string
}
const searchCategoryList = ref<searchType[]>([])
const keyword = ref<string>('')
const isSearch = ref(false)
const searchList = async () => {
    if (keyword.value) {
        isSearch.value = true
        const params = { name: keyword.value, page: 1, page_num: 30 }
        const res: any = await searchJobCategory(params)
        const allList = (res.data && res.data.list) || []
        console.log('all==>', allList)
        const list = allList.map((item) => {
            item.nodes = item.name.replace(keyword.value, "<span style='color:#3675f6;'>" + keyword.value + '</span>')
            return item
        })
        searchCategoryList.value = list
    } else {
        isSearch.value = false
    }
}

const clearKeyword = () => {
    keyword.value = ''
    searchList()
}

// 搜索选择
const selectKey = (item) => {
    const globalData = getApp().globalData as GlobalDataType
    if (format.value) {
        globalData['category'][key.value] = [item.level1_id, item.level2_id, item.id]
        globalData['category'][format.value] = [item.level1_name, item.level2_name, item.name]
    } else {
        globalData['category'][key.value] = [item.level1_name, item.level2_name, item.name]
    }
    uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.search_wrap {
    position: relative;
    z-index: 99;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: 1px solid $--color-border;
    .search {
        width: 100%;
        height: 72rpx;
        border-radius: 40rpx;
        background-color: #fff;
        padding-left: 24rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        border: 1px solid $--color-border;
        .search_input {
            width: 500rpx;
            height: 70rpx;
            flex: 1;
        }
        .close_btn {
            flex-shrink: 0;
            padding: 16rpx 24rpx;
        }
    }
}
.category_wrap {
    // padding-top: 130rpx;
    // min-height: 100%;
    display: flex;
    .search_list {
        flex: 1;
        box-sizing: border-box;
        .category_item {
            width: 100%;
            height: 130rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .category_title {
                color: $--color-main;
            }
            .category_sub {
                color: $--color-sub;
            }
        }
    }
    .no_data_box {
        flex: 1;
        padding-top: 157rpx;
        box-sizing: border-box;
    }
    .first_order_list {
        width: 250rpx;
        padding: 10rpx 10rpx 30rpx 0;
        border-right: 1px solid $--color-border;
        box-sizing: border-box;
        // overflow-y: scroll;
    }
    .first_order {
        height: 98rpx;
        // line-height: 98rpx;
        display: flex;
        align-items: center;
        // line-height: ;
        color: $--color-main;
    }
    .first_order_active.first_order {
        color: $--color-primary;
        font-weight: 600;
        &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 44rpx;
            background-color: $--color-primary;
            position: absolute;
            left: 0;
            top: 26rpx;
        }
    }
    .level2_list {
        flex: 1;
        padding: 38rpx 20rpx 30rpx;
        box-sizing: border-box;
        //overflow-y: scroll;
    }
    .level2_name {
        font-weight: 600;
        color: $--color-main;
        width: 100%;
    }
    .three_level_list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 10rpx;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .three_level_name {
        width: 214rpx;
        box-sizing: border-box;
        border-radius: 8rpx;
        background-color: #f7f8fc;
        color: $--color-sub;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .three_level_active.three_level_name {
        background-color: rgba(54, 117, 246, 0.1);
        color: $--color-primary;
        font-weight: 600;
    }
}
</style>
