<template>
  <div v-if="message" class="text-negative text-caption q-mt-xs" role="alert">
    <q-icon name="error_outline" size="xs" class="q-mr-xs" />{{ message }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'FormError' })
defineProps<{ message?: string }>()
</script>
