<script setup>
// 知识点：props、defineModel、v-if/v-else、v-model
// 小程序 input 的 type 仅支持 text/number/digit/idcard/nickname，email 统一回退为 text
import { computed } from 'vue'

const props = defineProps({
  label: String,
  type: { type: String, default: 'text' },
  textarea: { type: Boolean, default: false },
  error: String,
})

const model = defineModel({ default: '' })
const inputType = computed(() => (props.type === 'email' ? 'text' : props.type))
</script>

<template>
  <view class="field">
    <text class="field__label">{{ label }}</text>
    <textarea
      v-if="textarea"
      v-model="model"
      class="field__textarea"
      :maxlength="-1"
      placeholder="请输入…"
      placeholder-class="field__placeholder"
    ></textarea>
    <input
      v-else
      v-model="model"
      class="field__input"
      :type="inputType"
      placeholder="请输入…"
      placeholder-class="field__placeholder"
    />
    <text v-if="error" class="field__error">{{ error }}</text>
  </view>
</template>

<style scoped>
.field__placeholder {
  color: var(--text-muted);
}
</style>
