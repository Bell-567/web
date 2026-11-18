<script setup>
// 知识点：props、事件、子组件组合、RouterLink、v-for
import TagBadge from './TagBadge.vue'
import RatingStars from './RatingStars.vue'
import FavoriteButton from './FavoriteButton.vue'

defineProps({
  destination: { type: Object, required: true },
  favorite: { type: Boolean, default: false },
})
defineEmits(['toggle-favorite'])
</script>

<template>
  <article class="card card--hover dest-card">
    <div class="dest-card__media">
      <RouterLink :to="`/destinations/${destination.id}`" class="dest-card__img">
        <img :src="destination.image" :alt="destination.name" loading="lazy" />
      </RouterLink>
      <FavoriteButton
        class="dest-card__fav"
        :active="favorite"
        @toggle="$emit('toggle-favorite')"
      />
    </div>
    <div class="dest-card__body">
      <div class="dest-card__top">
        <h3 class="dest-card__name">{{ destination.name }}</h3>
        <RatingStars :model-value="destination.rating" readonly />
      </div>
      <p class="dest-card__country">{{ destination.country }} · {{ destination.region }}</p>
      <p class="dest-card__summary">{{ destination.summary }}</p>
      <div class="dest-card__tags">
        <TagBadge v-for="t in destination.tags" :key="t" :text="t" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.dest-card { display: flex; flex-direction: column; }
.dest-card__media {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}
.dest-card__img { display: block; height: 100%; }
.dest-card__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.dest-card:hover .dest-card__img img { transform: scale(1.06); }
.dest-card__fav {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
}
.dest-card__body { padding: 1.1rem 1.2rem 1.3rem; display: flex; flex-direction: column; gap: 0.35rem; }
.dest-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.dest-card__name { font-size: 1.2rem; }
.dest-card__country { color: var(--text-muted); font-size: 0.85rem; }
.dest-card__summary { color: var(--text); font-size: 0.9rem; }
.dest-card__tags { display: flex; gap: 0.4rem; margin-top: 0.4rem; flex-wrap: wrap; }
</style>
