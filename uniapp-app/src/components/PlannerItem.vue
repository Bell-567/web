<script setup>
// 知识点：props、事件、ref、v-if/v-else、class 绑定、confirm 事件
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
  <view class="planner-item" :class="{ 'planner-item--done': item.done }">
    <checkbox-group class="planner-item__check" :value="item.done ? ['done'] : []" @change="emit('toggle')">
      <checkbox value="done" :checked="item.done" color="#d96c4b" />
    </checkbox-group>

    <text class="planner-item__prio" :class="priorityClass[item.priority]">{{ item.priority }}</text>

    <template v-if="editing">
      <input
        v-model="draft"
        class="planner-item__edit"
        confirm-type="done"
        :focus="true"
        @confirm="save"
      />
      <view class="planner-item__btn" @click="save"><text>✓</text></view>
    </template>
    <template v-else>
      <text class="planner-item__text">{{ item.text }}</text>
      <view class="planner-item__btn" @click="startEdit"><text>✎</text></view>
    </template>

    <view class="planner-item__btn planner-item__btn--danger" @click="emit('remove')">
      <text>🗑</text>
    </view>
  </view>
</template>

<style scoped>
.planner-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.planner-item--done {
  opacity: 0.55;
}
.planner-item--done .planner-item__text {
  text-decoration: line-through;
}
.planner-item__check {
  display: flex;
  align-items: center;
}
.planner-item__prio {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
}
.prio--high {
  background: var(--accent-soft);
  color: var(--accent);
}
.prio--mid {
  background: rgba(233, 196, 106, 0.3);
  color: #a0791a;
}
.prio--low {
  background: var(--bg-soft);
  color: var(--text-muted);
}
.planner-item__text {
  flex: 1;
  font-size: 15px;
}
.planner-item__edit {
  flex: 1;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--accent);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 15px;
}
.planner-item__btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 15px;
}
.planner-item__btn--danger {
  color: var(--danger);
}
</style>
