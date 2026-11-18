<script setup>
// 知识点：ref、computed（联动筛选/搜索/排序）、组件组合、v-if/v-else、onMounted 请求后端
import { ref, computed, onMounted } from 'vue'
import AppShell from '../../components/AppShell.vue'
import SearchBar from '../../components/SearchBar.vue'
import FilterBar from '../../components/FilterBar.vue'
import DestinationList from '../../components/DestinationList.vue'
import EmptyState from '../../components/EmptyState.vue'
import { useDestinations } from '../../composables/useDestinations'
import { useFavorites } from '../../composables/useFavorites'
import { usePageScroll } from '../../composables/usePageScroll'
import { provideSite } from '../../composables/useSite'

provideSite()
const { showBackTop } = usePageScroll()
const { destinations, fetchDestinations, source } = useDestinations()

onMounted(fetchDestinations)

const keyword = ref('')
const region = ref('全部')
const sort = ref('default')
const { isFavorite, toggleFavorite } = useFavorites()

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

function clearFilters() {
  keyword.value = ''
  region.value = '全部'
}
</script>

<template>
  <AppShell :show-back-top="showBackTop">
    <view class="section">
      <view class="container">
        <view class="page-head">
          <text class="eyebrow">DESTINATIONS</text>
          <text class="page-head__title">探索目的地</text>
          <text class="page-head__sub">
            {{ filtered.length }} 个目的地 · 支持搜索、按大洲筛选与排序 · {{ source === 'api' ? '数据来自后端 API' : '本地演示数据' }}
          </text>
        </view>

        <view class="toolbar">
          <SearchBar v-model="keyword" />
          <FilterBar v-model:region="region" v-model:sort="sort" :regions="regions" />
        </view>

        <DestinationList
          v-if="filtered.length"
          :destinations="filtered"
          :is-favorite="isFavorite"
          @toggle-favorite="toggleFavorite"
        />
        <EmptyState v-else icon="🔍" title="没有找到匹配的目的地" desc="换个关键词或筛选条件试试吧。">
          <view class="btn btn--soft" @click="clearFilters">
            <text>清空筛选</text>
          </view>
        </EmptyState>
      </view>
    </view>
  </AppShell>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}
</style>
