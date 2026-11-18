<script setup>
// 知识点：页面参数 onLoad、computed、watch、v-if/v-else、组件复用、后端数据加载
import { ref, computed, watch, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppShell from '../../components/AppShell.vue'
import PhotoGallery from '../../components/PhotoGallery.vue'
import RatingStars from '../../components/RatingStars.vue'
import TagBadge from '../../components/TagBadge.vue'
import FactList from '../../components/FactList.vue'
import FavoriteButton from '../../components/FavoriteButton.vue'
import EmptyState from '../../components/EmptyState.vue'
import { useDestinations } from '../../composables/useDestinations'
import { useFavorites } from '../../composables/useFavorites'
import { usePageScroll } from '../../composables/usePageScroll'
import { provideSite } from '../../composables/useSite'

provideSite()
const { showBackTop } = usePageScroll()
const { isFavorite, toggleFavorite } = useFavorites()
const { destinations, fetchDestinations } = useDestinations()

onMounted(fetchDestinations)

const id = ref('')

// 小程序 / App 通过 onLoad(options) 接收 navigateTo 的 query 参数
onLoad((options) => {
  id.value = (options && options.id) || ''
})

const dest = computed(() => destinations.value.find((d) => d.id === id.value))

watch(dest, (value) => {
  if (value) {
    uni.setNavigationBarTitle({ title: value.name })
    uni.pageScrollTo({ scrollTop: 0, duration: 0 })
  }
})

function goBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({ url: '/pages/destinations/index' })
  }
}

function goList() {
  uni.switchTab({ url: '/pages/destinations/index' })
}
</script>

<template>
  <AppShell :show-back-top="showBackTop">
    <view class="section">
      <view class="container">
        <template v-if="dest">
          <view class="crumb" @click="goBack">
            <text class="crumb__link">← 返回目的地列表</text>
          </view>

          <view class="detail">
            <view class="detail__gallery">
              <PhotoGallery :images="dest.gallery" />
            </view>

            <view class="detail__body card">
              <view class="detail__head">
                <view class="detail__title-wrap">
                  <text class="detail__name">{{ dest.name }}</text>
                  <text class="detail__country">{{ dest.country }} · {{ dest.region }}</text>
                </view>
                <FavoriteButton
                  :active="isFavorite(dest.id)"
                  @toggle="toggleFavorite(dest.id)"
                />
              </view>

              <RatingStars :model-value="dest.rating" readonly />

              <view class="detail__tags">
                <TagBadge v-for="t in dest.tags" :key="t" :text="t" />
              </view>

              <text class="detail__desc">{{ dest.description }}</text>

              <text class="detail__sub">实用信息</text>
              <FactList :facts="dest.facts" />
            </view>
          </view>
        </template>

        <EmptyState v-else icon="🧭" title="目的地不存在" desc="你访问的地址可能已失效。">
          <view class="btn btn--primary" @click="goList">
            <text>返回目的地列表</text>
          </view>
        </EmptyState>
      </view>
    </view>
  </AppShell>
</template>

<style scoped>
.crumb {
  margin-bottom: 18px;
}
.crumb__link {
  color: var(--text-muted);
  font-size: 14px;
}
.detail {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}
.detail__gallery {
  width: 58%;
}
.detail__body {
  flex: 1;
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.detail__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}
.detail__title-wrap {
  flex: 1;
}
.detail__name {
  display: block;
  font-family: var(--font-head);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
}
.detail__country {
  display: block;
  color: var(--text-muted);
  font-size: 14px;
}
.detail__tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.detail__desc {
  display: block;
  color: var(--text);
  font-size: 15px;
}
.detail__sub {
  display: block;
  font-family: var(--font-head);
  font-size: 19px;
  font-weight: 700;
  margin-top: 6px;
}
@media (max-width: 860px) {
  .detail {
    flex-direction: column;
  }
  .detail__gallery {
    width: 100%;
  }
  .detail__body {
    width: 100%;
  }
}
</style>
