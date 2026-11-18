import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// 使用 Hash 模式：纯静态托管无需服务端重写即可刷新/直达任意页面
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/destinations', name: 'destinations', component: () => import('../views/DestinationsView.vue') },
    { path: '/destinations/:id', name: 'destination-detail', component: () => import('../views/DestinationDetailView.vue') },
    { path: '/planner', name: 'planner', component: () => import('../views/PlannerView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

export default router
