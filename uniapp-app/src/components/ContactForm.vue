<script setup>
// 知识点：reactive、ref、computed、表单校验、组件 v-model、v-if/v-else、调用后端接口
import { reactive, ref, computed } from 'vue'
import { api } from '../api/client'
import FormInput from './FormInput.vue'

const form = reactive({ name: '', email: '', message: '' })
const errors = reactive({ name: '', email: '', message: '' })
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref('')

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))

function validate() {
  errors.name = form.name.trim() ? '' : '请输入你的称呼'
  errors.email = form.email.trim() ? (emailValid.value ? '' : '邮箱格式不正确') : '请输入邮箱'
  errors.message = form.message.trim() ? '' : '请填写留言内容'
  return !errors.name && !errors.email && !errors.message
}

async function submit() {
  if (submitting.value || !validate()) return

  submitting.value = true
  submitError.value = ''
  try {
    await api.post('/contact', {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    })
    submitted.value = true
  } catch (err) {
    submitError.value = err.message
  } finally {
    submitting.value = false
  }
}

function reset() {
  form.name = ''
  form.email = ''
  form.message = ''
  errors.name = ''
  errors.email = ''
  errors.message = ''
  submitError.value = ''
  submitted.value = false
}
</script>

<template>
  <view class="contact">
    <view v-if="!submitted" class="contact__form">
      <FormInput v-model="form.name" label="称呼" :error="errors.name" />
      <FormInput v-model="form.email" label="邮箱" type="email" :error="errors.email" />
      <FormInput v-model="form.message" label="留言" textarea :error="errors.message" />
      <view class="btn btn--primary btn--block" :class="{ 'contact__submit--busy': submitting }" @click="submit">
        <text>{{ submitting ? '提交中…' : '提交留言' }}</text>
      </view>
      <text v-if="submitError" class="contact__error">{{ submitError }}</text>
    </view>

    <view v-else class="contact__success">
      <text class="contact__success-icon">✅</text>
      <text class="contact__success-title">谢谢你的留言，{{ form.name }}！</text>
      <text class="contact__success-desc">留言已保存到 Express 后端（SQLite）。以下是你的内容：</text>
      <view class="contact__quote">
        <text>{{ form.message }}</text>
      </view>
      <view class="btn btn--soft" @click="reset">
        <text>再写一条</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.contact {
  width: 100%;
  max-width: 520px;
}
.contact__submit--busy {
  opacity: 0.65;
  pointer-events: none;
}
.contact__error {
  display: block;
  margin-top: 10px;
  color: #c0392b;
  font-size: 13px;
  text-align: center;
}
.contact__success {
  text-align: center;
  padding: 16px 0;
}
.contact__success-icon {
  display: block;
  font-size: 40px;
  margin-bottom: 8px;
}
.contact__success-title {
  display: block;
  font-family: var(--font-head);
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}
.contact__success-desc {
  display: block;
  color: var(--text-muted);
  font-size: 14px;
}
.contact__quote {
  margin: 16px 0;
  padding: 14px 16px;
  border-left: 3px solid var(--accent);
  background: var(--bg-soft);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  text-align: left;
  color: var(--text);
}
</style>
