<script setup>
// 知识点：props、v-for（带 key）、事件透传
import DestinationCard from './DestinationCard.vue'

defineProps({
  destinations: { type: Array, default: () => [] },
  isFavorite: { type: Function, default: () => false },
})
defineEmits(['toggle-favorite'])
</script>

<template>
  <view class="dest-list">
    <view v-for="d in destinations" :key="d.id" class="dest-list__item">
      <DestinationCard
        :destination="d"
        :favorite="isFavorite(d.id)"
        @toggle-favorite="$emit('toggle-favorite', d.id)"
      />
    </view>
  </view>
</template>

<style scoped>
.dest-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -7px;
}
.dest-list__item {
  width: 50%;
  padding: 0 7px 14px;
}
@media (max-width: 720px) {
  .dest-list__item {
    width: 100%;
  }
}
</style>
