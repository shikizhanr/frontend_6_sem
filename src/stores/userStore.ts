import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '../services/authService'
import { hasAccessToken } from '../services/apiClient'
import type { LoginRequest, UserProfile, UserSettings } from '../types'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile | null>(null)
  const settings = ref<UserSettings>({ theme: 'light', compactMode: false })
  const isAuthenticated = computed(() => user.value !== null || hasAccessToken())
  async function login(credentials: LoginRequest): Promise<void> { const response = await authService.login(credentials); user.value = response.user }
  async function loadProfile(): Promise<void> { if (hasAccessToken()) user.value = await authService.profile() }
  async function saveSettings(value: UserSettings): Promise<void> { settings.value = await authService.updateSettings(value) }
  function logout(): void { authService.logout(); user.value = null }
  return { user, settings, isAuthenticated, login, loadProfile, saveSettings, logout }
})
