import { createPinia } from 'pinia'
import { defineStore } from '#q-app'

export const pinia = createPinia()
export default defineStore(() => pinia)
export { useTodoStore } from './todoStore'
export { useUiStore } from './uiStore'
export { useUserStore } from './userStore'
