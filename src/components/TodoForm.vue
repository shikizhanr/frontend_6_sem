<template>
  <q-form class="row q-col-gutter-sm items-start" @submit.prevent="submit">
    <div class="col">
      <q-input
        v-model="title"
        outlined
        clearable
        maxlength="120"
        label="Новая задача"
        :rules="[validateTodoTitle]"
        lazy-rules
        autocomplete="off"
        aria-label="Название новой задачи"
      >
        <template #prepend><q-icon name="add_task" /></template>
      </q-input>
    </div>
    <div class="col-auto">
      <q-btn type="submit" color="primary" icon="add" label="Добавить" :loading="loading" :disable="!title.trim()" class="q-py-sm" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { validateTodoTitle } from '../utils/validation'

defineOptions({ name: 'TodoForm' })
defineProps<{ loading?: boolean }>()
const emit = defineEmits<{ add: [title: string] }>()
const title = ref('')

function submit(): void {
  const normalized = title.value.trim().replace(/\s+/g, ' ')
  if (validateTodoTitle(normalized) !== true) return
  emit('add', normalized)
  title.value = ''
}
</script>
