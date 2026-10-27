import { createRouter, createWebHistory } from 'vue-router'
import { defineRouter } from '#q-app'
import { routes } from './routes'
import { installGuards } from './guards'

export default defineRouter(() => {
  const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes, scrollBehavior: () => ({ top: 0 }) })
  installGuards(router)
  return router
})
