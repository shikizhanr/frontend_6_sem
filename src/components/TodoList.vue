<template>
  <div>
    <q-banner v-if="!todos.length" rounded class="empty-state q-pa-xl text-center">
      <q-icon name="task_alt" size="48px" class="q-mb-sm text-primary" />
      <div>{{ emptyMessage }}</div>
    </q-banner>
    <q-list v-else class="todo-list q-gutter-sm" tag="ul">
      <transition-group enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" @toggle="emit('toggle', $event)" @delete="emit('delete', $event)" />
      </transition-group>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import TodoItem from './TodoItem.vue'
import type { ITodoItem } from '../types'

defineOptions({ name: 'TodoList' })
withDefaults(defineProps<{ todos: ITodoItem[]; emptyMessage?: string }>(), { emptyMessage: 'Задач пока нет. Добавьте первую задачу.' })
const emit = defineEmits<{ toggle: [id: number]; delete: [id: number] }>()
</script>
