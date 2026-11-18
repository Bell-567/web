<script setup>
// 知识点：ref、computed、onMounted、v-for、v-if/v-else、组合式函数封装后端同步
import { ref, computed, onMounted } from 'vue'
import PlannerForm from '../components/PlannerForm.vue'
import PlannerItem from '../components/PlannerItem.vue'
import ProgressBar from '../components/ProgressBar.vue'
import EmptyState from '../components/EmptyState.vue'
import { usePlanner } from '../composables/usePlanner'

// 行程清单由 composable 统一管理：localStorage + 后端同步
const { items, loading, online, errorMessage, load, add, remove, toggle, update } = usePlanner()

const filter = ref('all')

const suggestions = [
  '兑换当地货币并通知银行',
  '预订机场往返接送',
  '购买旅行保险',
  '下载离线地图',
  '确认酒店入住时间',
  '准备常用药品',
]

onMounted(load)

function inspire() {
  const pick = suggestions[Math.floor(Math.random() * suggestions.length)]
  add({ text: pick, priority: '低' })
}

const filtered = computed(() => {
  if (filter.value === 'done') return items.value.filter((i) => i.done)
  if (filter.value === 'todo') return items.value.filter((i) => !i.done)
  return items.value
})
const doneCount = computed(() => items.value.filter((i) => i.done).length)
const progress = computed(() =>
  items.value.length ? Math.round((doneCount.value / items.value.length) * 100) : 0
)

const syncText = computed(() => {
  if (loading.value) return '⏳ 正在连接后端…'
  if (online.value) return '☁️ 已同步到后端 SQLite'
  return errorMessage.value ? '📴 后端未连接，清单保存在本地' : '📴 本地模式'
})
</script>

<template>
  <div class="section">
    <div class="container planner">
      <header class="page-head">
        <p class="eyebrow">PLANNER</p>
        <h1>行程规划</h1>
        <p class="page-head__sub">把出发前的琐事列成清单，逐项打勾，进度自动保存。</p>
      </header>

      <div class="planner__top card">
        <PlannerForm @add="add" />
        <div class="planner__bar">
          <ProgressBar :value="progress" />
          <span class="planner__count">{{ doneCount }} / {{ items.length }} 已完成</span>
        </div>
        <p class="planner__sync" :class="{ 'planner__sync--off': !online }">{{ syncText }}</p>
      </div>

      <div class="planner__toolbar">
        <div class="planner__filters">
          <button
            v-for="f in [
              { key: 'all', label: '全部' },
              { key: 'todo', label: '未完成' },
              { key: 'done', label: '已完成' },
            ]"
            :key="f.key"
            type="button"
            class="chip"
            :class="{ 'chip--active': filter === f.key }"
            @click="filter = f.key"
          >
            {{ f.label }}
          </button>
        </div>
        <button class="btn btn--soft" @click="inspire">✨ 随机灵感</button>
      </div>

      <ul v-if="filtered.length" class="planner__list">
        <PlannerItem
          v-for="item in filtered"
          :key="item.id"
          :item="item"
          @toggle="toggle(item.id)"
          @remove="remove(item.id)"
          @update="update(item.id, $event)"
        />
      </ul>
      <EmptyState v-else icon="📝" title="清单空空如也" desc="添加第一条待办，或试试「随机灵感」。">
        <button class="btn btn--primary" @click="inspire">给我一点灵感</button>
      </EmptyState>
    </div>
  </div>
</template>

<style scoped>
.planner { max-width: 720px; }
.page-head { text-align: center; margin-bottom: 2rem; }
.page-head .eyebrow { color: var(--accent); letter-spacing: 0.18em; font-weight: 600; font-size: 0.78rem; }
.page-head h1 { font-size: clamp(1.8rem, 4vw, 2.6rem); margin-top: 0.3rem; }
.page-head__sub { color: var(--text-muted); margin-top: 0.5rem; }
.planner__top { padding: 1.4rem; margin-bottom: 1.4rem; }
.planner__bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.2rem;
}
.planner__count { color: var(--text-muted); font-size: 0.85rem; white-space: nowrap; }
.planner__sync { margin-top: 0.6rem; font-size: 0.78rem; color: var(--accent); }
.planner__sync--off { color: var(--text-muted); }
.planner__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.2rem;
}
.planner__filters { display: flex; gap: 0.5rem; }
.planner__list { display: grid; gap: 0.7rem; }
</style>
