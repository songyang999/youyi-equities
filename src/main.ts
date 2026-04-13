import { createSSRApp } from 'vue'
import '@/assets/scss/index.scss'
import App from './App.vue'
import '@/types/global.d'
// import { GlobalDataType } from '@/types/global.d'
export function createApp() {
    const app = createSSRApp(App)
    return {
        app,
    }
}
