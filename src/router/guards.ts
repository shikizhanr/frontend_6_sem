import type { Router } from 'vue-router'
import { useUserStore } from '../stores/userStore'

export function installGuards(router: Router): void {
  router.beforeEach((to) => {
    const userStore = useUserStore()
    if (to.meta.requiresAuth && !userStore.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
    if (to.meta.guestOnly && userStore.isAuthenticated) return { name: 'home' }
    return true
  })
  router.afterEach((to) => { document.title = `${to.meta.title} — Мои задачи` })
}
