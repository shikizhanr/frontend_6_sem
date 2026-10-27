# Шпаргалка для защиты проекта

## Коротко о проекте

Это SPA-планировщик задач на Vue 3, TypeScript и Quasar. Состояние хранится в Pinia, переходы выполняет Vue Router, формы проверяются через Zod, запросы в локальной версии идут через Axios к `json-server`. На GitHub Pages сервер запустить нельзя, поэтому опубликованная версия использует тот же интерфейс сервисов, но сохраняет данные в `localStorage`.

## Где что реализовано

| Если спрашивают про… | Где смотреть | Что ответить |
| --- | --- | --- |
| Точка входа приложения | `src/main.ts`, `src/App.vue` | В `main.ts` создаются Vue-приложение, Pinia и Router. `App.vue` выводит текущий маршрут через `router-view`. |
| UI-библиотека и сборка | `quasar.config.ts` | Здесь подключены Quasar, Material Icons, плагины Notify/Dialog/LocalStorage, цвета, dev-прокси и путь для GitHub Pages. |
| Компонентный подход | `src/components/` | Форма, элемент и список задач разделены на `TodoForm`, `TodoItem` и `TodoList`. Данные идут вниз через props, события вверх через emits. |
| Главная страница | `src/pages/IndexPage.vue` | Страница связывает интерфейс с `todoStore`: загружает задачи, добавляет, переключает статус, удаляет, показывает поиск и фильтры. |
| Авторизация | `src/pages/LoginPage.vue`, `src/stores/userStore.ts`, `src/services/authService.ts` | Страница валидирует форму и вызывает store, store обращается к сервису, сервис сохраняет токены. После входа Router переводит на главную. |
| Состояние задач | `src/stores/todoStore.ts` | Pinia store хранит задачи, фильтр, поиск, loading и error. Computed-свойства формируют отфильтрованный список и считают активные задачи. |
| Состояние интерфейса | `src/stores/uiStore.ts` | Здесь drawer, тёмная тема и уведомления. Тема сохраняется в `localStorage` через `watch`. |
| Доступ к данным | `src/services/todoService.ts` | Сервис содержит CRUD: `getAll`, `create`, `update`, `remove`. Компоненты не знают, откуда пришли данные. |
| HTTP и токены | `src/services/apiClient.ts` | Axios instance задаёт `baseURL` и timeout. Request interceptor добавляет Bearer-токен, response interceptor обновляет access token после 401 и повторяет запрос. |
| Локальный mock backend | `mock/server.cjs`, `mock/db.json` | `json-server` имитирует REST API, авторизацию, задержку, CORS и хранит тестовые данные. |
| GitHub Pages без backend | `.env.production`, `src/services/authService.ts`, `src/services/todoService.ts` | В production `VITE_API_URL=local`. Сервисы определяют статический режим и работают через `localStorage`; интерфейс и store менять не пришлось. |
| Типизация | `src/types/`, `src/services/types.ts`, `src/env.d.ts` | Интерфейсы описывают задачу, пользователя, настройки, запросы и ответы API. TypeScript проверяется командой `npm run typecheck`. |
| Валидация | `src/utils/validation.ts`, `src/composables/useValidation.ts` | Zod-схемы задают правила, composable хранит значения и ошибки формы, умеет проверять одно поле и всю форму. |
| Обработка ошибок | `src/utils/errorHandling.ts`, `src/components/FormError.vue`, `src/boot/error-handler.ts` | Ошибки API классифицируются в понятный `AppError`, отображаются у формы или в banner; глобальный handler ловит необработанные ошибки Vue. |
| Маршрутизация | `src/router/routes.ts`, `src/router/guards.ts`, `src/router/index.ts` | Маршруты загружаются лениво. Guard защищает страницы по `requiresAuth`, не пускает авторизованного пользователя обратно на вход и меняет title страницы. |
| Layouts | `src/layouts/MainLayout.vue`, `src/layouts/AuthLayout.vue` | Основной layout содержит header, drawer и навигацию. Для страницы входа используется отдельный минимальный layout. |
| Поиск и фильтрация | `src/stores/todoStore.ts`, `src/composables/useTodoFilter.ts` | Текущий интерфейс использует computed в store; отдельный composable демонстрирует переиспользуемую фильтрацию и покрыт unit-тестами. |
| Настройки | `src/pages/SettingsPage.vue`, `src/stores/uiStore.ts`, `src/stores/userStore.ts` | Пользователь меняет тему и компактный режим. UI store применяет тему, user store сохраняет настройки через auth service. |
| Тесты | `tests/unit/`, `tests/components/` | Vitest проверяет stores, composables, utilities и Vue-компоненты. Axios Mock Adapter изолирует сетевые запросы. |
| CI/CD | `.github/workflows/ci.yml`, `.github/workflows/deploy.yml` | После push GitHub Actions устанавливает зависимости, проверяет типы, запускает тесты, собирает проект и публикует `dist/spa` на GitHub Pages. |
| Стили | `src/css/app.scss` | Здесь общая палитра, адаптивность, тёмная тема, карточки, авторизация, навигация и состояния элементов. |

## Как проходит основная логика

### Добавление задачи

1. Пользователь вводит текст в `TodoForm.vue`.
2. Компонент очищает лишние пробелы, проверяет название и отправляет событие `add`.
3. `IndexPage.vue` принимает событие и вызывает `todoStore.addTodo(title)`.
4. Store включает loading и вызывает `todoService.create()`.
5. Сервис валидирует заголовок и отправляет POST локальному API либо записывает задачу в `localStorage` на GitHub Pages.
6. Store добавляет полученную задачу в начало массива, Vue автоматически обновляет список.

### Переключение статуса

`TodoItem` отправляет только id → `TodoList` пробрасывает событие → `IndexPage` вызывает `todoStore.toggleTodo(id)` → store находит задачу → сервис выполняет PATCH или локальное обновление → объект в реактивном массиве меняется.

### Удаление

Перед удалением `IndexPage.vue` открывает диалог Quasar. После подтверждения вызывается `todoStore.deleteTodo`, сервис удаляет запись, а store фильтрует локальный массив. При успехе показывается уведомление.

### Вход и защита маршрутов

`LoginPage` проверяет email и пароль → `userStore.login` вызывает `authService.login` → токены записываются в `localStorage` → guard видит авторизацию и разрешает переход. При выходе токены и пользователь очищаются, затем выполняется переход на `/login`.

### Ошибка запроса

Store выполняет операции через общую функцию `run`: включает loading, очищает старую ошибку, вызывает сервис, а при исключении преобразует его через `classifyError`. Страница показывает понятное сообщение и кнопку повторной загрузки.

## Практики 1–11

1. **Quasar и основа проекта:** `quasar.config.ts`, `src/App.vue`, `src/pages/IndexPage.vue`.
2. **Vue-компоненты:** `src/components/TodoForm.vue`, `TodoItem.vue`, `TodoList.vue`; props и emits.
3. **Composition API:** `src/composables/`, реактивность, computed, watch, фильтры, поиск и сохранение.
4. **TypeScript:** `src/types/`, типизированные props/emits, модели API и Zod-схемы.
5. **Pinia:** `src/stores/todoStore.ts`, `userStore.ts`, `uiStore.ts`.
6. **Vue Router:** `src/router/`, layouts, meta-поля, guard, breadcrumbs, lazy loading и 404.
7. **Mock API:** `mock/server.cjs`, `mock/db.json`, REST CRUD и имитация JWT.
8. **Axios:** `src/services/apiClient.ts`, interceptors, refresh token, retry, timeout; кэш списка находится в `todoService.ts`.
9. **Формы и ошибки:** `useValidation.ts`, `validation.ts`, `errorHandling.ts`, `FormError.vue`.
10. **Тестирование:** папка `tests/`, конфигурация `vitest.config.ts`, coverage и CI.
11. **Production и деплой:** `.env.production`, `quasar.config.ts`, workflows в `.github/workflows/`, GitHub Pages.

## Частые вопросы преподавателя

**Почему компоненты не вызывают Axios напрямую?**  
Чтобы разделить ответственность. Компонент отвечает за отображение, store — за состояние, service — за источник данных. Благодаря этому backend можно заменить на `localStorage` без переделки UI.

**Зачем Pinia, если задач мало?**  
Pinia даёт единый источник состояния для разных страниц и компонентов, computed-геттеры, централизованные loading/error и удобное тестирование логики отдельно от интерфейса.

**Чем props отличаются от emits?**  
Props передают данные от родителя к ребёнку. Emits сообщают родителю о действии ребёнка. Например, `TodoItem` получает `todo` через prop и отправляет `toggle` с id.

**Почему используется computed?**  
`filteredTodos`, `activeCount`, `isAuthenticated` и `themeLabel` вычисляются из другого реактивного состояния и автоматически пересчитываются только при изменении зависимостей.

**Зачем нужен watch?**  
В `uiStore` watch применяет и сохраняет тему, а в `todoStore` сохраняет изменение массива задач. Это побочный эффект, поэтому для него подходит watch, а не computed.

**Почему на GitHub Pages отдельный режим данных?**  
GitHub Pages раздаёт только статические файлы и не запускает Node.js/`json-server`. Поэтому production-сервисы используют браузерное хранилище, а локальная учебная версия показывает настоящие HTTP-запросы.

**Как обеспечена типобезопасность?**  
Строгий TypeScript проверяет аргументы, ответы сервисов, состояние stores, props и emits. Zod дополняет его runtime-проверкой пользовательского ввода.

**Как проверить проект?**

```bash
npm run typecheck
npm test
npm run test:coverage
npm run build
```

