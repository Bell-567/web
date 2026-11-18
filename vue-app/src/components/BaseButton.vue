<script setup>
// 知识点：props、插槽（默认插槽 + 具名插槽 icon）、class 动态绑定
defineProps({
  variant: { type: String, default: 'primary' },
  type: { type: String, default: 'button' },
  block: { type: Boolean, default: false },
})
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, { 'btn--block': block }]"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>
