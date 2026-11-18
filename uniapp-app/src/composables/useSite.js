// 知识点：provide / inject —— 在页面组件中提供站点配置，供任意后代组件注入
import { reactive, provide } from 'vue'

export const site = reactive({
  name: '山海行记',
  slogan: '把世界，装进手账。',
  email: 'hello@wanderlog.dev',
})

export function provideSite() {
  provide('site', site)
}
