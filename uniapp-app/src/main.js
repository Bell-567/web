import { createSSRApp } from 'vue'
import App from './App.vue'

// uni-app 要求使用 createSSRApp 并导出 createApp 工厂函数
export function createApp() {
  const app = createSSRApp(App)
  return { app }
}
