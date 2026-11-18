<script setup>
// 知识点：组合式函数复用、v-if/v-else、事件处理
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    class="theme-toggle"
    :aria-label="theme === 'light' ? '切换到深色模式' : '切换到浅色模式'"
    :title="theme === 'light' ? '切换到深色模式' : '切换到浅色模式'"
    @click="toggleTheme"
  >
    <span v-if="theme === 'light'">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 1rem;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.theme-toggle:hover {
  transform: rotate(15deg);
  border-color: var(--accent);
}
</style>
