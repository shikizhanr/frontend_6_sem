<template>
  <q-page class="login-page flex flex-center q-pa-md">
    <q-card class="login-card row no-wrap">
      <section class="login-intro col-12 col-md-6">
        <div class="brand-mark"><q-icon name="done_all" size="26px" /></div>
        <div class="text-overline">FOCUS SPACE</div>
        <h1>Держите день<br><span>под контролем</span></h1>
        <p>Лаконичный планировщик для задач, которые действительно важно завершить.</p>
        <div class="login-feature"><q-icon name="bolt" /> Быстрое добавление и поиск</div>
        <div class="login-feature"><q-icon name="palette" /> Светлая и тёмная темы</div>
      </section>

      <section class="login-form col-12 col-md-6">
        <div class="text-overline text-primary">С возвращением</div>
        <div class="text-h4 text-weight-bold q-mt-xs">Вход в аккаунт</div>
        <div class="text-body2 text-grey-7 q-mt-sm q-mb-lg">Введите данные, чтобы продолжить работу.</div>
        <q-form @submit.prevent="submit">
          <div class="q-gutter-md">
          <q-input v-model="form.values.email" outlined type="email" label="Email" :error="Boolean(form.errors.email)" :error-message="form.errors.email" @blur="form.validateField('email')">
            <template #prepend><q-icon name="alternate_email" /></template>
          </q-input>
          <q-input v-model="form.values.password" outlined :type="showPassword ? 'text' : 'password'" label="Пароль" :error="Boolean(form.errors.password)" :error-message="form.errors.password" @blur="form.validateField('password')">
            <template #prepend><q-icon name="lock_outline" /></template>
            <template #append><q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" /></template>
          </q-input>
          <FormError :message="serverError" />
          </div>
          <q-btn type="submit" unelevated color="primary" label="Войти" icon-right="arrow_forward" class="full-width action-button q-mt-lg" :loading="loading" />
        </q-form>
      </section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormError from '../components/FormError.vue'
import { useValidation } from '../composables/useValidation'
import { loginSchema } from '../utils/validation'
import { classifyError } from '../utils/errorHandling'
import { useUserStore } from '../stores/userStore'

defineOptions({ name: 'LoginPage' })
const form = useValidation({ email: '', password: '' }, loginSchema)
const showPassword = ref(false)
const loading = ref(false)
const serverError = ref('')
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
async function submit(): Promise<void> {
  if (!form.validate()) return
  loading.value = true; serverError.value = ''
  try { await userStore.login(form.values); await router.push(String(route.query.redirect || '/')) }
  catch (error) { serverError.value = classifyError(error).message }
  finally { loading.value = false }
}
</script>
