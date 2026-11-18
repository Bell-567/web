<script setup>
// 知识点：ref、computed（联动筛选/搜索/排序）、组件组合、v-if/v-else、onMounted 请求后端
import { ref, computed, onMounted } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import FilterBar from '../components/FilterBar.vue'
import DestinationList from '../components/DestinationList.vue'
import EmptyState from '../components/EmptyState.vue'
import { useDestinations } from '../composables/useDestinations'
import { useFavorites } from '../composables/useFavorites'

const keyword = ref('')
const region = ref('全部')
const sort = ref('default')
const { isFavorite, toggleFavorite } = useFavorites()
const { destinations, fetchDestinations, source } = useDestinations()

onMounted(fetchDestinations)

const regions = computed(() => [...new Set(destinations.value.map((d) => d.region))])

const filtered = computed(() => {
  const kw = keyword.value.trim()
  let list = destinations.value.filter((d) => {
    const matchKw =
      !kw ||
      d.name.includes(kw) ||
      d.country.includes(kw) ||
      d.region.includes(kw) ||
      d.tags.some((t) => t.includes(kw))
    const matchRegion = region.value === '全部' || d.region === region.value
    return matchKw && matchRegion
  })
  if (sort.value === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
  if (sort.value === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'zh'))
  return list
})
</script>

<template>
  <div class="section">
    <div class="container">
      <header class="page-head">
        <p class="eyebrow">DESTINATIONS</p>
        <h1>探索目的地</h1>
        <p class="page-head__sub">
          共 {{ filtered.length }} 个目的地 · 支持搜索、按大洲筛选与排序 · {{ source === 'api' ? '数据来自后端 API' : '本地演示数据' }}
        </p>
      </header>

      <div class="toolbar">
        <SearchBar v-model="keyword" />
        <FilterBar v-model:region="region" v-model:sort="sort" :regions="regions" />
      </div>

      <DestinationList
        v-if="filtered.length"
        :destinations="filtered"
        :is-favorite="isFavorite"
        @toggle-favorite="toggleFavorite"
      />
      <EmptyState v-else icon="🔍" title="没有找到匹配的目的地" desc="换个关键词或筛选条件试试吧。">
        <button class="btn btn--soft" @click="keyword = ''; region = '全部'">清空筛选</button>
      </EmptyState>
    </div>
  </div>
</template>

<style scoped>
.page-head { text-align: center; margin-bottom: 2rem; }
.page-head .eyebrow { color: var(--accent); letter-spacing: 0.18em; font-weight: 600; font-size: 0.78rem; }
.page-head h1 { font-size: clamp(1.8rem, 4vw, 2.6rem); margin-top: 0.3rem; }
.page-head__sub { color: var(--text-muted); margin-top: 0.5rem; }
.toolbar {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}
</style>
