<script setup>
// 知识点：props、插槽（默认插槽 + 具名插槽 icon）、class 动态绑定
defineProps({
  variant: { type: String, default: 'primary' },
  block: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>

<template>
  <button class="btn" :class="[`btn--${variant}`, { 'btn--block': block }]" @click="$emit('click', $event)">
    <slot name="icon" />
    <slot />
  </button>
</template>
