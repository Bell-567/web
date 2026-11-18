<script setup>
// 知识点：组合式函数复用、v-if/v-else、事件处理
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <view class="theme-toggle" :aria-label="theme === 'light' ? '切换到深色模式' : '切换到浅色模式'" @click="toggleTheme">
    <text v-if="theme === 'light'">🌙</text>
    <text v-else>☀️</text>
  </view>
</template>

<style scoped>
.theme-toggle {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 16px;
}
</style>
