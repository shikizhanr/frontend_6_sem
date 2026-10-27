<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-9 col-lg-7">
      <BreadcrumbNav class="q-mb-lg" />
      <div class="row items-center justify-between q-mb-md">
        <div>
          <h1 class="text-h4 text-weight-medium q-my-none">Задачи</h1>
          <div class="text-subtitle2 text-grey-7 q-mt-xs">Осталось выполнить: {{ todoStore.activeCount }}</div>
        </div>
        <q-btn color="primary" flat round icon="refresh" :loading="todoStore.isLoading" aria-label="Обновить задачи" @click="load(true)" />
      </div>

      <q-card flat bordered class="q-mb-lg">
        <q-card-section><TodoForm :loading="todoStore.isLoading" @add="add" /></q-card-section>
      </q-card>

      <div class="row q-col-gutter-md items-center q-mb-md">
        <div class="col-12 col-sm">
          <q-input :model-value="todoStore.search" outlined dense clearable label="Поиск" debounce="150" @update:model-value="todoStore.setSearch(String($event ?? ''))">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <div class="col-12 col-sm-auto">
          <q-btn-toggle :model-value="todoStore.filter" unelevated toggle-color="primary" :options="filterOptions" @update:model-value="todoStore.setFilter($event)" />
        </div>
      </div>

      <q-linear-progress v-if="todoStore.isLoading" indeterminate color="primary" class="q-mb-sm" />
      <q-banner v-if="todoStore.error" rounded class="bg-red-1 text-negative q-mb-md">
        {{ todoStore.error.message }}
        <template #action><q-btn flat color="negative" label="Повторить" @click="load(true)" /></template>
      </q-banner>
      <TodoList :todos="todoStore.filteredTodos" :empty-message="emptyMessage" @toggle="toggle" @delete="remove" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import TodoForm from '../components/TodoForm.vue'
import TodoList from '../components/TodoList.vue'
import { useTodoStore } from '../stores/todoStore'
import type { TodoFilter } from '../types'

defineOptions({ name: 'IndexPage' })
const $q = useQuasar()
const todoStore = useTodoStore()
const filterOptions: Array<{ label: string; value: TodoFilter }> = [
  { label: 'Все', value: 'all' }, { label: 'Активные', value: 'active' }, { label: 'Готовые', value: 'completed' }
]
const emptyMessage = computed(() => todoStore.todos.length ? 'По выбранным условиям ничего не найдено.' : 'Задач пока нет. Добавьте первую задачу.')

async function load(force = false): Promise<void> { try { await todoStore.fetchTodos(force) } catch { /* error is rendered from store */ } }
async function add(title: string): Promise<void> { try { await todoStore.addTodo(title); $q.notify({ type: 'positive', message: 'Задача добавлена' }) } catch { /* store handles error */ } }
async function toggle(id: number): Promise<void> { try { await todoStore.toggleTodo(id) } catch { /* store handles error */ } }
function remove(id: number): void {
  $q.dialog({ title: 'Удалить задачу?', message: 'Это действие нельзя отменить.', cancel: true, persistent: true })
    .onOk(() => { void todoStore.deleteTodo(id).then(() => $q.notify({ type: 'positive', message: 'Задача удалена' })).catch(() => undefined) })
}
onMounted(() => { void load() })
</script>
