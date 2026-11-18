<script setup>
// 知识点：props、v-for 遍历对象
defineProps({
  facts: { type: Object, default: () => ({}) },
})
</script>

<template>
  <view class="facts">
    <view v-for="(value, key) in facts" :key="key" class="facts__row">
      <text class="facts__key">{{ key }}</text>
      <text class="facts__value">{{ value }}</text>
    </view>
  </view>
</template>

<style scoped>
.facts {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.facts__row {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--border);
}
.facts__key {
  width: 5.5em;
  flex-shrink: 0;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
}
.facts__value {
  flex: 1;
  font-size: 14px;
}
</style>
