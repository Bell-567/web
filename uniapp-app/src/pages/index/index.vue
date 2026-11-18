<script setup>
// 知识点：computed、v-for、组件组合、组合式函数复用、provide、onMounted 请求后端
import { computed, onMounted } from 'vue'
import AppShell from '../../components/AppShell.vue'
import HeroBanner from '../../components/HeroBanner.vue'
import StatsBar from '../../components/StatsBar.vue'
import SectionTitle from '../../components/SectionTitle.vue'
import FeatureCard from '../../components/FeatureCard.vue'
import DestinationCard from '../../components/DestinationCard.vue'
import BaseButton from '../../components/BaseButton.vue'
import { useDestinations } from '../../composables/useDestinations'
import { useFavorites } from '../../composables/useFavorites'
import { usePageScroll } from '../../composables/usePageScroll'
import { provideSite } from '../../composables/useSite'

provideSite()
const { showBackTop } = usePageScroll()
const { isFavorite, toggleFavorite } = useFavorites()
const { destinations, fetchDestinations } = useDestinations()

onMounted(fetchDestinations)

const featured = computed(() => destinations.value.filter((d) => d.featured).slice(0, 3))

const features = [
  { icon: '🗺️', title: '灵感目的地', desc: '精选全球热门目的地，按大洲筛选，快速找到心之所向。' },
  { icon: '📝', title: '行程规划', desc: '用待办清单规划每一天，进度条实时反馈，本地自动保存。' },
  { icon: '♥️', title: '收藏夹', desc: '一键收藏心动风景，导航栏徽标实时显示收藏数量。' },
]

function goDestinations() {
  uni.switchTab({ url: '/pages/destinations/index' })
}

function goPlanner() {
  uni.switchTab({ url: '/pages/planner/index' })
}
</script>

<template>
  <AppShell :show-back-top="showBackTop">
    <HeroBanner>
      <template #footer>
        <text class="hero-note">已收录 {{ destinations.length }} 个目的地 · 持续更新中</text>
      </template>
    </HeroBanner>
    <StatsBar />

    <view class="section">
      <view class="container">
        <SectionTitle
          eyebrow="WHY WANDERLOG"
          title="为什么选择山海行记"
          subtitle="从灵感到出发，一站式记录你的旅行计划。"
        />
        <view class="feature-grid">
          <view v-for="f in features" :key="f.title" class="grid-col">
            <FeatureCard v-bind="f" />
          </view>
        </view>
      </view>
    </view>

    <view class="section section--alt">
      <view class="container">
        <SectionTitle
          eyebrow="FEATURED"
          title="精选目的地"
          subtitle="编辑团队为你甄选的三处此生必去之地。"
        />
        <view class="featured-grid">
          <view v-for="d in featured" :key="d.id" class="grid-col">
            <DestinationCard
              :destination="d"
              :favorite="isFavorite(d.id)"
              @toggle-favorite="toggleFavorite(d.id)"
            />
          </view>
        </view>
        <view class="center">
          <view class="btn btn--soft" @click="goDestinations">
            <text>查看全部目的地 →</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="container">
        <view class="cta">
          <text class="cta__title">准备好出发了吗？</text>
          <text class="cta__desc">现在就开始规划你的下一段旅程。</text>
          <BaseButton variant="primary" @click="goPlanner">
            <template #icon><text>✈️</text></template>
            <text>开始规划行程</text>
          </BaseButton>
        </view>
      </view>
    </view>
  </AppShell>
</template>

<style scoped>
.feature-grid,
.featured-grid {
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
.center {
  text-align: center;
  margin-top: 32px;
}
.cta {
  text-align: center;
  padding: 48px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.cta__title {
  display: block;
  font-family: var(--font-head);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
}
.cta__desc {
  display: block;
  color: var(--text-muted);
  margin: 8px 0 22px;
}
.hero-note {
  display: block;
  margin-top: 22px;
  font-size: 13px;
  letter-spacing: 0.04em;
  opacity: 0.8;
}
@media (max-width: 860px) {
  .grid-col {
    width: 100%;
  }
}
</style>
