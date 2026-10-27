<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Открыть меню" @click="ui.toggleDrawer" />
        <q-toolbar-title>Мои задачи</q-toolbar-title>
        <q-btn flat round :icon="ui.isDark ? 'light_mode' : 'dark_mode'" aria-label="Сменить тему" @click="ui.toggleTheme" />
        <q-btn flat round icon="logout" aria-label="Выйти" @click="logout"><q-tooltip>Выйти</q-tooltip></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="ui.drawerOpen" show-if-above bordered :width="240">
      <q-list padding>
        <q-item-label header>Навигация</q-item-label>
        <q-item clickable v-ripple to="/" exact><q-item-section avatar><q-icon name="checklist" /></q-item-section><q-item-section>Задачи</q-item-section></q-item>
        <q-item clickable v-ripple to="/settings"><q-item-section avatar><q-icon name="settings" /></q-item-section><q-item-section>Настройки</q-item-section></q-item>
      </q-list>
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
