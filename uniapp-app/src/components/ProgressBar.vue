<script setup>
// 知识点：props、computed、内联样式绑定（:style）
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
})

const percent = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
  <view class="progress">
    <view class="progress__track">
      <view class="progress__fill" :style="{ width: percent + '%' }"></view>
    </view>
    <text class="progress__text">{{ percent }}%</text>
  </view>
</template>

<style scoped>
.progress {
  display: flex;
  align-items: center;
  gap: 14px;
}
.progress__track {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: var(--bg-soft);
  overflow: hidden;
}
.progress__fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), var(--accent-3));
  transition: width 0.4s ease;
}
.progress__text {
  min-width: 44px;
  text-align: right;
  font-weight: 700;
  color: var(--accent);
}
</style>
