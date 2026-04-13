/** 全局变量类型定义 */
interface GlobalDataType extends AnyObject {
    menu: any
    system: string
    ratio: number
    capsuleRight: number
    statusBarHeight: number
    navigationBar: number
    hideCustom: Boolean
    customHeaderHeight: number
    phone: string
    location: any
    uid: number
    open_id: string
    device_id: string
    first_authority: boolean
    isWorkWx: boolean
    isInit: boolean
    commonConst: any
    cityList: any[]
    categoryList: any[]
    textArea: any
    category: any
    config: any
    shareData: any
    bannerList: any[]
}

// 配置文件
interface EnvVarType {
    BASE_API: string
    IMG_URL: string
    ENV_VERSION: string
}

// formList 定义
interface optionType {
    key: string | number
    val: string
}
interface cascaderType extends optionType {
    children: cascaderType[]
}
interface formItemType {
    key: string
    title: string
    type: string
    format?: string
    start?: string
    end?: string
    startKey?: string
    endKey?: string
    label?: string
    value?: string
    required?: boolean
    slotLabel?: boolean
    lastLevel?: boolean
    disabled?: boolean
    maxlength?: number | string
    placeholder?: string
    joinmark?: string
    append?: string
    clearable?: boolean
    defalutVal?: any
    options?: object[]
    change?: Function
    blur?: Function
}
