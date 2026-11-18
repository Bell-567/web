import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base 使用相对路径，便于部署到任意静态托管（Netlify / GitHub Pages 子路径均可）
export default defineConfig({
  plugins: [vue()],
  base: './',
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
