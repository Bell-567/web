<script setup>
// 知识点：computed、v-for、组件组合、组合式函数复用、onMounted 请求后端
import { computed, onMounted } from 'vue'
import HeroBanner from '../components/HeroBanner.vue'
import StatsBar from '../components/StatsBar.vue'
import SectionTitle from '../components/SectionTitle.vue'
import FeatureCard from '../components/FeatureCard.vue'
import DestinationCard from '../components/DestinationCard.vue'
import BaseButton from '../components/BaseButton.vue'
import { useDestinations } from '../composables/useDestinations'
import { useFavorites } from '../composables/useFavorites'

const { isFavorite, toggleFavorite } = useFavorites()
const { destinations, fetchDestinations } = useDestinations()

onMounted(fetchDestinations)

const featured = computed(() => destinations.value.filter((d) => d.featured).slice(0, 3))

const features = [
  { icon: '🗺️', title: '灵感目的地', desc: '精选全球热门目的地，按大洲筛选，快速找到心之所向。' },
  { icon: '📝', title: '行程规划', desc: '用待办清单规划每一天，进度条实时反馈，本地自动保存。' },
  { icon: '♥️', title: '收藏夹', desc: '一键收藏心动风景，导航栏徽标实时显示收藏数量。' },
]
</script>

<template>
  <div>
    <HeroBanner>
      <template #footer>
        <p class="hero-note">已收录 {{ destinations.length }} 个目的地 · 持续更新中</p>
      </template>
    </HeroBanner>
    <StatsBar />

    <section class="section">
      <div class="container">
        <SectionTitle eyebrow="WHY WANDERLOG" title="为什么选择山海行记" subtitle="从灵感到出发，一站式记录你的旅行计划。" />
        <div class="feature-grid">
          <FeatureCard v-for="f in features" :key="f.title" v-bind="f" />
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <SectionTitle eyebrow="FEATURED" title="精选目的地" subtitle="编辑团队为你甄选的三处此生必去之地。" />
        <div class="featured-grid">
          <DestinationCard
            v-for="d in featured"
            :key="d.id"
            :destination="d"
            :favorite="isFavorite(d.id)"
            @toggle-favorite="toggleFavorite(d.id)"
          />
        </div>
        <div class="center">
          <RouterLink to="/destinations" class="btn btn--soft">查看全部目的地 →</RouterLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container cta">
        <h2>准备好出发了吗？</h2>
        <p>现在就开始规划你的下一段旅程。</p>
        <RouterLink to="/planner">
          <BaseButton variant="primary">
            <template #icon>✈️</template>
            开始规划行程
          </BaseButton>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.4rem;
}
.featured-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.4rem;
}
.section--alt { background: var(--bg-soft); }
.center { text-align: center; margin-top: 2rem; }
.cta {
  text-align: center;
  padding: 3rem 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.cta h2 { font-size: 1.8rem; }
.cta p { color: var(--text-muted); margin: 0.5rem 0 1.4rem; }
@media (max-width: 860px) {
  .feature-grid, .featured-grid { grid-template-columns: 1fr; }
}
/* 具名插槽 #footer 的内容在 HomeView 作用域内，因此在此定义样式 */
.hero-note {
  margin-top: 1.4rem;
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  opacity: 0.8;
}
</style>
