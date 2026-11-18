// 知识点：模块级单例响应式状态（跨组件共享）、watch 深度监听、localStorage 持久化
import { ref, watch } from 'vue'

const STORAGE_KEY = 'wanderlog-favorites'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const favorites = ref(load())

watch(favorites, (value) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}, { deep: true })

export function useFavorites() {
  const isFavorite = (id) => favorites.value.includes(id)

  const toggleFavorite = (id) => {
    const index = favorites.value.indexOf(id)
    if (index >= 0) favorites.value.splice(index, 1)
    else favorites.value.push(id)
  }

  return { favorites, isFavorite, toggleFavorite }
}
