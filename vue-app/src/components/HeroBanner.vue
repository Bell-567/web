<script setup>
// 知识点：插槽（具名插槽 footer）、RouterLink、内联样式绑定
const heroImage = `${import.meta.env.BASE_URL || './'}destinations/hero.jpg`
</script>

<template>
  <section class="hero">
    <div class="hero__bg" :style="{ backgroundImage: `url(${heroImage})` }"></div>
    <div class="hero__overlay"></div>
    <div class="container hero__content">
      <p class="hero__eyebrow">WANDERLOG · 环球旅行手账</p>
      <h1 class="hero__title">把世界，<br />装进手账。</h1>
      <p class="hero__desc">
        收录心动目的地、规划专属行程、记录每一次出发。用 Vue 3 打造的旅行灵感集，陪你走过山海。
      </p>
      <div class="hero__actions">
        <RouterLink to="/destinations" class="btn btn--primary">探索目的地</RouterLink>
        <RouterLink to="/planner" class="btn btn--ghost btn--light">规划行程</RouterLink>
      </div>
      <!-- 具名插槽 footer：由父组件 HomeView 提供补充说明 -->
      <slot name="footer" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 480px;
  overflow: hidden;
  color: #fff;
}
.hero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.05);
}
.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(23, 20, 16, 0.75), rgba(23, 20, 16, 0.25));
}
.hero__content { position: relative; padding: 4rem 0; }
.hero__eyebrow { letter-spacing: 0.22em; font-size: 0.8rem; font-weight: 600; opacity: 0.9; }
.hero__title {
  font-size: clamp(2.6rem, 7vw, 4.5rem);
  margin: 0.75rem 0 1rem;
}
.hero__desc { max-width: 46ch; font-size: 1.05rem; opacity: 0.92; }
.hero__actions { display: flex; gap: 0.9rem; margin-top: 2rem; flex-wrap: wrap; }
.btn--light { color: #fff; border-color: rgba(255, 255, 255, 0.5); }
.btn--light:hover { border-color: #fff; color: #fff; }
</style>
