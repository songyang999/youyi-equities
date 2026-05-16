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
    mobile: string
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

// 产品数据
interface ProductItem {
    productTypeId: number;
    productName: string;
    price: number;
    productPictureUrl: string;
    productKey: string;
    productDetail: string;
}

// 订单数据
interface OrderItem {
    statusInfo: string;
    orderId: string;
    idCard: string;
    mobile: string;
    bindTraceNo: string;
    productKey: string;
    serviceName: string;
    cardNo: string;
    productName: string;
    productTypeId: string;
    createTime: string;
    expirationTime: string;
    conversionTime: string;
    feeTime: string;
    price: string;
    productTypeName: string;
    serviceId: string;
    account: string;
    status: string;
}

// 包月服务
interface ServiceItem {
    orderId: string;
    statusInfo: string;
    price: string;
    productTypeName: string;
    feeType: string;
    productKey: string;
    productName: string;
    productTypeId: string;
    conversionTime: string;
}
