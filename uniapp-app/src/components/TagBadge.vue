<script setup>
// 知识点：props
defineProps({ text: String })
</script>

<template>
  <text class="tag">{{ text }}</text>
</template>
