<script setup>
// 知识点：props、uni.pageScrollTo
// 小程序无法监听 window.scroll，滚动状态由页面通过 usePageScroll 计算后传入
defineProps({
  visible: { type: Boolean, default: false },
})

function toTop() {
  uni.pageScrollTo({ scrollTop: 0, duration: 300 })
}
</script>

<template>
  <view v-if="visible" class="backtop" @click="toTop">
    <text class="backtop__icon">↑</text>
  </view>
</template>

<style scoped>
.backtop {
  position: fixed;
  right: 24px;
  bottom: 120px;
  z-index: 60;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: var(--shadow-lg);
}
.backtop__icon {
  color: #fff;
  font-size: 19px;
  line-height: 1;
}
</style>
