<script setup>
// 知识点：reactive、ref、computed、表单校验、v-model 于子组件、v-if/v-else、调用后端接口
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
  <div class="contact">
    <form v-if="!submitted" class="contact__form" @submit.prevent="submit">
      <FormInput v-model="form.name" label="称呼" :error="errors.name" />
      <FormInput v-model="form.email" label="邮箱" type="email" :error="errors.email" />
      <FormInput v-model="form.message" label="留言" textarea :error="errors.message" />
      <button type="submit" class="btn btn--primary btn--block" :class="{ 'contact__submit--busy': submitting }">
        {{ submitting ? '提交中…' : '提交留言' }}
      </button>
      <p v-if="submitError" class="contact__error">{{ submitError }}</p>
    </form>

    <div v-else class="contact__success">
      <div class="contact__success-icon">✅</div>
      <h3>谢谢你的留言，{{ form.name }}！</h3>
      <p>留言已保存到 Express 后端（SQLite）。以下是你的内容：</p>
      <blockquote class="contact__quote">{{ form.message }}</blockquote>
      <button class="btn btn--soft" @click="reset">再写一条</button>
    </div>
  </div>
</template>

<style scoped>
.contact { max-width: 520px; }
.contact__submit--busy { opacity: 0.65; pointer-events: none; }
.contact__error { margin-top: 0.6rem; color: #c0392b; font-size: 0.85rem; text-align: center; }
.contact__success { text-align: center; padding: 1rem 0; }
.contact__success-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.contact__success h3 { margin-bottom: 0.5rem; }
.contact__success p { color: var(--text-muted); font-size: 0.9rem; }
.contact__quote {
  margin: 1rem 0;
  padding: 0.9rem 1rem;
  border-left: 3px solid var(--accent);
  background: var(--bg-soft);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  text-align: left;
  color: var(--text);
}
</style>
