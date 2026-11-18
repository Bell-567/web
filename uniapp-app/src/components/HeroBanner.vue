<script setup>
// 知识点：插槽（具名插槽 footer）、页面跳转、image 组件
// 小程序不支持 CSS 网络背景图，因此改用 <image> 承载背景
const heroImage = '/static/destinations/hero.jpg'

function go(url) {
  uni.switchTab({ url })
}
</script>

<template>
  <view class="hero">
    <image class="hero__bg" :src="heroImage" mode="aspectFill" />
    <view class="hero__overlay"></view>
    <view class="container hero__content">
      <text class="hero__eyebrow">WANDERLOG · 环球旅行手账</text>
      <text class="hero__title">把世界，{{ '\n' }}装进手账。</text>
      <text class="hero__desc">
        收录心动目的地、规划专属行程、记录每一次出发。用 Vue 3 打造的旅行灵感集，陪你走过山海。
      </text>
      <view class="hero__actions">
        <view class="btn btn--primary" @click="go('/pages/destinations/index')">
          <text>探索目的地</text>
        </view>
        <view class="btn btn--ghost btn--light" @click="go('/pages/planner/index')">
          <text>规划行程</text>
        </view>
      </view>
      <!-- 具名插槽 footer：由父页面提供补充说明 -->
      <slot name="footer" />
    </view>
  </view>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 440px;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: #fff;
}
.hero__bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.hero__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(120deg, rgba(23, 20, 16, 0.78), rgba(23, 20, 16, 0.25));
}
.hero__content {
  position: relative;
  padding: 64px 0;
}
.hero__eyebrow {
  display: block;
  letter-spacing: 0.22em;
  font-size: 13px;
  font-weight: 600;
  opacity: 0.9;
}
.hero__title {
  display: block;
  font-family: var(--font-head);
  font-size: 46px;
  font-weight: 700;
  line-height: 1.3;
  margin: 12px 0 16px;
  white-space: pre-line;
}
.hero__desc {
  display: block;
  max-width: 46ch;
  font-size: 16px;
  opacity: 0.92;
}
.hero__actions {
  display: flex;
  gap: 14px;
  margin-top: 32px;
  flex-wrap: wrap;
}
@media (max-width: 720px) {
  .hero__title {
    font-size: 34px;
  }
}
</style>
