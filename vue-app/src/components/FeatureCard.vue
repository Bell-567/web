<script setup>
// 知识点：props、插槽
defineProps({
  icon: String,
  title: String,
  desc: String,
})
</script>

<template>
  <div class="card feature">
    <div class="feature__icon">{{ icon }}</div>
    <h3 class="feature__title">{{ title }}</h3>
    <p class="feature__desc">{{ desc }}</p>
    <slot />
  </div>
</template>

<style scoped>
.feature {
  padding: 1.6rem;
  text-align: left;
}
.feature__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--accent-soft);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.feature__title { font-size: 1.15rem; margin-bottom: 0.4rem; }
.feature__desc { color: var(--text-muted); font-size: 0.92rem; }
</style>
