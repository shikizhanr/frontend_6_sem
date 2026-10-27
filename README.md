# Практики 1–11 — ToDo на Vue 3 и Quasar

Проект объединяет задания всех одиннадцати практик: компоненты Quasar, Composition API, строгую типизацию, Pinia, Vue Router, mock backend, Axios, валидацию Zod, централизованные ошибки, Vitest и GitHub Pages.

## Запуск

Используйте Node.js 24 LTS (также поддерживаются Node.js 22.22.2+ и 26+).

```bash
npm install
npm --prefix mock install
npm run dev:all
```

Приложение откроется на `http://localhost:9000`, API — на `http://localhost:3001`. Демо-вход: `demo@example.com` / `demo123`.

## Проверка

```bash
npm test
npm run test:coverage
npm run typecheck
npm run build
```

## Структура практик

1. Конфигурация Quasar, базовая страница и типы.
2. `TodoForm`, `TodoItem`, `TodoList`.
3. `useLocalStorage`, `useTodoFilter`, поиск и анимации.
4. Общие TypeScript-типы, Zod и сервисы.
5. Модульные Pinia stores.
6. Маршруты, layouts, guards, lazy loading и breadcrumbs.
7. `json-server`, mock JWT, CORS и задержки.
8. Axios-клиент, interceptors, retry, кэш и loading states.
9. Общая валидация, классификация ошибок и `FormError`.
10. Unit и component tests, coverage и CI.
11. Production build, env, SEO и GitHub Actions deploy.
