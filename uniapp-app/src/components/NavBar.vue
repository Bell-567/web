<script setup>
// 知识点：inject、computed、v-if、点击导航
// uni-app 使用 pages.json 的 tabBar 完成底部导航，这里保留品牌区、收藏入口与主题切换
import { computed, inject } from 'vue'
import ThemeToggle from './ThemeToggle.vue'
import { useFavorites } from '../composables/useFavorites'

const site = inject('site')
const { favorites } = useFavorites()

const favoriteCount = computed(() => favorites.value.length)

function goHome() {
  uni.switchTab({ url: '/pages/index/index' })
}

function goDestinations() {
  uni.switchTab({ url: '/pages/destinations/index' })
}
</script>

<template>
  <view class="navbar">
    <view class="navbar__inner">
      <view class="navbar__brand" @click="goHome">
        <text class="navbar__logo">⛰</text>
        <text class="navbar__name">{{ site?.name }}</text>
      </view>

      <view class="navbar__actions">
        <view class="navbar__fav" @click="goDestinations">
          <text class="navbar__fav-icon">♥</text>
          <text v-if="favoriteCount" class="navbar__badge">{{ favoriteCount }}</text>
        </view>
        <ThemeToggle />
      </view>
    </view>
  </view>
</template>

<style scoped>
.navbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.navbar__inner {
  width: 92%;
  max-width: 1120px;
  margin: 0 auto;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.navbar__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-head);
  font-weight: 900;
  font-size: 18px;
}
.navbar__logo {
  font-size: 21px;
}
.navbar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.navbar__fav {
  position: relative;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
}
.navbar__fav-icon {
  color: var(--text-muted);
  font-size: 16px;
}
.navbar__badge {
  position: absolute;
  top: -6px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
}
</style>
