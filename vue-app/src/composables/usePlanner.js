// 行程清单：localStorage + Express 后端双向同步。
// 后端不可用时自动降级为纯本地模式；首次连接时若本地已有清单，会自动迁移到服务端。
import { ref } from 'vue'
import { api } from '../api/client'

const STORAGE_KEY = 'wanderlog-planner'
const OWNER_KEY = 'wanderlog-owner-id'

const items = ref([])
const loading = ref(false)
const online = ref(false)
const errorMessage = ref('')
let initialized = false

function loadLocal() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
}

function getOwnerId() {
  const saved = localStorage.getItem(OWNER_KEY)
  if (saved && /^[A-Za-z0-9_-]{8,64}$/.test(saved)) return saved

  const id = `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  localStorage.setItem(OWNER_KEY, id)
  return id
}

function replaceItem(tempId, next) {
  const index = items.value.findIndex((item) => item.id === tempId)
  if (index >= 0) items.value.splice(index, 1, next)
}

async function migrateLocal(localItems) {
  const migrated = []
  for (const item of localItems) {
    try {
      const { item: created } = await api.post(`/trips/${getOwnerId()}/items`, {
        text: item.text,
        priority: item.priority || '中',
      })
      if (item.done) {
        const { item: doneItem } = await api.patch(
          `/trips/${getOwnerId()}/items/${created.id}`,
          { done: true }
        )
        migrated.push(doneItem)
      } else {
        migrated.push(created)
      }
    } catch (err) {
      migrated.push(item)
      online.value = false
      errorMessage.value = err.message
    }
  }
  items.value = migrated
}

async function load() {
  if (initialized) return
  initialized = true

  loading.value = true
  const local = loadLocal()
  items.value = local

  try {
    const data = await api.get(`/trips/${getOwnerId()}/items`)
    online.value = true
    errorMessage.value = ''
    const remote = Array.isArray(data.items) ? data.items : []

    if (remote.length === 0 && local.length > 0) {
      await migrateLocal(local)
    } else {
      items.value = remote
    }
  } catch (err) {
    online.value = false
    errorMessage.value = err.message
  } finally {
    loading.value = false
    saveLocal()
  }
}

async function add(payload) {
  const text = (payload.text || '').trim()
  if (!text) return

  const priority = payload.priority || '中'
  const temp = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    priority,
    done: false,
  }
  items.value.push(temp)
  saveLocal()

  try {
    const { item } = await api.post(`/trips/${getOwnerId()}/items`, { text, priority })
    replaceItem(temp.id, item)
    online.value = true
    errorMessage.value = ''
  } catch (err) {
    online.value = false
    errorMessage.value = err.message
  } finally {
    saveLocal()
  }
}

async function remove(id) {
  const item = items.value.find((i) => i.id === id)
  items.value = items.value.filter((i) => i.id !== id)
  saveLocal()

  if (!item || !Number.isInteger(item.id)) return
  try {
    await api.delete(`/trips/${getOwnerId()}/items/${item.id}`)
    online.value = true
  } catch (err) {
    online.value = false
    errorMessage.value = err.message
  }
}

async function toggle(id) {
  const item = items.value.find((i) => i.id === id)
  if (!item) return

  item.done = !item.done
  saveLocal()

  if (!Number.isInteger(item.id)) return
  try {
    const { item: updated } = await api.patch(
      `/trips/${getOwnerId()}/items/${item.id}`,
      { done: item.done }
    )
    Object.assign(item, updated)
    online.value = true
  } catch (err) {
    online.value = false
    errorMessage.value = err.message
  }
}

async function update(id, text) {
  const item = items.value.find((i) => i.id === id)
  if (!item) return

  const nextText = String(text || '').trim()
  if (!nextText) return
  item.text = nextText
  saveLocal()

  if (!Number.isInteger(item.id)) return
  try {
    const { item: updated } = await api.patch(
      `/trips/${getOwnerId()}/items/${item.id}`,
      { text: nextText }
    )
    Object.assign(item, updated)
    online.value = true
  } catch (err) {
    online.value = false
    errorMessage.value = err.message
  }
}

export function usePlanner() {
  return { items, loading, online, errorMessage, load, add, remove, toggle, update }
}
