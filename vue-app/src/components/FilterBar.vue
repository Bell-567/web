<script setup>
// 知识点：props、defineModel（命名 v-model）、v-for、class 绑定、v-model 于 select
defineProps({
  regions: { type: Array, default: () => [] },
})
const region = defineModel('region', { default: '全部' })
const sort = defineModel('sort', { default: 'default' })
</script>

<template>
  <div class="filterbar">
    <div class="filterbar__chips">
      <button
        v-for="r in ['全部', ...regions]"
        :key="r"
        type="button"
        class="chip"
        :class="{ 'chip--active': region === r }"
        @click="region = r"
      >
        {{ r }}
      </button>
    </div>
    <select v-model="sort" class="filterbar__select" aria-label="排序方式">
      <option value="default">默认排序</option>
      <option value="rating">按评分</option>
      <option value="name">按名称</option>
    </select>
  </div>
</template>

<style scoped>
.filterbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.filterbar__chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.filterbar__select {
  padding: 0.45rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.9rem;
}
.filterbar__select:focus { outline: none; border-color: var(--accent); }
</style>
