<script setup>
// 页面统一外壳：导航栏 + 内容区 + 页脚 + 返回顶部
// 小程序没有 App.vue 包裹页面的能力，因此用组件复用全局布局
import { computed, onMounted } from 'vue'
import { useTheme, applyThemeToNative } from '../composables/useTheme'
import NavBar from './NavBar.vue'
import AppFooter from './AppFooter.vue'
import BackToTop from './BackToTop.vue'

defineProps({
  showBackTop: { type: Boolean, default: false },
})

const { theme } = useTheme()
const themeClass = computed(() => (theme.value === 'dark' ? 'theme-dark' : 'theme-light'))

// 每次进入新页面时，把主题同步到原生导航栏
onMounted(() => applyThemeToNative())
</script>

<template>
  <view class="app" :class="themeClass">
    <NavBar />
    <view class="page">
      <slot />
    </view>
    <AppFooter />
    <BackToTop :visible="showBackTop" />
  </view>
</template>
