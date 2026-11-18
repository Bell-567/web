<script setup>
// 知识点：ref、v-model、事件（emit）、表单输入、picker 选择器
import { ref, computed } from 'vue'

const emit = defineEmits(['add'])

const text = ref('')
const priority = ref('中')
const focused = ref(false)
const priorities = ['高', '中', '低']

const priorityIndex = computed(() => Math.max(0, priorities.indexOf(priority.value)))

function onPriorityChange(e) {
  priority.value = priorities[Number(e.detail.value)]
}

function submit() {
  if (!text.value.trim()) return
  emit('add', { text: text.value.trim(), priority: priority.value })
  text.value = ''
  // 小程序通过 :focus 控制聚焦，重新触发一次以获得输入焦点
  focused.value = false
  setTimeout(() => {
    focused.value = true
  }, 50)
}
</script>

<template>
  <view class="planner-form">
    <input
      v-model="text"
      class="planner-form__input"
      placeholder="例如：预订富士山脚下民宿…"
      placeholder-class="planner-form__placeholder"
      confirm-type="done"
      :focus="focused"
      @blur="focused = false"
      @confirm="submit"
    />
    <picker mode="selector" :range="priorities" :value="priorityIndex" @change="onPriorityChange">
      <view class="planner-form__priority">
        <text>{{ priority }}优先级 ▾</text>
      </view>
    </picker>
    <view class="btn btn--primary" @click="submit">
      <text>添加</text>
    </view>
  </view>
</template>

<style scoped>
.planner-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}
.planner-form__input {
  flex: 1;
  min-width: 180px;
  height: 44px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-size: 15px;
}
.planner-form__placeholder {
  color: var(--text-muted);
}
.planner-form__priority {
  height: 44px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-size: 14px;
}
</style>
