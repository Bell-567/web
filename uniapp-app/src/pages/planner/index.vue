<script setup>
// 知识点：ref、computed、onMounted、v-for、v-if/v-else、组合式函数封装后端同步
import { ref, computed, onMounted } from 'vue'
import AppShell from '../../components/AppShell.vue'
import PlannerForm from '../../components/PlannerForm.vue'
import PlannerItem from '../../components/PlannerItem.vue'
import ProgressBar from '../../components/ProgressBar.vue'
import EmptyState from '../../components/EmptyState.vue'
import { usePageScroll } from '../../composables/usePageScroll'
import { provideSite } from '../../composables/useSite'
import { usePlanner } from '../../composables/usePlanner'

provideSite()
const { showBackTop } = usePageScroll()

// 行程清单由 composable 统一管理：本地存储 + 后端同步
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

const filters = [
  { key: 'all', label: '全部' },
  { key: 'todo', label: '未完成' },
  { key: 'done', label: '已完成' },
]
</script>

<template>
  <AppShell :show-back-top="showBackTop">
    <view class="section">
      <view class="container planner">
        <view class="page-head">
          <text class="eyebrow">PLANNER</text>
          <text class="page-head__title">行程规划</text>
          <text class="page-head__sub">把出发前的琐事列成清单，逐项打勾，进度自动保存。</text>
        </view>

        <view class="planner__top card">
          <PlannerForm @add="add" />
          <view class="planner__bar">
            <ProgressBar :value="progress" />
            <text class="planner__count">{{ doneCount }} / {{ items.length }} 已完成</text>
          </view>
          <text class="planner__sync" :class="{ 'planner__sync--off': !online }">{{ syncText }}</text>
        </view>

        <view class="planner__toolbar">
          <view class="planner__filters">
            <view
              v-for="f in filters"
              :key="f.key"
              class="chip"
              :class="{ 'chip--active': filter === f.key }"
              @click="filter = f.key"
            >
              <text>{{ f.label }}</text>
            </view>
          </view>
          <view class="btn btn--soft" @click="inspire">
            <text>✨ 随机灵感</text>
          </view>
        </view>

        <view v-if="filtered.length" class="planner__list">
          <PlannerItem
            v-for="item in filtered"
            :key="item.id"
            :item="item"
            @toggle="toggle(item.id)"
            @remove="remove(item.id)"
            @update="update(item.id, $event)"
          />
        </view>
        <EmptyState v-else icon="📝" title="清单空空如也" desc="添加第一条待办，或试试「随机灵感」。">
          <view class="btn btn--primary" @click="inspire">
            <text>给我一点灵感</text>
          </view>
        </EmptyState>
      </view>
    </view>
  </AppShell>
</template>

<style scoped>
.planner {
  max-width: 720px;
}
.planner__top {
  padding: 22px;
  margin-bottom: 22px;
}
.planner__bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 19px;
}
.planner__count {
  color: var(--text-muted);
  font-size: 13px;
  white-space: nowrap;
}
.planner__sync {
  display: block;
  margin-top: 10px;
  font-size: 12px;
  color: var(--accent);
}
.planner__sync--off {
  color: var(--text-muted);
}
.planner__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 19px;
  flex-wrap: wrap;
}
.planner__filters {
  display: flex;
  gap: 8px;
}
.planner__list {
  display: flex;
  flex-direction: column;
  gap: 11px;
}
</style>
