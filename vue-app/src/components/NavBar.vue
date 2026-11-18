<script setup>
// 知识点：inject、ref、v-for、v-if/v-else、事件处理、computed、RouterLink 激活态
import { ref, inject, computed } from 'vue'
import ThemeToggle from './ThemeToggle.vue'
import { useFavorites } from '../composables/useFavorites'

const site = inject('site')
const { favorites } = useFavorites()
const open = ref(false)

const links = [
  { to: '/', label: '首页' },
  { to: '/destinations', label: '目的地' },
  { to: '/planner', label: '行程规划' },
  { to: '/about', label: '关于' },
]

const favoriteCount = computed(() => favorites.value.length)
</script>

<template>
  <header class="navbar">
    <div class="container navbar__inner">
      <RouterLink to="/" class="navbar__brand" @click="open = false">
        <span class="navbar__logo">⛰</span>
        <span class="navbar__name">{{ site?.name }}</span>
      </RouterLink>

      <nav class="navbar__links" :class="{ 'is-open': open }">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="navbar__link"
          @click="open = false"
        >
          {{ link.label }}
          <!-- v-show：徽标始终在 DOM 中，数量为 0 时隐藏 -->
          <span v-show="link.to === '/destinations' && favoriteCount" class="navbar__badge">{{ favoriteCount }}</span>
        </RouterLink>
      </nav>

      <div class="navbar__actions">
        <ThemeToggle />
        <button class="navbar__burger" :aria-label="open ? '收起菜单' : '展开菜单'" @click="open = !open">
          <span v-if="!open">☰</span>
          <span v-else>✕</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--surface) 85%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}
.navbar__inner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 64px;
}
.navbar__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-head);
  font-weight: 900;
  font-size: 1.15rem;
}
.navbar__logo { font-size: 1.3rem; }
.navbar__links {
  display: flex;
  gap: 0.4rem;
  margin-left: auto;
}
.navbar__link {
  position: relative;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  color: var(--text-muted);
  font-weight: 500;
  transition: color 0.15s ease, background 0.15s ease;
}
.navbar__link:hover { color: var(--text); }
.navbar__link.router-link-active {
  color: var(--accent);
  background: var(--accent-soft);
}
.navbar__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  margin-left: 4px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
}
.navbar__actions { display: flex; align-items: center; gap: 0.5rem; }
.navbar__burger {
  display: none;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: var(--text);
}
@media (max-width: 720px) {
  .navbar__burger { display: block; }
  .navbar__links {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow);
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
    margin-left: 0;
  }
  .navbar__links.is-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  .navbar__link { padding: 0.7rem 0.9rem; }
}
</style>
