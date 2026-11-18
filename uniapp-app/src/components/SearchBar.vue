<script setup>
// 知识点：defineModel（组件级 v-model）、defineExpose、v-if
// 小程序不能直接调用 DOM 的 focus()，改用 input 的 :focus 属性
import { ref } from 'vue'

const model = defineModel({ type: String, default: '' })
const focused = ref(false)

function focus() {
  focused.value = false
  setTimeout(() => {
    focused.value = true
  }, 50)
}

defineExpose({ focus })
</script>

<template>
  <view class="searchbar">
    <text class="searchbar__icon">🔍</text>
    <input
      v-model="model"
      type="text"
      class="searchbar__input"
      confirm-type="search"
      placeholder="搜索目的地、国家或标签…"
      placeholder-class="searchbar__placeholder"
      :focus="focused"
      @blur="focused = false"
    />
    <view v-if="model" class="searchbar__clear" @click="model = ''">
      <text>✕</text>
    </view>
  </view>
</template>

<style scoped>
.searchbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
}
.searchbar__icon {
  font-size: 15px;
}
.searchbar__input {
  flex: 1;
  height: 30px;
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 15px;
}
.searchbar__placeholder {
  color: var(--text-muted);
}
.searchbar__clear {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-soft);
  color: var(--text-muted);
  font-size: 11px;
}
</style>
