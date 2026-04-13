import QQMapWX from './qqmap-wx-jssdk'
const { config } = getApp().globalData as GlobalDataType
// 注意替换为你自己的腾讯地图密钥
const qqmapsdk = new QQMapWX({
    key: config.MAP_KEY,
})

export default qqmapsdk
