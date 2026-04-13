/* eslint-disable */
/**
 * 验证电子邮箱格式
 */
function email(value) {
    return /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(
        value
    )
}
function checkEmail(rule, value, data, callback) {
    if (value && !email(value)) {
        callback('请输入正确的邮箱')
    }
    return true
}

/**
 * 验证手机格式
 */
function mobile(value) {
    return /^1[3-9]\d{9}$/.test(value)
}
function checkMobile(rule, value, data, callback) {
    if (value && !mobile(value)) {
        callback('请输入正确的手机号码')
    }
    return true
}

/**
 * 验证微信号
 */
function wechat(value) {
    return /^[a-zA-Z][a-zA-Z\d_-]{5,19}$/.test(value)
}
function checkWechat(rule, value, data, callback) {
    if (value && !wechat(value)) {
        callback('微信号格式不正确')
    }
    return true
}
/**
 * 验证URL格式
 */
function url(value) {
    // eslint-disable-next-line no-empty
    return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/.test(value)
}

/**
 * 验证日期格式
 */
function date(value) {
    return !/Invalid|NaN/.test(new Date(value).toString())
}

/**
 * 验证ISO类型的日期格式
 */
function dateISO(value) {
    // eslint-disable-next-line no-empty
    return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)
}

/**
 * 验证十进制数字
 */
function number(value) {
    // eslint-disable-next-line no-empty
    return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
}

/**
 * 验证整数
 */
function digits(value) {
    return /^\d+$/.test(value)
}
function checkDigits(rule, value, data, callback) {
    if (value && !digits(value)) {
        callback('必须为正整数')
    }
    return true
}

/**
 * 是否车牌号
 */
function carNo(value) {
    // 新能源车牌
    const xreg =
        /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
    // 旧车牌
    const creg =
        /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
    if (value.length === 7) {
        return creg.test(value)
    } else if (value.length === 8) {
        return xreg.test(value)
    } else {
        return false
    }
}

/**
 * 金额,只允许2位小数
 */
function amount(value) {
    //金额，只允许保留两位小数
    return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value)
}

/**
 * 只能输入字母
 */
function letter(value) {
    return /^[a-zA-Z]*$/.test(value)
}

/**
 * 只能是字母或者数字
 */
function enOrNum(value) {
    //英文或者数字
    let reg = /^[0-9a-zA-Z]*$/g
    return reg.test(value)
}

/**
 * 验证是否包含某个值
 */
function contains(value, param) {
    return value.indexOf(param) >= 0
}

/**
 * 验证一个值范围[min, max]
 */
function range(value, param) {
    return value >= param[0] && value <= param[1]
}

/**
 * 验证一个长度范围[min, max]
 */
function rangeLength(value, param) {
    return value.length >= param[0] && value.length <= param[1]
}

/**
 * 是否固定电话
 */
function landline(value) {
    let reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/
    return reg.test(value)
}

/**
 * 判断是否为空
 */
function empty(value) {
    switch (typeof value) {
        case 'undefined':
            return true
        case 'string':
            if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
            break
        case 'boolean':
            if (!value) return true
            break
        case 'number':
            if (0 === value || isNaN(value)) return true
            break
        case 'object':
            if (null === value || value.length === 0) return true
            for (var i in value) {
                return false
            }
            return true
    }
    return false
}

/**
 * 是否json字符串
 */
function jsonString(value) {
    if (typeof value == 'string') {
        try {
            var obj = JSON.parse(value)
            if (typeof obj == 'object' && obj) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }
    return false
}

/**
 * 是否数组
 */
function array(value) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(value)
    } else {
        return Object.prototype.toString.call(value) === '[object Array]'
    }
}

/**
 * 是否对象
 */
function object(value) {
    return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * 是否短信验证码
 */
function code(value, len = 6) {
    return new RegExp(`^\\d{${len}}$`).test(value)
}

/**
 * 校验姓名
 */
function checkName(rule, value, data, callback) {
    const reg = /^[·a-zA-Z\u4e00-\u9fa5]+$/
    if (value && !reg.test(value)) {
        callback('只可输入中文、英文或“·”符号')
    }
    return true
}

/**
 * 校验 中英文_ - ()（）数字
 */
function checkCommonName(rule, value, data, callback) {
    const reg = /^[a-zA-Z0-9-_\u4e00-\u9fa5()（）]+$/
    if (value && !reg.test(value)) {
        callback('只可输入中英文_ -（）数字')
    }
    return true
}

/**
 * 校验身份证号
 */
function checkIdCard(rule, value, data, callback) {
    if (!value) return
    // 校验所有省份
    const province_code = [
        '11',
        '12',
        '13',
        '14',
        '15',
        '21',
        '22',
        '23',
        '31',
        '32',
        '33',
        '34',
        '35',
        '36',
        '37',
        '41',
        '42',
        '43',
        '44',
        '45',
        '46',
        '50',
        '51',
        '52',
        '53',
        '54',
        '61',
        '62',
        '63',
        '64',
        '65',
        '71',
        '81',
        '82',
        '91',
    ]
    if (province_code.indexOf(value.substr(0, 2)) === -1) {
        callback('请输入正确的证件号码')
    }
    const ahead17_char = value.substr(0, 17)
    const last_char = value.substr(-1, 1)
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 前17位的权重
    const c = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 模11后的对应校验码
    let t_res = 0
    for (let i = 0; i < 17; i++) {
        t_res += ahead17_char[i] * factor[i]
    }
    if (last_char !== c[t_res % 11]) {
        console.log('111')
        callback('请输入正确的证件号码')
    }
    return true
}

export default {
    email,
    checkEmail,
    mobile,
    checkMobile,
    wechat,
    checkWechat,
    url,
    date,
    dateISO,
    number,
    digits,
    checkDigits,
    carNo,
    amount,
    letter,
    enOrNum,
    contains,
    range,
    rangeLength,
    empty,
    isEmpty: empty,
    jsonString,
    landline,
    object,
    array,
    code,
    checkName,
    checkCommonName,
    checkIdCard,
}
