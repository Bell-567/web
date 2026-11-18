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
  <section class="stats">
    <div class="container stats__grid">
      <div v-for="s in stats" :key="s.label" class="stats__item">
        <span class="stats__value">{{ s.value }}</span>
        <span class="stats__label">{{ s.label }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 2rem 0;
}
.stats__item { text-align: center; }
.stats__value {
  display: block;
  font-family: var(--font-head);
  font-size: 2rem;
  font-weight: 900;
  color: var(--accent);
}
.stats__label { color: var(--text-muted); font-size: 0.9rem; }
@media (max-width: 720px) {
  .stats__grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
