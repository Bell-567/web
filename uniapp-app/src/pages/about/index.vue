<script setup>
// 知识点：provide/inject（页面向下提供站点信息）、组件组合、剪贴板 API
import AppShell from '../../components/AppShell.vue'
import SectionTitle from '../../components/SectionTitle.vue'
import ContactForm from '../../components/ContactForm.vue'
import FeatureCard from '../../components/FeatureCard.vue'
import { site, provideSite } from '../../composables/useSite'
import { usePageScroll } from '../../composables/usePageScroll'

provideSite()
const { showBackTop } = usePageScroll()

const techs = [
  'uni-app（Vue 3 组合式 API / <script setup>）',
  'pages.json 路由 + 原生 tabBar',
  'HBuilderX 多端运行与发布',
  'CSS 变量 + 明暗主题',
]

const features = [
  { icon: '🔄', title: '响应式状态', desc: 'ref 与 reactive 驱动视图自动更新，computed 派生数据，watch 持久化。' },
  { icon: '🧩', title: '组件通信', desc: 'props / emit / defineModel / provide-inject / 插槽，覆盖组件间多种通信方式。' },
  { icon: '🛣️', title: '多端与路由', desc: '一套代码编译到 H5、微信小程序与 Android App，页面参数通过 onLoad 获取。' },
]

function copyEmail() {
  uni.setClipboardData({
    data: site.email,
    success: () => uni.showToast({ title: '邮箱已复制', icon: 'none' }),
  })
}
</script>

<template>
  <AppShell :show-back-top="showBackTop">
    <view class="section">
      <view class="container">
        <SectionTitle
          eyebrow="ABOUT"
          title="关于山海行记"
          subtitle="一个用 Vue 3 + uni-app 从零构建的旅行主题多端应用。"
        />

        <view class="about-grid">
          <view class="about__text card">
            <text class="about__p">
              「山海行记」最初是一个 Vue 3 + Vite 的纯 Web 项目，本次实验把它迁移为 uni-app 工程：
              同一套组件与组合式函数，可用于 H5、微信小程序和 Android App。
            </text>
            <text class="about__p">
              项目包含 5 个页面与 24 个业务组件，覆盖官方教程从「声明式渲染」到「组合式函数」的绝大多数知识点。
            </text>
            <text class="about__p">
              目的地、行程清单与留言由 Express + SQLite 后端提供；后端不可用时自动回退到本地数据，
              本地存储同时用于持久化主题、收藏与清单草稿。
            </text>
            <view class="about__contact">
              <text>📮 联系邮箱：</text>
              <text class="about__mail" @click="copyEmail">{{ site.email }}</text>
            </view>
          </view>

          <view class="about__tech card">
            <text class="about__tech-title">技术栈</text>
            <view v-for="t in techs" :key="t" class="about__list-item">
              <text class="about__dot">·</text>
              <text class="about__list-text">{{ t }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="section section--alt">
      <view class="container">
        <SectionTitle eyebrow="FEATURES" title="它演示了哪些知识点" />
        <view class="feature-grid">
          <view v-for="f in features" :key="f.title" class="grid-col">
            <FeatureCard v-bind="f" />
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="container">
        <SectionTitle
          eyebrow="CONTACT"
          title="给我留言"
          subtitle="演示表单双向绑定与校验，提交后写入 Express 后端的 SQLite 数据库。"
        />
        <view class="contact-wrap">
          <ContactForm />
        </view>
      </view>
    </view>
  </AppShell>
</template>

<style scoped>
.about-grid {
  display: flex;
  gap: 22px;
  align-items: flex-start;
}
.about__text {
  width: 58%;
  padding: 26px;
}
.about__p {
  display: block;
  margin-bottom: 14px;
  font-size: 15px;
}
.about__contact {
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 14px;
}
.about__mail {
  color: var(--accent);
  font-weight: 600;
}
.about__tech {
  flex: 1;
  padding: 26px;
}
.about__tech-title {
  display: block;
  font-family: var(--font-head);
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 14px;
}
.about__list-item {
  display: flex;
  gap: 8px;
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 8px;
}
.about__dot {
  color: var(--accent);
  font-weight: 700;
}
.about__list-text {
  flex: 1;
}
.feature-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -11px;
}
.grid-col {
  width: 33.333%;
  padding: 0 11px 22px;
}
.section--alt {
  background: var(--bg-soft);
}
.contact-wrap {
  display: flex;
  justify-content: center;
}
@media (max-width: 860px) {
  .about-grid {
    flex-direction: column;
  }
  .about__text,
  .about__tech {
    width: 100%;
  }
  .grid-col {
    width: 100%;
  }
}
</style>
