<script setup>
// 知识点：生命周期钩子（onMounted / onBeforeUnmount）、ref、v-if + <Transition>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const show = ref(false)

function onScroll() {
  show.value = window.scrollY > 400
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="fade">
    <button
      v-if="show"
      class="backtop"
      aria-label="返回顶部"
      @click="window.scrollTo({ top: 0, behavior: 'smooth' })"
    >
      ↑
    </button>
  </Transition>
</template>

<style scoped>
.backtop {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--accent);
  color: #fff;
  font-size: 1.2rem;
  box-shadow: var(--shadow-lg);
  transition: transform 0.2s ease, background 0.2s ease;
}
.backtop:hover {
  background: var(--accent-hover);
  transform: translateY(-3px);
}
</style>
