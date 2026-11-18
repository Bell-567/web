<script setup>
// 知识点：defineModel（组件级 v-model）、模板 ref、defineExpose、v-if
import { ref } from 'vue'

const model = defineModel({ type: String, default: '' })
const inputRef = ref(null)

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<template>
  <div class="searchbar">
    <span class="searchbar__icon">🔍</span>
    <input
      ref="inputRef"
      v-model="model"
      type="search"
      class="searchbar__input"
      placeholder="搜索目的地、国家或标签…"
    />
    <button v-if="model" type="button" class="searchbar__clear" aria-label="清空" @click="model = ''">✕</button>
  </div>
</template>

<style scoped>
.searchbar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.9rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
}
.searchbar__icon { font-size: 0.95rem; }
.searchbar__input {
  flex: 1;
  border: none;
  background: none;
  color: var(--text);
  font-size: 0.95rem;
}
.searchbar__input:focus { outline: none; }
.searchbar__clear {
  border: none;
  background: var(--bg-soft);
  color: var(--text-muted);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 0.7rem;
}
</style>
