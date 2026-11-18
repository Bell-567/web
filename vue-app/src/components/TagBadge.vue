<script setup>
// 知识点：props
defineProps({ text: String })
</script>

<template>
  <span class="tag">{{ text }}</span>
</template>
