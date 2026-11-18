<script setup>
// 知识点：props、插槽（默认插槽放置操作按钮）
defineProps({
  icon: { type: String, default: '🗺️' },
  title: String,
  desc: String,
})
</script>

<template>
  <div class="empty">
    <div class="empty__icon">{{ icon }}</div>
    <h3 class="empty__title">{{ title }}</h3>
    <p v-if="desc" class="empty__desc">{{ desc }}</p>
    <div class="empty__action"><slot /></div>
  </div>
</template>

<style scoped>
.empty {
  text-align: center;
  padding: 3rem 1rem;
}
.empty__icon { font-size: 3rem; }
.empty__title { margin: 0.75rem 0 0.4rem; font-size: 1.2rem; }
.empty__desc { color: var(--text-muted); margin-bottom: 1rem; }
.empty__action { display: flex; justify-content: center; gap: 0.7rem; }
</style>
