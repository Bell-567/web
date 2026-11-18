<script setup>
// 知识点：props
defineProps({
  eyebrow: String,
  title: String,
  subtitle: String,
})
</script>

<template>
  <view class="section-head">
    <text v-if="eyebrow" class="eyebrow">{{ eyebrow }}</text>
    <text v-if="title" class="section-head__title">{{ title }}</text>
    <text v-if="subtitle" class="section-head__sub">{{ subtitle }}</text>
  </view>
</template>
