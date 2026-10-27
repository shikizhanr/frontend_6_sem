<template>
  <q-page class="flex flex-center q-pa-md bg-grey-2">
    <q-card class="col-12 col-sm-8 col-md-5 col-lg-4">
      <q-card-section class="q-pa-lg">
        <div class="text-h4 text-weight-medium">Вход</div>
        <div class="text-body2 text-grey-7 q-mt-sm">Используйте demo@example.com и пароль demo123.</div>
      </q-card-section>
      <q-form @submit.prevent="submit">
        <q-card-section class="q-gutter-md q-pt-none">
          <q-input v-model="form.values.email" outlined type="email" label="Email" :error="Boolean(form.errors.email)" :error-message="form.errors.email" @blur="form.validateField('email')" />
          <q-input v-model="form.values.password" outlined :type="showPassword ? 'text' : 'password'" label="Пароль" :error="Boolean(form.errors.password)" :error-message="form.errors.password" @blur="form.validateField('password')">
            <template #append><q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" /></template>
          </q-input>
          <FormError :message="serverError" />
        </q-card-section>
        <q-card-actions class="q-px-lg q-pb-lg">
          <q-btn type="submit" color="primary" label="Войти" class="full-width" :loading="loading" />
        </q-card-actions>
      </q-form>
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
const form = useValidation({ email: 'demo@example.com', password: 'demo123' }, loginSchema)
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
