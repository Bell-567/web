<script setup>
// 知识点：ref、v-model、事件（emit）、模板 ref 聚焦、表单提交修饰符 .prevent
import { ref } from 'vue'

const emit = defineEmits(['add'])

const text = ref('')
const priority = ref('中')
const inputRef = ref(null)
const priorities = ['高', '中', '低']

function submit() {
  if (!text.value.trim()) return
  emit('add', { text: text.value.trim(), priority: priority.value })
  text.value = ''
  inputRef.value?.focus()
}
</script>

<template>
  <form class="planner-form" @submit.prevent="submit">
    <input
      ref="inputRef"
      v-model="text"
      class="planner-form__input"
      placeholder="例如：预订富士山脚下民宿…"
    />
    <select v-model="priority" class="planner-form__priority" aria-label="优先级">
      <option v-for="p in priorities" :key="p" :value="p">{{ p }}优先级</option>
    </select>
    <button type="submit" class="btn btn--primary">添加</button>
  </form>
</template>

<style scoped>
.planner-form {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.planner-form__input {
  flex: 1 1 240px;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
}
.planner-form__input:focus { outline: none; border-color: var(--accent); }
.planner-form__priority {
  padding: 0 0.9rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
}
</style>
