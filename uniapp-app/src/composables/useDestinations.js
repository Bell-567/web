// 目的地数据源：优先请求 Express 后端，失败时回退到本地种子数据，
// 保证静态部署（没有后端）时页面依然可用。
import { computed, ref } from 'vue'
import { api } from '../api/client'
import { destinations as fallback } from '../data/destinations'

// 图片属于前端静态资源：后端只提供文字数据时，用本地图片覆盖 API 返回的媒体字段
const localMedia = new Map(
  fallback.map((item) => [item.id, { image: item.image, gallery: item.gallery }])
)

const items = ref(fallback)
const loading = ref(false)
const source = ref('local')
const errorMessage = ref('')
let pending = null

async function fetchDestinations() {
  if (pending) return pending

  loading.value = true
  pending = api
    .get('/destinations')
    .then((data) => {
      if (Array.isArray(data.items) && data.items.length) {
        items.value = data.items.map((item) => ({
          ...item,
          ...(localMedia.get(item.id) || {}),
        }))
        source.value = 'api'
        errorMessage.value = ''
      }
    })
    .catch((err) => {
      // 后端不可用时保持本地数据，页面照常渲染
      source.value = 'local'
      errorMessage.value = err.message
    })
    .finally(() => {
      loading.value = false
      pending = null
    })

  return pending
}

export function useDestinations() {
  return {
    destinations: computed(() => items.value),
    loading,
    source,
    errorMessage,
    fetchDestinations,
  }
}
