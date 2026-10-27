import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login', component: () => import('../layouts/AuthLayout.vue'),
    meta: { requiresAuth: false, guestOnly: true, title: 'Вход', breadcrumb: 'Вход', layout: 'auth' },
    children: [{ path: '', name: 'login', component: () => import('../pages/LoginPage.vue'), meta: { requiresAuth: false, guestOnly: true, title: 'Вход', breadcrumb: 'Вход', layout: 'auth' } }]
  },
  {
    path: '/', component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true, title: 'Задачи', breadcrumb: 'Главная', layout: 'main' },
    children: [
      { path: '', name: 'home', component: () => import('../pages/IndexPage.vue'), meta: { requiresAuth: true, title: 'Задачи', breadcrumb: 'Задачи', layout: 'main' } },
      { path: 'settings', name: 'settings', component: () => import('../pages/SettingsPage.vue'), meta: { requiresAuth: true, title: 'Настройки', breadcrumb: 'Настройки', layout: 'main' } }
    ]
  },
  { path: '/404', name: 'not-found', component: () => import('../pages/NotFoundPage.vue'), meta: { requiresAuth: false, title: 'Страница не найдена', breadcrumb: '404', layout: 'auth' } },
  { path: '/:pathMatch(.*)*', redirect: '/404' }
]
