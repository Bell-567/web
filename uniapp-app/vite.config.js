import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// uni-app Vue3 + Vite 工程：H5 / 小程序 / App 共用同一套源码
export default defineConfig({
  plugins: [uni()],
  server: {
    // 开发时把 /api 代理到 Express 后端，避免跨域
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
