<template>
  <q-item :class="['todo-item', { 'todo-item--completed': todo.completed }]" tag="li">
    <q-item-section side>
      <q-checkbox :model-value="todo.completed" :aria-label="`Изменить статус: ${todo.title}`" @update:model-value="emit('toggle', todo.id)" />
    </q-item-section>
    <q-item-section>
      <q-item-label :class="todo.completed ? 'text-strike' : ''">{{ todo.title }}</q-item-label>
      <q-item-label caption class="q-mt-xs"><q-icon name="calendar_today" size="13px" /> Создано {{ formattedDate }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn flat round dense color="negative" icon="delete_outline" :aria-label="`Удалить: ${todo.title}`" @click="emit('delete', todo.id)">
        <q-tooltip>Удалить</q-tooltip>
      </q-btn>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ITodoItem } from '../types'

defineOptions({ name: 'TodoItem' })
const props = defineProps<{ todo: ITodoItem }>()
const emit = defineEmits<{ toggle: [id: number]; delete: [id: number] }>()
const formattedDate = computed(() => new Intl.DateTimeFormat('ru-RU').format(new Date(props.todo.createdAt)))
</script>
