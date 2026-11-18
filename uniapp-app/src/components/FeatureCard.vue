<script setup>
// 知识点：props、插槽
defineProps({
  icon: String,
  title: String,
  desc: String,
})
</script>

<template>
  <view class="card feature">
    <view class="feature__icon">
      <text>{{ icon }}</text>
    </view>
    <text class="feature__title">{{ title }}</text>
    <text class="feature__desc">{{ desc }}</text>
    <slot />
  </view>
</template>

<style scoped>
.feature {
  padding: 26px;
}
.feature__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--accent-soft);
  font-size: 24px;
  margin-bottom: 16px;
}
.feature__title {
  display: block;
  font-family: var(--font-head);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
}
.feature__desc {
  display: block;
  color: var(--text-muted);
  font-size: 14px;
}
</style>
