<script setup>
// 知识点：props、事件（emit）、class 动态绑定
defineProps({
  active: { type: Boolean, default: false },
})
defineEmits(['toggle'])
</script>

<template>
  <button
    type="button"
    class="fav"
    :class="{ 'fav--active': active }"
    :aria-label="active ? '取消收藏' : '收藏'"
    @click="$emit('toggle')"
  >
    {{ active ? '♥' : '♡' }}
  </button>
</template>

<style scoped>
.fav {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-size: 1.05rem;
  transition: all 0.15s ease;
}
.fav:hover { border-color: var(--accent); color: var(--accent); }
.fav--active { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
</style>
