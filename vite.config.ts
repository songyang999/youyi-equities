import { defineConfig, UserConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import * as path from 'path'

import eslintPlugin from 'vite-plugin-eslint'
export default defineConfig(() => {
    const additionalData = '@import "~/assets/scss/variable.scss";'
    const config: UserConfig = {
        resolve: { alias: { '~': path.resolve(__dirname, './src') } },
        css: {
            preprocessorOptions: {
                scss: { charset: false, additionalData },
            },
        },

        plugins: [uni(), eslintPlugin()],
    }
    return config
})
