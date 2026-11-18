// 知识点：模块级单例响应式状态（跨页面共享）、watch 深度监听、uni 本地存储持久化
import { ref, watch } from 'vue'

const STORAGE_KEY = 'wanderlog-favorites'

function load() {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (!raw) return []
    return typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch (e) {
    return []
  }
}

const favorites = ref(load())

watch(
  favorites,
  (value) => {
    try {
      uni.setStorageSync(STORAGE_KEY, JSON.stringify(value))
    } catch (e) {
      // 忽略存储异常
    }
  },
  { deep: true }
)

export function useFavorites() {
  const isFavorite = (id) => favorites.value.includes(id)

  const toggleFavorite = (id) => {
    const index = favorites.value.indexOf(id)
    if (index >= 0) favorites.value.splice(index, 1)
    else favorites.value.push(id)
  }

  return { favorites, isFavorite, toggleFavorite }
}
