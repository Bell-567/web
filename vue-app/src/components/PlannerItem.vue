<script setup>
// 知识点：props、事件、ref、v-if/v-else、class 绑定、按键修饰符 .enter
import { ref } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
})
const emit = defineEmits(['toggle', 'remove', 'update'])

const editing = ref(false)
const draft = ref('')

const priorityClass = { 高: 'prio--high', 中: 'prio--mid', 低: 'prio--low' }

function startEdit() {
  draft.value = props.item.text
  editing.value = true
}
function save() {
  emit('update', draft.value.trim() || props.item.text)
  editing.value = false
}
</script>

<template>
  <li class="planner-item" :class="{ 'planner-item--done': item.done }">
    <input
      type="checkbox"
      class="planner-item__check"
      :checked="item.done"
      @change="emit('toggle')"
    />
    <span class="planner-item__prio" :class="priorityClass[item.priority]">{{ item.priority }}</span>

    <template v-if="editing">
      <input v-model="draft" class="planner-item__edit" @keyup.enter="save" />
      <button class="planner-item__btn" aria-label="保存" @click="save">✓</button>
    </template>
    <template v-else>
      <span class="planner-item__text">{{ item.text }}</span>
      <button class="planner-item__btn" aria-label="编辑" @click="startEdit">✎</button>
    </template>

    <button class="planner-item__btn planner-item__btn--danger" aria-label="删除" @click="emit('remove')">🗑</button>
  </li>
</template>

<style scoped>
.planner-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: opacity 0.2s ease;
}
.planner-item--done { opacity: 0.55; }
.planner-item--done .planner-item__text { text-decoration: line-through; }
.planner-item__check { width: 18px; height: 18px; accent-color: var(--accent); }
.planner-item__prio {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
}
.prio--high { background: var(--accent-soft); color: var(--accent); }
.prio--mid { background: color-mix(in srgb, var(--accent-3) 30%, transparent); color: #a0791a; }
.prio--low { background: var(--bg-soft); color: var(--text-muted); }
[data-theme='dark'] .prio--mid { color: var(--accent-3); }
.planner-item__text { flex: 1; }
.planner-item__edit {
  flex: 1;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--accent);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
}
.planner-item__btn {
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 0.95rem;
  transition: color 0.15s ease;
}
.planner-item__btn:hover { color: var(--accent); }
.planner-item__btn--danger:hover { color: var(--danger); }
</style>
