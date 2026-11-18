<script setup>
// 知识点：props、computed、事件（update:modelValue 实现 v-model）、v-for、class 绑定
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
  readonly: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const stars = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))
</script>

<template>
  <span class="stars">
    <button
      v-for="s in stars"
      :key="s"
      type="button"
      class="star"
      :class="{ 'star--on': s <= Math.round(modelValue) }"
      :disabled="readonly"
      @click="emit('update:modelValue', s)"
    >★</button>
    <span class="stars__value">{{ modelValue.toFixed(1) }}</span>
  </span>
</template>

<style scoped>
.stars { display: inline-flex; align-items: center; gap: 2px; }
.star {
  border: none;
  background: none;
  padding: 0;
  font-size: 0.95rem;
  color: var(--border);
  transition: color 0.15s ease;
}
.star:not(:disabled) { cursor: pointer; }
.star:not(:disabled):hover { color: var(--accent-3); }
.star--on { color: var(--accent-3); }
.stars__value {
  margin-left: 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
}
</style>
