<script setup>
// 知识点：props、defineModel（命名 v-model）、v-for、class 绑定
// 小程序没有 <select>，改用 uni-app 的 <picker mode="selector">
import { computed } from 'vue'

defineProps({
  regions: { type: Array, default: () => [] },
})

const region = defineModel('region', { default: '全部' })
const sort = defineModel('sort', { default: 'default' })

const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'rating', label: '按评分' },
  { value: 'name', label: '按名称' },
]
const sortLabels = sortOptions.map((o) => o.label)

const sortIndex = computed(() => Math.max(0, sortOptions.findIndex((o) => o.value === sort.value)))

function onSortChange(e) {
  sort.value = sortOptions[Number(e.detail.value)].value
}
</script>

<template>
  <view class="filterbar">
    <view class="filterbar__chips">
      <view
        v-for="r in ['全部', ...regions]"
        :key="r"
        class="chip"
        :class="{ 'chip--active': region === r }"
        @click="region = r"
      >
        <text>{{ r }}</text>
      </view>
    </view>

    <picker mode="selector" :range="sortLabels" :value="sortIndex" @change="onSortChange">
      <view class="filterbar__select">
        <text>{{ sortLabels[sortIndex] }} ▾</text>
      </view>
    </picker>
  </view>
</template>

<style scoped>
.filterbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.filterbar__chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.filterbar__select {
  padding: 7px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-size: 14px;
}
</style>
