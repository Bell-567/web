<script setup>
// 知识点：props、ref、v-for、v-show、class 绑定
import { ref } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
})

const active = ref(0)
const prev = () => {
  active.value = (active.value - 1 + props.images.length) % props.images.length
}
const next = () => {
  active.value = (active.value + 1) % props.images.length
}
</script>

<template>
  <view class="gallery">
    <view class="gallery__main">
      <image class="gallery__img" :src="images[active]" mode="aspectFill" />
      <view v-show="images.length > 1" class="gallery__nav gallery__nav--prev" @click="prev">
        <text>‹</text>
      </view>
      <view v-show="images.length > 1" class="gallery__nav gallery__nav--next" @click="next">
        <text>›</text>
      </view>
    </view>
    <view class="gallery__thumbs">
      <view
        v-for="(img, i) in images"
        :key="i"
        class="gallery__thumb"
        :class="{ 'gallery__thumb--active': i === active }"
        @click="active = i"
      >
        <image class="gallery__thumb-img" :src="img" mode="aspectFill" />
      </view>
    </view>
  </view>
</template>

<style scoped>
.gallery__main {
  position: relative;
  width: 100%;
  height: 260px;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg-soft);
}
.gallery__img {
  width: 100%;
  height: 100%;
}
.gallery__nav {
  position: absolute;
  top: 50%;
  margin-top: -20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
}
.gallery__nav text {
  color: #fff;
  font-size: 24px;
  line-height: 1;
}
.gallery__nav--prev {
  left: 12px;
}
.gallery__nav--next {
  right: 12px;
}
.gallery__thumbs {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.gallery__thumb {
  width: 25%;
  height: 70px;
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.gallery__thumb-img {
  width: 100%;
  height: 100%;
}
.gallery__thumb--active {
  border-color: var(--accent);
}
</style>
