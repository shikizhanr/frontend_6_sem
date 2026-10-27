<template>
  <div>
    <q-banner v-if="!todos.length" rounded class="bg-grey-2 text-grey-8 q-pa-lg text-center">
      <q-icon name="task_alt" size="lg" class="q-mb-sm" />
      <div>{{ emptyMessage }}</div>
    </q-banner>
    <q-list v-else bordered separator class="rounded-borders" tag="ul">
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
