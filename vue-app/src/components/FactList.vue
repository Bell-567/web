<script setup>
// 知识点：props、v-for 遍历对象
defineProps({
  facts: { type: Object, default: () => ({}) },
})
</script>

<template>
  <dl class="facts">
    <div v-for="(value, key) in facts" :key="key" class="facts__row">
      <dt class="facts__key">{{ key }}</dt>
      <dd class="facts__value">{{ value }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.facts {
  display: grid;
  gap: 0.4rem;
}
.facts__row {
  display: flex;
  gap: 0.8rem;
  padding: 0.6rem 0;
  border-bottom: 1px dashed var(--border);
}
.facts__row:last-child { border-bottom: none; }
.facts__key {
  flex: 0 0 5.5em;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
}
.facts__value { font-size: 0.9rem; }
</style>
