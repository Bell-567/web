<script setup>
// 知识点：props、ref、事件处理、v-for、v-show、class 绑定、方法
import { ref } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
})

const active = ref(0)
const prev = () => { active.value = (active.value - 1 + props.images.length) % props.images.length }
const next = () => { active.value = (active.value + 1) % props.images.length }
</script>

<template>
  <div class="gallery">
    <div class="gallery__main">
      <img :src="images[active]" :key="active" alt="目的地图片" />
      <!-- v-show：只有一张图时隐藏翻页按钮（元素保留在 DOM 中） -->
      <button v-show="images.length > 1" class="gallery__nav gallery__nav--prev" aria-label="上一张" @click="prev">‹</button>
      <button v-show="images.length > 1" class="gallery__nav gallery__nav--next" aria-label="下一张" @click="next">›</button>
    </div>
    <div class="gallery__thumbs">
      <button
        v-for="(img, i) in images"
        :key="i"
        type="button"
        class="gallery__thumb"
        :class="{ 'gallery__thumb--active': i === active }"
        @click="active = i"
      >
        <img :src="img" :alt="`缩略图 ${i + 1}`" loading="lazy" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.gallery__main {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg-soft);
}
.gallery__main img { width: 100%; height: 100%; object-fit: cover; }
.gallery__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 1.4rem;
  transition: background 0.15s ease;
}
.gallery__nav:hover { background: rgba(0, 0, 0, 0.65); }
.gallery__nav--prev { left: 0.8rem; }
.gallery__nav--next { right: 0.8rem; }
.gallery__thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  margin-top: 0.6rem;
}
.gallery__thumb {
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  overflow: hidden;
  padding: 0;
  background: none;
  aspect-ratio: 4 / 3;
  transition: border-color 0.15s ease;
}
.gallery__thumb img { width: 100%; height: 100%; object-fit: cover; }
.gallery__thumb--active { border-color: var(--accent); }
</style>
