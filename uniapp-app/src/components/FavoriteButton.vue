<script setup>
// 知识点：props、事件（emit）、class 动态绑定
defineProps({
  active: { type: Boolean, default: false },
})
defineEmits(['toggle'])
</script>

<template>
  <view
    class="fav"
    :class="{ 'fav--active': active }"
    :aria-label="active ? '取消收藏' : '收藏'"
    @click.stop="$emit('toggle')"
  >
    <text class="fav__icon">{{ active ? '♥' : '♡' }}</text>
  </view>
</template>

<style scoped>
.fav {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
}
.fav__icon {
  color: var(--text-muted);
  font-size: 17px;
  line-height: 1;
}
.fav--active {
  background: var(--accent-soft);
  border-color: var(--accent);
}
.fav--active .fav__icon {
  color: var(--accent);
}
</style>
