import { toast, prefixedUrl, salaryFormat, baseFormat, splitStringsInArray, getLatelyLoc, toFixedFun } from './tool'
import { ref, reactive } from 'vue'
import ENV_CONFIG from '@/config/env'
import { getJobDetail, getWxCode } from '@/api/home'
const { config } = getApp().globalData as GlobalDataType

export default function () {
    const loading = ref(true)
    const mainColor = '#333C5A'
    const commonColor = '#636b78'
    const dangerColor = '#E7615B'
    const subColor = '#A4AFC1'
    const primaryColor = config.APP_TYPE === 'wp' ? '#2B2BFC' : '#5D47F1'
    const bacColor = '#F4F6FB'
    const bgUrl = prefixedUrl(`${config.APP_TYPE}_poster_bac.jpg`)
    const gpsUrl = prefixedUrl(`${config.APP_TYPE}_gps.png`)
    const eduUrl = prefixedUrl(`${config.APP_TYPE}_edu.png`)
    const packetUrl = prefixedUrl('my_red_packet.png')
    const logoUrl = prefixedUrl(`${config.APP_TYPE}_default_logo.png`)
    // const shieldUrl = prefixedUrl('shield.png')
    const titleUrl = prefixedUrl(`${config.APP_TYPE}.png`)

    const files = reactive({
        url: '',
    })
    const getQrCode = async (job_id) => {
        try {
            const { uid } = getApp().globalData as GlobalDataType
            const params = {
                wechat_code_type: 1, // 1: 微信小程序 2: 微信公众号
                job_id,
                code_scene: `jid=${job_id}&uid=${uid}&ut=1`,
                image_width: 128,
                env_version: ENV_CONFIG.ENV_VERSION,
                entry_page: 'pages/jobDetail/index',
                is_preview: true,
            }
            const res: any = await getWxCode(params)
            if (res.data) {
                return res.data.wx_minipro_code_image_preview
            } else {
                loading.value = false
                return false
            }
        } catch (error) {
            loading.value = false
            return false
        }
    }
    // 最近地点
    const city_name = ref('')
    const drawImg = async (res, id) => {
        try {
            const codeUrl = await getQrCode(id)
            if (!codeUrl) {
                toast('网络异常')
                loading.value = false
                return
            }
            const { location } = getApp().globalData as GlobalDataType
            const res2: any = await getJobDetail({ id })
            const info = res2.data
            info.name = info.name.length > 14 ? info.name.slice(0, 12) + '...' : info.name
            info.company_name =
                info.company_name.length > 14 ? info.company_name.slice(0, 12) + '...' : info.company_name
            if (location.city_name) {
                const loc = getLatelyLoc(info.job_locations, location.city_name)
                city_name.value = loc.city_name
            } else {
                city_name.value = info.job_locations[0] && info.job_locations[0]['city_name']
            }

            // Canvas 对象
            const canvas = res[0].node
            // Canvas 画布的实际绘制宽高
            const renderWidth = res[0].width
            const renderHeight = res[0].height
            // Canvas 绘制上下文
            const ctx = canvas.getContext('2d')

            // 初始化画布大小
            canvas.width = renderWidth
            canvas.height = renderHeight
            // 绘制前清空画布
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // 背景图
            ctx.beginPath()
            Promise.all([
                loadImage(canvas, bgUrl),
                loadImage(canvas, gpsUrl),
                loadImage(canvas, eduUrl),
                loadImage(canvas, packetUrl),
                loadImage(canvas, logoUrl),
                // loadImage(canvas, shieldUrl),
                loadImage(canvas, codeUrl),
                loadImage(canvas, titleUrl),
            ])
                .then(([bgImage, gps, edu, packet, logo, qrcode, title]) => {
                    console.log('canvas Start')
                    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
                    ctx.drawImage(gps, 64, 202, 24, 24)
                    ctx.font = '26px normal'
                    let left = ctx.measureText(city_name.value).width + 124
                    ctx.drawImage(edu, left, 202, 24, 24)

                    // 应聘奖励
                    if (info.reward_rule_apply && info.reward_rule_apply.length && info.job_reward_status === 1) {
                        const x = 64
                        const y = 274
                        const h = 68
                        const w = 622
                        const r = 16
                        ctx.beginPath()
                        ctx.lineWidth = 1
                        ctx.strokeStyle = '#FEEDEF'
                        ctx.moveTo(x + r, y)
                        ctx.lineTo(x + w - r, y)
                        ctx.arcTo(x + w, y, x + w, y + r, r)
                        ctx.lineTo(x + w, y + h - r)
                        ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
                        ctx.lineTo(x + r, y + h)
                        ctx.arcTo(x, y + h, x, y + h - r, r)
                        ctx.lineTo(x, y + r)
                        ctx.arcTo(x, y, x + r, y, r)
                        ctx.closePath()
                        ctx.fillStyle = '#FEEDEF'
                        ctx.fill()
                        ctx.stroke()
                        ctx.beginPath()
                        ctx.drawImage(packet, 80, 291, 32, 32)
                    }
                    // logo
                    ctx.drawImage(logo, 64, 1014, 80, 80)
                    ctx.font = '26px normal'

                    // left = ctx.measureText(info.company_name).width + 168
                    // ctx.drawImage(shield, left, 1037, 22, 22)
                    // 加载小程序码并绘制
                    ctx.drawImage(qrcode, 558, 1023, 128, 128)
                    // 底部title
                    if (config.APP_TYPE === 'wp') ctx.drawImage(title, 219, 1222, 57, 32)
                    else ctx.drawImage(title, 224, 1222, 47, 32)
                    fillText(canvas, ctx, renderWidth, renderHeight, info)
                })
                .catch((error) => {
                    console.log(error)
                    loading.value = false
                })
        } catch (error) {
            console.log(error)
        }
    }
    // 加载图片
    const loadImage = (canvas, src) => {
        return new Promise((resolve) => {
            const img = canvas.createImage()
            img.onload = () => resolve(img)
            img.src = src
        })
    }
    // 绘制文本内容
    const fillText = (canvas, ctx, width, height, info: any) => {
        // 职位名称
        ctx.beginPath()
        ctx.font = 'bold 32px Arial'
        ctx.fillStyle = mainColor
        ctx.textBaseline = 'top'
        ctx.fillText(info.name, 64, 102)

        // 薪资
        ctx.fillStyle = dangerColor
        const salay = salaryFormat(info)
        ctx.fillText(`${salay.salary}${salay.unit}`, 64, 151)
        // 地址信息
        ctx.font = '26px normal'
        ctx.fillStyle = mainColor
        ctx.fillText(city_name.value, 100, 203)
        let left = ctx.measureText(city_name.value).width + 160
        const edu_format = baseFormat(info)
        ctx.fillText(edu_format, left, 203)
        // 分割虚线
        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#F2F3F5'
        ctx.moveTo(64, 253)
        ctx.lineTo(686, 253)
        ctx.setLineDash([8])
        ctx.stroke()
        ctx.setLineDash([])

        let x = 64
        let y = 274
        // 应聘奖励
        if (info.reward_rule_apply && info.reward_rule_apply.length && info.job_reward_status === 1) {
            let amount = 0
            info.reward_rule_apply.forEach((item) => {
                amount += Number(item.amount_format)
            })
            ctx.beginPath()
            ctx.font = '26px normal'
            ctx.fillStyle = mainColor
            ctx.fillText('应聘奖励最高', x + 60, y + 21)
            ctx.stroke()
            left = ctx.measureText('应聘奖励最高').width + x + 70
            ctx.beginPath()
            ctx.font = 'bold 26px Arial'
            ctx.fillStyle = dangerColor
            const money = toFixedFun(amount || '0', 2)
            ctx.fillText(money, left, y + 21)
            ctx.stroke()
            left = ctx.measureText(money).width + left + 10
            ctx.beginPath()
            ctx.font = '26px normal'
            ctx.fillStyle = mainColor
            ctx.fillText('元！', left, y + 21)
            ctx.stroke()
            y += 93
        }

        // 职位详情
        ctx.beginPath()
        ctx.font = 'bold 28px Arial'
        ctx.fillStyle = mainColor
        ctx.fillText('职位详情', x, y)

        // 福利信息
        ctx.font = '22px normal'
        x = 64
        y += 55
        let h = 42
        let w = 0
        const r = 4
        info.welfare.forEach((item) => {
            w = ctx.measureText(item.name).width + 24
            if (x + w >= 686) {
                x = 64
                y = y + 58
            }
            ctx.beginPath()
            ctx.lineWidth = 1
            ctx.strokeStyle = bacColor
            ctx.moveTo(x + r, y)
            ctx.lineTo(x + w - r, y)
            ctx.arcTo(x + w, y, x + w, y + r, r)
            ctx.lineTo(x + w, y + h - r)
            ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
            ctx.lineTo(x + r, y + h)
            ctx.arcTo(x, y + h, x, y + h - r, r)
            ctx.lineTo(x, y + r)
            ctx.arcTo(x, y, x + r, y, r)
            ctx.closePath()
            ctx.fillStyle = bacColor
            ctx.fill()
            ctx.stroke()
            ctx.beginPath()
            ctx.fillStyle = commonColor
            ctx.fillText(item.name, x + 12, y + 10)
            ctx.stroke()
            x = x + w + 8
        })
        // 职位描述
        y = y + 72
        ctx.beginPath()
        ctx.font = 'bold 26px Arial'
        ctx.fillStyle = mainColor
        ctx.fillText('职位描述', 64, y)
        y = y + 52
        const lineHeight = 40
        ctx.font = '26px normal'
        ctx.fillStyle = commonColor
        let descs = info.job_describe.split('\n') // 分割换行
        descs = splitStringsInArray(descs, 622, ctx)
        let desc_len = Math.floor((920 - y) / lineHeight)
        desc_len = descs.length > desc_len ? desc_len : descs.length
        for (let i = 0; i < desc_len; i++) {
            ctx.fillText(descs[i], 64, y + i * lineHeight)
        }
        y = y + desc_len * lineHeight
        // 任职要求
        if (920 - y > 116) {
            y = y + 20
            ctx.beginPath()
            ctx.font = 'bold 28px Arial'
            ctx.fillStyle = mainColor
            ctx.fillText('任职要求', 64, y)
            y = y + 52
            ctx.font = '26px normal'
            ctx.fillStyle = commonColor
            descs = info.job_required.split('\n') // 分割换行
            descs = splitStringsInArray(descs, 622, ctx)
            desc_len = Math.floor((920 - y) / lineHeight)
            desc_len = descs.length > desc_len ? desc_len : descs.length
            for (let i = 0; i < desc_len; i++) {
                ctx.fillText(descs[i], 64, y + i * lineHeight)
            }
        }

        // 扫码查看更多职位详情
        ctx.beginPath()
        ctx.font = '26px normal'
        ctx.fillStyle = subColor
        ctx.fillText('扫码查看更多职位详情', 245, 943)
        // 分割虚线
        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#F2F3F5'
        ctx.moveTo(64, 993)
        ctx.lineTo(686, 993)
        ctx.setLineDash([8])
        ctx.stroke()
        ctx.setLineDash([])
        // 公司名称
        ctx.beginPath()
        ctx.font = '26px normal'
        ctx.fillStyle = mainColor
        const company_name = info.company_name.length > 14 ? info.company_name.slice(0, 12) + '...' : info.company_name
        ctx.fillText(company_name, 156, 1041)
        // 长按识码
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = bacColor
        x = 64
        y = 1110
        w = 392
        h = 50
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.arcTo(x + w, y, x + w, y + r, r)
        ctx.lineTo(x + w, y + h - r)
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
        ctx.lineTo(x + r, y + h)
        ctx.arcTo(x, y + h, x, y + h - r, r)
        ctx.lineTo(x, y + r)
        ctx.arcTo(x, y, x + r, y, r)
        ctx.closePath()
        ctx.fillStyle = bacColor
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.font = '24px normal'
        ctx.fillStyle = commonColor
        ctx.fillText('长按识别小程序码，查看职位详情', x + 16, y + 14)
        // 底部二级title
        ctx.beginPath()
        ctx.font = '26px normal'
        ctx.fillStyle = primaryColor
        const sub_title = `｜100%真实靠谱工作`
        if (config.APP_TYPE === 'wp') ctx.fillText(sub_title, 276, 1226)
        else ctx.fillText(sub_title, 271, 1226)
        ctx.stroke()
        uni.canvasToTempFilePath({
            x: 0,
            y: 0,
            width,
            height,
            destWidth: 750,
            destHeight: 1282,
            canvasId: 'shareCanvas',
            canvas,
            success(res) {
                files.url = res.tempFilePath || ''
            },
            fail(err) {
                console.log(err)
                // toast('绘制错误')
            },
            complete() {
                loading.value = false
            },
        })
    }
    // 点击保存图片，暂时不用
    const saveImg = () => {
        uni.saveImageToPhotosAlbum({
            filePath: files.url,
            success(res) {
                if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
                    toast('操作成功')
                }
            },
            fail(err) {
                console.log(err)
                toast(err.errMsg)
            },
        })
    }

    return {
        drawImg,
        saveImg,
        files,
        loading,
    }
}
