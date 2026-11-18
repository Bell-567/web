<script setup>
// 知识点：inject、computed、v-for、switchTab 导航
import { inject, computed } from 'vue'

const site = inject('site')
const year = computed(() => new Date().getFullYear())

const links = [
  { url: '/pages/index/index', label: '首页' },
  { url: '/pages/destinations/index', label: '目的地' },
  { url: '/pages/planner/index', label: '行程规划' },
  { url: '/pages/about/index', label: '关于' },
]

function go(url) {
  uni.switchTab({ url })
}
</script>

<template>
  <view class="footer">
    <view class="container footer__inner">
      <view class="footer__brand">
        <text class="footer__logo">⛰</text>
        <view>
          <text class="footer__name">{{ site?.name }}</text>
          <text class="footer__slogan">{{ site?.slogan }}</text>
        </view>
      </view>
      <view class="footer__links">
        <text v-for="l in links" :key="l.url" class="footer__link" @click="go(l.url)">{{ l.label }}</text>
      </view>
    </view>
    <view class="container footer__bottom">
      © {{ year }} {{ site?.name }} · 用 Vue 3 + uni-app 构建 · 仅供学习交流
    </view>
  </view>
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
  gap: 16px;
  padding: 32px 0 20px;
}
.footer__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.footer__logo {
  font-size: 26px;
}
.footer__name {
  display: block;
  font-family: var(--font-head);
  font-weight: 900;
}
.footer__slogan {
  display: block;
  color: var(--text-muted);
  font-size: 13px;
}
.footer__links {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
.footer__link {
  color: var(--text-muted);
  font-size: 14px;
}
.footer__bottom {
  padding: 14px 0 20px;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 12px;
}
@media (max-width: 720px) {
  .footer__inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
