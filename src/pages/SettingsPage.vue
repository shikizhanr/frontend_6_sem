<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
      <BreadcrumbNav class="q-mb-lg" />
      <div class="q-mb-lg">
        <div class="text-overline text-primary">ПЕРСОНАЛИЗАЦИЯ</div>
        <h1 class="text-h3 text-weight-bold q-my-xs">Настройки</h1>
        <div class="text-grey-7">Настройте рабочее пространство под себя.</div>
      </div>
      <q-list separator class="settings-card">
        <q-item tag="label">
          <q-item-section><q-item-label>Темная тема</q-item-label><q-item-label caption>Текущая тема: {{ ui.themeLabel }}</q-item-label></q-item-section>
          <q-item-section side><q-toggle v-model="ui.isDark" /></q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section><q-item-label>Компактный режим</q-item-label><q-item-label caption>Уменьшает визуальные интервалы в списках</q-item-label></q-item-section>
          <q-item-section side><q-toggle v-model="compactMode" /></q-item-section>
        </q-item>
      </q-list>
      <q-btn color="primary" label="Сохранить" icon="save" class="q-mt-lg" :loading="saving" @click="save" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import { useUiStore } from '../stores/uiStore'
import { useUserStore } from '../stores/userStore'
defineOptions({ name: 'SettingsPage' })
const $q = useQuasar(); const ui = useUiStore(); const user = useUserStore()
const compactMode = ref(user.settings.compactMode); const saving = ref(false)
async function save(): Promise<void> {
  saving.value = true
  try { await user.saveSettings({ theme: ui.isDark ? 'dark' : 'light', compactMode: compactMode.value }); $q.notify({ type: 'positive', message: 'Настройки сохранены' }) }
  catch { $q.notify({ type: 'negative', message: 'Не удалось сохранить настройки' }) }
  finally { saving.value = false }
}
</script>
