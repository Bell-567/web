<script setup>
// 知识点：inject（消费 App 提供的站点信息）、组件组合
import { inject } from 'vue'
import SectionTitle from '../components/SectionTitle.vue'
import ContactForm from '../components/ContactForm.vue'
import FeatureCard from '../components/FeatureCard.vue'

const site = inject('site')
</script>

<template>
  <div>
    <section class="section">
      <div class="container">
        <SectionTitle eyebrow="ABOUT" title="关于山海行记" subtitle="一个用 Vue 3 从零构建的旅行主题单页应用。" />

        <div class="about-grid">
          <div class="about__text card">
            <p>
              「山海行记」是一个纯前端实验项目，用于演示
              <strong>Vue 3 组合式 API</strong> 的核心能力：响应式状态、计算属性、侦听器、组件通信、路由与过渡动画等。
            </p>
            <p>
              项目包含 5 个页面与 20+ 个单文件组件，覆盖官方教程从「声明式渲染」到「组合式函数」的绝大多数知识点。
            </p>
            <p>
              目的地、行程清单与留言由 Express + SQLite 后端提供；后端不可用时自动回退到本地数据，
              本地存储同时用于持久化主题、收藏与清单草稿。
            </p>
            <div class="about__contact">
              <span>📮 联系邮箱：</span>
              <a :href="`mailto:${site?.email}`" class="about__mail">{{ site?.email }}</a>
            </div>
          </div>

          <div class="about__tech card">
            <h3>技术栈</h3>
            <ul class="about__list">
              <li v-for="t in ['Vue 3（组合式 API / <script setup>）', 'Vue Router 4（Hash 模式）', 'Vite 6 构建工具', '原生 CSS 变量 + 明暗主题']" :key="t">{{ t }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <SectionTitle eyebrow="FEATURES" title="它演示了哪些知识点" />
        <div class="feature-grid">
          <FeatureCard icon="🔄" title="响应式状态" desc="ref 与 reactive 驱动视图自动更新，computed 派生数据，watch 持久化。" />
          <FeatureCard icon="🧩" title="组件通信" desc="props / emit / defineModel / provide-inject / 插槽，覆盖组件间多种通信方式。" />
          <FeatureCard icon="🛣️" title="路由与过渡" desc="多页面路由、动态路由参数、页面过渡动画与滚动行为。" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <SectionTitle eyebrow="CONTACT" title="给我留言" subtitle="演示表单双向绑定与校验，提交后写入 Express 后端的 SQLite 数据库。" />
        <div class="contact-wrap">
          <ContactForm />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.4rem;
}
.about__text { padding: 1.6rem; }
.about__text p { margin-bottom: 0.9rem; }
.about__contact { margin-top: 0.6rem; color: var(--text-muted); }
.about__mail { color: var(--accent); font-weight: 600; }
.about__tech { padding: 1.6rem; }
.about__tech h3 { margin-bottom: 0.9rem; }
.about__list { display: grid; gap: 0.5rem; color: var(--text-muted); font-size: 0.92rem; }
.about__list li::before { content: '· '; color: var(--accent); font-weight: 700; }
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.4rem;
}
.section--alt { background: var(--bg-soft); }
.contact-wrap { display: flex; justify-content: center; }
@media (max-width: 860px) {
  .about-grid, .feature-grid { grid-template-columns: 1fr; }
}
</style>
