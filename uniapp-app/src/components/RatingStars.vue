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

function choose(s) {
  if (!props.readonly) emit('update:modelValue', s)
}
</script>

<template>
  <view class="stars">
    <text
      v-for="s in stars"
      :key="s"
      class="star"
      :class="{ 'star--on': s <= Math.round(modelValue) }"
      @click="choose(s)"
    >★</text>
    <text class="stars__value">{{ Number(modelValue).toFixed(1) }}</text>
  </view>
</template>

<style scoped>
.stars {
  display: flex;
  align-items: center;
  gap: 2px;
}
.star {
  font-size: 15px;
  color: var(--border);
  line-height: 1;
}
.star--on {
  color: var(--accent-3);
}
.stars__value {
  margin-left: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
}
</style>
