// 知识点：组合式函数（Composables）、ref、watch、localStorage 持久化
import { ref, watch } from 'vue'

const STORAGE_KEY = 'wanderlog-theme'
const theme = ref(localStorage.getItem(STORAGE_KEY) || 'light')

// 主题变化时：同步到 <html data-theme> 并持久化
// immediate: true —— 初始化时立即执行一次，避免首屏闪烁
watch(
  theme,
  (value) => {
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem(STORAGE_KEY, value)
  },
  { immediate: true }
)

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  return { theme, toggleTheme }
}
