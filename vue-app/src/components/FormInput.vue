<script setup>
// 知识点：props、defineModel、v-if/v-else、v-model
defineProps({
  label: String,
  type: { type: String, default: 'text' },
  textarea: { type: Boolean, default: false },
  error: String,
})
const model = defineModel({ default: '' })
</script>

<template>
  <label class="field">
    <span class="field__label">{{ label }}</span>
    <textarea v-if="textarea" v-model="model" class="field__input" rows="5"></textarea>
    <input v-else v-model="model" class="field__input" :type="type" />
    <span v-if="error" class="field__error">{{ error }}</span>
  </label>
</template>
