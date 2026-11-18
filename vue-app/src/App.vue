<script setup>
// 知识点：组件组合、provide/inject（跨层级注入站点信息）、动态组件 + <Transition> 路由过渡
import { reactive, provide } from 'vue'
import NavBar from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'
import BackToTop from './components/BackToTop.vue'

// 通过 provide 向任意后代组件注入站点配置，避免逐层 props 传递
const site = reactive({
  name: '山海行记',
  slogan: '把世界，装进手账。',
  email: 'hello@wanderlog.dev',
})
provide('site', site)
</script>

<template>
  <div class="app-shell">
    <NavBar />
    <main class="page">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <BackToTop />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.page {
  flex: 1;
}
</style>
