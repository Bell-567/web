<script setup>
// 知识点：props
defineProps({
  eyebrow: String,
  title: String,
  subtitle: String,
})
</script>

<template>
  <div class="section-head">
    <div v-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
    <h2 v-if="title">{{ title }}</h2>
    <p v-if="subtitle">{{ subtitle }}</p>
  </div>
</template>
