<script setup>
// 知识点：useRoute、computed、watch、v-if/v-else、组合式函数复用、后端数据加载
import { computed, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import PhotoGallery from '../components/PhotoGallery.vue'
import RatingStars from '../components/RatingStars.vue'
import TagBadge from '../components/TagBadge.vue'
import FactList from '../components/FactList.vue'
import FavoriteButton from '../components/FavoriteButton.vue'
import EmptyState from '../components/EmptyState.vue'
import { useDestinations } from '../composables/useDestinations'
import { useFavorites } from '../composables/useFavorites'

const route = useRoute()
const { isFavorite, toggleFavorite } = useFavorites()
const { destinations, fetchDestinations } = useDestinations()

onMounted(fetchDestinations)

const dest = computed(() => destinations.value.find((d) => d.id === route.params.id))

// 切换目的地时回到顶部
watch(() => route.params.id, () => window.scrollTo({ top: 0 }))
</script>

<template>
  <div class="section">
    <div class="container">
      <template v-if="dest">
        <nav class="crumb">
          <RouterLink to="/destinations" class="crumb__link">← 返回目的地列表</RouterLink>
        </nav>

        <div class="detail">
          <PhotoGallery :images="dest.gallery" />

          <div class="detail__body">
            <div class="detail__head">
              <div>
                <h1 class="detail__name">{{ dest.name }}</h1>
                <p class="detail__country">{{ dest.country }} · {{ dest.region }}</p>
              </div>
              <FavoriteButton :active="isFavorite(dest.id)" @toggle="toggleFavorite(dest.id)" />
            </div>

            <RatingStars :model-value="dest.rating" readonly />

            <div class="detail__tags">
              <TagBadge v-for="t in dest.tags" :key="t" :text="t" />
            </div>

            <p class="detail__desc">{{ dest.description }}</p>

            <h2 class="detail__sub">实用信息</h2>
            <FactList :facts="dest.facts" />
          </div>
        </div>
      </template>

      <EmptyState v-else icon="🧭" title="目的地不存在" desc="你访问的地址可能已失效。">
        <RouterLink to="/destinations" class="btn btn--primary">返回目的地列表</RouterLink>
      </EmptyState>
    </div>
  </div>
</template>

<style scoped>
.crumb { margin-bottom: 1.2rem; }
.crumb__link { color: var(--text-muted); font-size: 0.9rem; }
.crumb__link:hover { color: var(--accent); }
.detail {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2rem;
  align-items: start;
}
.detail__body {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.detail__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.detail__name { font-size: 2rem; }
.detail__country { color: var(--text-muted); font-size: 0.9rem; }
.detail__tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.detail__desc { color: var(--text); }
.detail__sub { font-size: 1.2rem; margin-top: 0.5rem; }
@media (max-width: 860px) {
  .detail { grid-template-columns: 1fr; }
}
</style>
