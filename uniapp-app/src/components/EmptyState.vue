<script setup>
// 知识点：props、插槽（默认插槽放置操作按钮）
defineProps({
  icon: { type: String, default: '🗺️' },
  title: String,
  desc: String,
})
</script>

<template>
  <view class="empty">
    <text class="empty__icon">{{ icon }}</text>
    <text class="empty__title">{{ title }}</text>
    <text v-if="desc" class="empty__desc">{{ desc }}</text>
    <view class="empty__action">
      <slot />
    </view>
  </view>
</template>

<style scoped>
.empty {
  text-align: center;
  padding: 48px 16px;
}
.empty__icon {
  display: block;
  font-size: 48px;
}
.empty__title {
  display: block;
  margin: 12px 0 6px;
  font-size: 19px;
  font-weight: 700;
}
.empty__desc {
  display: block;
  color: var(--text-muted);
  margin-bottom: 16px;
  font-size: 14px;
}
.empty__action {
  display: flex;
  justify-content: center;
  gap: 11px;
}
</style>
