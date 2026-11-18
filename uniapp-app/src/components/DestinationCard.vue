<script setup>
// 知识点：props、事件、子组件组合、v-for、页面跳转（navigateTo）
import TagBadge from './TagBadge.vue'
import RatingStars from './RatingStars.vue'
import FavoriteButton from './FavoriteButton.vue'

const props = defineProps({
  destination: { type: Object, required: true },
  favorite: { type: Boolean, default: false },
})
defineEmits(['toggle-favorite'])

function goDetail() {
  uni.navigateTo({ url: `/pages/destination/detail?id=${props.destination.id}` })
}
</script>

<template>
  <view class="card dest-card">
    <view class="dest-card__media" @click="goDetail">
      <image class="dest-card__img" :src="destination.image" mode="aspectFill" />
      <view class="dest-card__fav">
        <FavoriteButton :active="favorite" @toggle="$emit('toggle-favorite')" />
      </view>
    </view>
    <view class="dest-card__body">
      <view class="dest-card__top">
        <text class="dest-card__name">{{ destination.name }}</text>
        <RatingStars :model-value="destination.rating" readonly />
      </view>
      <text class="dest-card__country">{{ destination.country }} · {{ destination.region }}</text>
      <text class="dest-card__summary">{{ destination.summary }}</text>
      <view class="dest-card__tags">
        <TagBadge v-for="t in destination.tags" :key="t" :text="t" />
      </view>
    </view>
  </view>
</template>

<style scoped>
.dest-card {
  display: flex;
  flex-direction: column;
}
.dest-card__media {
  position: relative;
  width: 100%;
  height: 210px;
  overflow: hidden;
}
.dest-card__img {
  width: 100%;
  height: 100%;
}
.dest-card__fav {
  position: absolute;
  top: 11px;
  right: 11px;
}
.dest-card__body {
  padding: 18px 19px 21px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.dest-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.dest-card__name {
  font-family: var(--font-head);
  font-size: 19px;
  font-weight: 700;
}
.dest-card__country {
  color: var(--text-muted);
  font-size: 13px;
}
.dest-card__summary {
  color: var(--text);
  font-size: 14px;
}
.dest-card__tags {
  display: flex;
  gap: 6px;
  margin-top: 6px;
  flex-wrap: wrap;
}
</style>
