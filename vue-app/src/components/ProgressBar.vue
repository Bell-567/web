<script setup>
// 知识点：props、computed、内联样式绑定（:style）
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
})

const percent = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
  <div class="progress">
    <div class="progress__track">
      <div class="progress__fill" :style="{ width: percent + '%' }"></div>
    </div>
    <span class="progress__text">{{ percent }}%</span>
  </div>
</template>

<style scoped>
.progress {
  display: flex;
  align-items: center;
  gap: 0.9rem;
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
  font-weight: 700;
  color: var(--accent);
  min-width: 3em;
  text-align: right;
}
</style>
