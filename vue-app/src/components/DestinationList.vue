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
  <div class="dest-list">
    <DestinationCard
      v-for="d in destinations"
      :key="d.id"
      :destination="d"
      :favorite="isFavorite(d.id)"
      @toggle-favorite="$emit('toggle-favorite', d.id)"
    />
  </div>
</template>

<style scoped>
.dest-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.4rem;
}
</style>
