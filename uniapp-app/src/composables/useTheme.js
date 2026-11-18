// 知识点：组合式函数、ref、watch、uni 本地存储持久化、原生导航栏同步
import { ref, watch } from 'vue'

const STORAGE_KEY = 'wanderlog-theme'

function loadTheme() {
  try {
    return uni.getStorageSync(STORAGE_KEY) || 'light'
  } catch (e) {
    return 'light'
  }
}

const theme = ref(loadTheme())

export function applyThemeToNative() {
  // #ifndef H5
  const dark = theme.value === 'dark'
  try {
    uni.setNavigationBarColor({
      frontColor: dark ? '#ffffff' : '#000000',
      backgroundColor: dark ? '#171410' : '#F7F3EC',
    })
    uni.setBackgroundColor({
      backgroundColor: dark ? '#171410' : '#F7F3EC',
      backgroundColorTop: dark ? '#171410' : '#F7F3EC',
      backgroundColorBottom: dark ? '#171410' : '#F7F3EC',
    })
    uni.setTabBarStyle({
      color: dark ? '#A99D8B' : '#776C5E',
      selectedColor: dark ? '#E8855F' : '#D96C4B',
      backgroundColor: dark ? '#221D17' : '#FFFFFF',
      borderStyle: dark ? 'white' : 'black',
    })
  } catch (e) {
    // 某些平台不支持，忽略即可
  }
  // #endif
}

watch(
  theme,
  (value) => {
    try {
      uni.setStorageSync(STORAGE_KEY, value)
    } catch (e) {
      // 忽略存储异常
    }
    applyThemeToNative()
  },
  { immediate: true }
)

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  return { theme, toggleTheme }
}
