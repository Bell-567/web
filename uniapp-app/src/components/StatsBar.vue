<script setup>
// 知识点：computed（从数据源派生出统计指标）、v-for、onMounted
import { computed, onMounted } from 'vue'
import { useDestinations } from '../composables/useDestinations'

const { destinations, fetchDestinations } = useDestinations()
onMounted(fetchDestinations)

const stats = computed(() => {
  const list = destinations.value
  if (!list.length) return []
  const countries = new Set(list.map((d) => d.country))
  const regions = new Set(list.map((d) => d.region))
  const avgRating = (list.reduce((s, d) => s + d.rating, 0) / list.length).toFixed(1)
  return [
    { label: '收录目的地', value: list.length },
    { label: '覆盖国家', value: countries.size },
    { label: '涉及大洲', value: regions.size },
    { label: '平均评分', value: avgRating },
  ]
})
</script>

<template>
  <view class="stats">
    <view class="container stats__grid">
      <view v-for="s in stats" :key="s.label" class="stats__item">
        <text class="stats__value">{{ s.value }}</text>
        <text class="stats__label">{{ s.label }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.stats {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.stats__grid {
  display: flex;
  flex-wrap: wrap;
  padding: 30px 0;
}
.stats__item {
  width: 25%;
  text-align: center;
}
.stats__value {
  display: block;
  font-family: var(--font-head);
  font-size: 30px;
  font-weight: 900;
  color: var(--accent);
}
.stats__label {
  display: block;
  color: var(--text-muted);
  font-size: 14px;
}
@media (max-width: 720px) {
  .stats__item {
    width: 50%;
    padding: 8px 0;
  }
}
</style>
