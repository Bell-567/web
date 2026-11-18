<script setup>
// 知识点：inject、computed、v-for
import { inject, computed } from 'vue'

const site = inject('site')
const year = computed(() => new Date().getFullYear())

const links = [
  { to: '/', label: '首页' },
  { to: '/destinations', label: '目的地' },
  { to: '/planner', label: '行程规划' },
  { to: '/about', label: '关于' },
]
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <span class="footer__logo">⛰</span>
        <div>
          <div class="footer__name">{{ site?.name }}</div>
          <div class="footer__slogan">{{ site?.slogan }}</div>
        </div>
      </div>
      <nav class="footer__links">
        <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="footer__link">{{ l.label }}</RouterLink>
      </nav>
    </div>
    <div class="container footer__bottom">
      © {{ year }} {{ site?.name }} · 用 Vue 3 构建 · 仅供学习交流
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
  background: var(--bg-soft);
}
.footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 2.5rem 0 1.5rem;
}
.footer__brand { display: flex; align-items: center; gap: 0.7rem; }
.footer__logo { font-size: 1.6rem; }
.footer__name { font-family: var(--font-head); font-weight: 900; }
.footer__slogan { color: var(--text-muted); font-size: 0.85rem; }
.footer__links { display: flex; gap: 1.2rem; flex-wrap: wrap; }
.footer__link { color: var(--text-muted); transition: color 0.15s ease; }
.footer__link:hover { color: var(--accent); }
.footer__bottom {
  padding: 1rem 0 1.5rem;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 0.8rem;
}
@media (max-width: 720px) {
  .footer__inner { flex-direction: column; align-items: flex-start; }
}
</style>
