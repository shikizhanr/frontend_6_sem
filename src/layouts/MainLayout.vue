<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="app-header">
      <q-toolbar class="q-px-md q-px-md-lg">
        <q-btn flat dense round icon="menu" aria-label="Открыть меню" @click="ui.toggleDrawer" />
        <q-toolbar-title class="row items-center no-wrap q-gutter-sm">
          <span class="toolbar-logo"><q-icon name="done_all" /></span>
          <span class="text-weight-bold">Focus</span>
        </q-toolbar-title>
        <q-btn flat round :icon="ui.isDark ? 'light_mode' : 'dark_mode'" aria-label="Сменить тему" @click="ui.toggleTheme" />
        <q-btn flat round icon="logout" aria-label="Выйти" @click="logout"><q-tooltip>Выйти</q-tooltip></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="ui.drawerOpen" show-if-above :width="260" class="app-drawer">
      <div class="drawer-caption">Рабочее пространство</div>
      <q-list padding class="q-gutter-xs">
        <q-item clickable v-ripple to="/" exact class="nav-item"><q-item-section avatar><q-icon name="checklist" /></q-item-section><q-item-section>Мои задачи</q-item-section></q-item>
        <q-item clickable v-ripple to="/settings" class="nav-item"><q-item-section avatar><q-icon name="tune" /></q-item-section><q-item-section>Настройки</q-item-section></q-item>
      </q-list>
      <div class="drawer-note"><q-icon name="tips_and_updates" size="22px" /><div><strong>Маленький шаг</strong><br>Начните с одной задачи.</div></div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUiStore } from '../stores/uiStore'
import { useUserStore } from '../stores/userStore'
defineOptions({ name: 'MainLayout' })
const ui = useUiStore()
const user = useUserStore()
const router = useRouter()
async function logout(): Promise<void> { user.logout(); await router.push('/login') }
</script>
