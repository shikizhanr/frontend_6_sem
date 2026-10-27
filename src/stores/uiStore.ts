import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { Dark, Notify } from 'quasar'

export const useUiStore = defineStore('ui', () => {
  const isDark = ref(localStorage.getItem('todo-theme') === 'dark')
  const drawerOpen = ref(true)
  const themeLabel = computed(() => isDark.value ? 'Темная' : 'Светлая')
  watch(isDark, (value) => { Dark.set(value); localStorage.setItem('todo-theme', value ? 'dark' : 'light') }, { immediate: true })
  function toggleTheme(): void { isDark.value = !isDark.value }
  function toggleDrawer(): void { drawerOpen.value = !drawerOpen.value }
  function notify(message: string, type: 'positive' | 'negative' | 'info' = 'info'): void { Notify.create({ message, type }) }
  return { isDark, drawerOpen, themeLabel, toggleTheme, toggleDrawer, notify }
})
