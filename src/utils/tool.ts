import dayjs from 'dayjs'
import test from './test'
import ENV_CONFIG from '@/config/env'
import { burialPoint } from '@/api'
import { getResumeView } from '@/api/resume'
import md5 from '@/utils/md5'
const NODE_ENV = import.meta.env.MODE

/**
 * @description: 获取签名
 */
export const getSignKey = (data = {}, path: string) => {
    const { config } = getApp().globalData as GlobalDataType
    let secret_key = ''
    if (NODE_ENV === 'dev') {
        secret_key = config.SECRET_KEY
    } else if (NODE_ENV === 'pre') {
        secret_key = config.PRE_SECRET_KEY
    } else if (NODE_ENV === 'trial') {
        secret_key = config.TRIAL_SECRET_KEY
    } else if (NODE_ENV === 'prod') {
        secret_key = config.PROD_SECRET_KEY
    }
    const params = {
        app_id: 'wanpin-small-procedure',
        ts: Math.floor(new Date().getTime() / 1000),
        xd_version: '1.0.0',
        path,
    }
    let sign_obj = Object.assign({}, params, { secret_key })
    for (const key in data) {
        if (!(test.array(data[key]) || test.object(data[key]) || data[key] === null || data[key] === undefined)) {
            sign_obj[key] = data[key]
        }
    }
    sign_obj = sortObjectKeys(sign_obj)
    let xd_sign = ''
    for (const key in sign_obj) {
        xd_sign += xd_sign ? `&${key}=${sign_obj[key]}` : `${key}=${sign_obj[key]}`
    }
    // console.log('xd_sign==>', xd_sign)
    return {
        xd_sign: md5(xd_sign),
        ...params,
    }
}
const sortObjectKeys = (obj) => {
    const sortedKeys = Object.keys(obj).sort()
    const sortedObject: any = {}

    for (const key of sortedKeys) {
        sortedObject[key] = obj[key]
    }

    return sortedObject
}

/**
 * @description: 是否登陆
 */
export const getIsLogin = () => {
    const { phone } = getApp().globalData as GlobalDataType
    return !!phone
}

/**
 * @description: 埋点
 */
// let timer: any
export const handleBurialPoint = async (action: string | object) => {
    const option = { timer: 0 }
    putBurialPoint(action, option)
}
const putBurialPoint = async (action: string | object, option: any) => {
    clearTimeout(option.timer)
    const app = getApp()
    let open_id = ''
    if (app && app.globalData) {
        const global = getApp().globalData as GlobalDataType
        open_id = global.open_id
    }

    if (open_id) {
        const params = typeof action === 'string' ? { action, open_id: open_id } : { open_id: open_id, ...action }
        await burialPoint(params)
    } else {
        option.timer = setTimeout(() => {
            putBurialPoint(action, option)
        }, 300)
    }
}

/**
 * @description: toast提示
 */
export const toast = (title: string, duration = 1500) => {
    uni.showToast({
        title: title,
        icon: 'none',
        duration: duration,
    })
}

/**
 * @description: 清除空格
 */
export const trim = (str: string, pos = 'both') => {
    if (pos == 'both') {
        return str.replace(/^\s+|\s+$/g, '')
    } else if (pos == 'left') {
        return str.replace(/^\s*/, '')
    } else if (pos == 'right') {
        return str.replace(/(\s*$)/g, '')
    } else if (pos == 'all') {
        return str.replace(/\s+/g, '')
    } else {
        return str
    }
}

/**
 * @description: 生成日期下拉项
 * @param start 需要多少条数据
 * @param end 距现在几年
 */
interface dateType {
    key: string
    val: string
    children?: dateType[]
}
export const getDate = (start: number, end = 0, level = 2) => {
    let year = dayjs().year() - end
    const month = dayjs().month() + 1
    const day = dayjs().date()
    const list: dateType[] = []
    for (let i = 0; i < start; i++) {
        list.push({
            key: year + '',
            val: year + '年',
            children:
                i === 0
                    ? getMonth({ year: year + '', day, level, month, rest: month })
                    : getMonth({ year: year + '', day, level, month: 12 }),
        })
        year -= 1
    }
    return list
}

interface monthType {
    year: string
    month: number
    level: number
    day: number
    rest?: number
}
const getMonth = (params: monthType) => {
    const months: dateType[] = []
    for (let i = 0; i < params.month; i++) {
        const m = i + 1
        months.push({
            key: m > 9 ? m + '' : '0' + m,
            val: m + '月',
            children: params.level > 2 ? getDay(params.year, m + '') : [],
        })
    }
    return months
}
const getDay = (year: string, month: string) => {
    const dayNum = dayjs(`${year}-${month}`).daysInMonth()
    const days: dateType[] = []
    for (let i = 0; i < dayNum; i++) {
        const d = i + 1
        days.push({
            key: d > 9 ? d + '' : '0' + d,
            val: d + '日',
        })
    }
    return days
}

/**
 * @description: 路由跳转
 * @param url 路由
 */
export const goPage = (url: string) => {
    uni.navigateTo({
        url,
    })
}

/**
 * @description: 计算Dom高度
 * @param className class名
 */
export const getDomHeight = (className: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const query = uni.createSelectorQuery().select(`.${className}`)
        query
            .boundingClientRect((data: any) => {
                // console.log(data)
                // data - 各种参数
            })
            .exec((res: any) => {
                const height = (res && res[0] && res[0]['height']) || 0
                resolve(height)
                // console.log('res==', res)
            })
    })
}

/**
 * @description: 计算页面剩余高度
 * @param className class名
 */
export const getRmainHeight = (classNames: string[]): Promise<number> => {
    return new Promise((resolve, reject) => {
        let total = 0
        let count = 0
        const processClass = async (className) => {
            const height = await getDomHeight(className)
            total += height
            count++

            if (count === classNames.length) {
                const win: any = uni.getWindowInfo()
                resolve(win.windowHeight - total)
            }
        }
        for (const className of classNames) {
            processClass(className)
        }
    })
}

/**
 * @description: 补全文件地址
 * @param name 图片名
 */
export const prefixedUrl = (name: string) => {
    if (!name) return ''
    const path = name.includes('html') ? 'h5' : 'image'
    return `${ENV_CONFIG.IMG_URL}/${path}/${name}?${dayjs().valueOf()}`
}

/**
 * @description: 精简城市
 * @param city 城市名
 */
export const shortCity = (city: string) => {
    if (!city) return ''
    const suffixRegex = /(特别行政区|自治州|地区|市)$/
    return city.replace(suffixRegex, '')
}

/**
 * @description: 根据id获取对象
 */
export const getItem = (arr, id, key) => {
    let obj = {}
    arr.map((item) => {
        if (item[key] === id) {
            obj = item
        }
    })
    return obj
}

/**
 * @description: 职位薪资格式化
 * @param row 职位信息
 */
export const salaryFormat = (row: any) => {
    const { salary_min, salary_max, month_number, salary_type } = row
    const unitObj = {
        1: '/时',
        2: '/天',
        4: '/年',
        5: '面议',
    }
    if (salary_type === 5) {
        return {
            salary: unitObj[salary_type],
            unit: '',
        }
    } else {
        const unit = salary_min > 999 ? 'K' : '元'
        let min_format = salary_min > 999 ? Math.floor((salary_min / 1000) * 10) / 10 : salary_min
        let max_format = salary_min > 999 ? Math.floor((salary_max / 1000) * 10) / 10 : salary_max
        if (min_format >= 100) min_format = Math.floor(min_format)
        if (max_format >= 100) max_format = Math.floor(max_format)
        const format = salary_max > salary_min ? `${min_format}-${max_format}${unit}` : `${min_format}${unit}`
        if (salary_type === 3 && month_number) {
            return {
                salary: `${format}*${month_number}薪`,
                unit: '',
            }
        } else if (salary_type && salary_type !== 3) {
            return {
                salary: format,
                unit: unitObj[salary_type],
            }
        } else {
            return {
                salary: format,
                unit: '',
            }
        }
    }
}

/**
 * @description: 详情教育信息格式化
 * @param row 职位信息
 */
export const baseFormat = (row, symbol = '·') => {
    const { education_format, work_year, job_nature_format } = row
    let format = education_format === '不限' ? '学历不限' : education_format
    const workYear = [
        { key: 0, val: '经验不限' },
        { key: 1, val: '1-3年' },
        { key: 2, val: '3-5年' },
        { key: 3, val: '5-10年' },
        { key: 4, val: '10年以上' },
    ]
    const obj: any = getItem(workYear, work_year, 'key')
    format += format ? ` ${symbol} ${obj.val}` : obj.val
    if (job_nature_format) format += format ? ` ${symbol} ${job_nature_format}` : job_nature_format
    return format
}

/**
 * @description: canvas绘制文字自动换行
 */
export const splitStringsInArray = (strArr, maxWidth, ctx) => {
    const result: string[] = []
    strArr.forEach((text) => {
        if (text) {
            const arr = splitTextIntoLines(text, maxWidth, ctx)
            result.push(...arr)
        } else {
            result.push('')
        }
    })
    return result
}
export const splitTextIntoLines = (text, maxWidth, ctx) => {
    const words = text.split('')
    const lines: string[] = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + '' + words[i]
        const testLineWidth = ctx.measureText(testLine).width

        if (testLineWidth <= maxWidth) {
            currentLine = testLine
        } else {
            lines.push(currentLine)
            currentLine = words[i]
        }
    }
    lines.push(currentLine)
    return lines
}

/**
 * @description: scene传参格式化
 */
export const getSceneFormat = (scene: string) => {
    scene = decodeURIComponent(scene)
    const keyValuePairs = scene.split('&')
    const result = {}
    for (let i = 0; i < keyValuePairs.length; i++) {
        const keyValue = keyValuePairs[i].split('=')
        const key = keyValue[0]
        const value = test.digits(keyValue[1]) ? +keyValue[1] : keyValue[1]
        result[key] = value
    }
    return result
}

/**
 * @description: 获取简历信息
 */
export const getResumeInfo = async () => {
    try {
        const res: any = await getResumeView()
        if (!res.data) return false
        const form = res.data
        const keys = ['employments_info', 'projects_info', 'educations_info', 'skills', 'credentials']
        for (const key of keys) {
            form[key] = form[key] ? form[key] : []
        }
        form['gender'] = form['gender'] || 1
        return form
    } catch (error) {
        return false
    }
}

/**
 * @description: 级联数据回显
 * @param val 选中值
 * @param list 级联数组
 * @param level 层级
 */
export const getCurrentArr = (val: string, list: any[], level = 2) => {
    let arr: Array<string> = []
    for (let i = 0; i < list.length; i++) {
        if (list[i].children) {
            arr[0] = list[i].name
            for (let j = 0; j < list[i].children.length; j++) {
                if (list[i].children[j].children && level === 3) {
                    arr[1] = list[i].children[j].name
                    for (let k = 0; k < list[i].children[j].children.length; k++) {
                        if (list[i].children[j].children[k].name === val) {
                            arr[2] = list[i].children[j].children[k].name
                            return arr
                        }
                    }
                }
                if (list[i].children[j].name === val && level === 2) {
                    arr[1] = list[i].children[j].name
                    return arr
                }
            }
        }
    }
    return arr.length === level ? arr : []
}

/**
 * @description: 日期范围格式化
 * @param start 开始时间
 * @param end 结束时间
 */
export const dateFormat = (start, end) => {
    let format = start.replace(/-/g, '.')
    format += end === '至今' ? '-至今' : `-${end.replace(/-/g, '.')}`
    return format
}

/**
 * @description: 教育经历信息格式化
 * @param row 教育经历
 */
export const eduFormat = (row) => {
    const { education, is_recruit, major_name } = row
    const { commonConst } = getApp().globalData as GlobalDataType
    let format = education ? getItem(commonConst.talent_education || [], education, 'key')['val'] : ''
    const recruits = {
        1: '统招',
        2: '非统招',
    }
    if (is_recruit) format += format ? ` · ${recruits[is_recruit]}` : recruits[is_recruit]
    if (major_name) format += format ? ` · ${major_name}` : major_name
    return format
}

/**
 * @description: 获取距离最近地址
 * @param arr 地址列表
 * @param city_name 城市名称
 */
interface locType {
    city_name: string
    address: string
    distance: number
    distance_format: string
    lat: number
    lng: number
}
export const getLatelyLoc = (arr, city_name) => {
    let loc = {
        city_name: '',
        address: '',
        distance: 0,
        distance_format: '',
        lat: 0,
        lng: 0,
    }
    if (!city_name) {
        loc = getCurrentLoc(arr) as locType
        return loc
    }
    const currentPlace = arr.filter((item) => city_name === item.city_name)
    if (currentPlace.length) {
        loc = getCurrentLoc(currentPlace) as locType
    } else {
        loc = getCurrentLoc(arr) as locType
    }
    return loc
}
const getCurrentLoc = (arr) => {
    let distance = 0
    let loc = {}
    arr.forEach((item) => {
        if (distance && distance > item.distance) {
            distance = item.distance
            loc = item
        } else if (!distance) {
            distance = item.distance
            loc = item
        }
    })
    return loc
}

/**
 * @description: 根据时间排序
 */
export const getSortTime = (a, b, start, end) => {
    const endA = a[end] === '至今' ? new Date() : new Date(a[end])
    const endB = b[end] === '至今' ? new Date() : new Date(b[end])
    if (endA < endB) {
        return 1
    } else if (endA > endB) {
        return -1
    } else {
        const startA = new Date(a[start])
        const startB = new Date(b[start])
        if (startA < startB) {
            return 1
        } else if (startA > startB) {
            return -1
        } else {
            return 0
        }
    }
}

/**
 * @description: 36进制转10进制
 * @param val 入参
 */
export const base36ToDecimal = (val) => {
    return parseInt(val, 36)
}

/**
 * @description toFixed四舍五入出现的精度问题
 * @param data 金额
 * @param len 保留小数长度
 */
export function toFixedFun(data, len) {
    const number = Number(data)
    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString()
    }
    if (typeof len === 'undefined' || len === 0) {
        return Math.round(number).toString()
    }
    let result = number.toString()
    const numberArr = result.split('.')

    if (numberArr.length < 2) {
        // 整数的情况
        return padNum(result)
    }
    const intNum = numberArr[0] // 整数部分
    const deciNum = numberArr[1] // 小数部分
    const lastNum = deciNum.substr(len, 1) // 最后一个数字

    if (deciNum.length === len) {
        // 需要截取的长度等于当前长度
        return result
    }
    if (deciNum.length < len) {
        // 需要截取的长度大于当前长度 1.3.toFixed(2)
        return padNum(result)
    }
    // 需要截取的长度小于当前长度，需要判断最后一位数字
    result = `${intNum}.${deciNum.substr(0, len)}`
    if (parseInt(lastNum, 10) >= 5) {
        // 最后一位数字大于5，要进位
        const times = Math.pow(10, len) // 需要放大的倍数
        let changedInt = Number(result.replace('.', '')) // 截取后转为整数
        changedInt++ // 整数进位
        changedInt /= times // 整数转为小数，注：有可能还是整数
        result = padNum(`${changedInt}`)
    }
    return result
    // 对数字末尾加0
    function padNum(num) {
        const dotPos = num.indexOf('.')
        if (dotPos === -1) {
            // 整数的情况
            num += '.'
            for (let i = 0; i < len; i++) {
                num += '0'
            }
            return num
        } else {
            // 小数的情况
            const need = len - (num.length - dotPos - 1)
            for (let j = 0; j < need; j++) {
                num += '0'
            }
            return num
        }
    }
}

/**
 * 注释：
 * 千位分隔符
 * @param {string} value
 * @param {Number} len
 * @param {Boolean} isFree
 * @return {string}
 */
export function separatorFilter(value, len, isFree = false) {
    if (value === '') return value
    let num = value
    if (len || len === 0) {
        num = toFixedFun(value, len)
    } else {
        const arr = num.toString().split('.')
        if (!arr[1] || arr[1].length < 2) num = toFixedFun(value, 2)
    }
    if (isFree) num = parseFloat(num)
    const res = num.toString().replace(/\d+/, function (n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
            return $1 + ','
        })
    })
    return res
}

/**
 * @description 过滤input密码类型只输入数字,只保留num位小数
 */
export function keyInput(val, num) {
    val = (val + '').replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
    val = val.replace('-', '')
    val = (val + '').replace(/\.{2,}/g, '.') // 只保留第一个.清除多余的
    val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    // eslint-disable-next-line no-eval
    const regexStr = '([0-9]+.[0-9]{' + num + '})[0-9]*'
    const dynamicRegex = new RegExp(regexStr)
    val = val.replace(dynamicRegex, '$1') // 只保留num位小数
    if (val.indexOf('.') <= 0 && val !== '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        val = parseFloat(val)
    }
    if (isNaN(val)) {
        return ''
    }
    return val + ''
}

/**
 * @description 奖励方案格式化
 */
interface ruleType {
    id: number
    node_name: string
    days: number
    amount_format: string
}
export function rewardRuleFormat(data: ruleType) {
    const { node_name, days, amount_format } = data
    let format = node_name
    if (days > 0) format += `${days}天`
    format += `${amount_format}元`
    return format
}
