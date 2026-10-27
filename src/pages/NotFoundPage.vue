<template>
  <q-page class="flex flex-center q-pa-md text-center">
    <div>
      <div class="text-h1 text-weight-bold text-primary">404</div>
      <div class="text-h5 q-mb-lg">Страница не найдена</div>
      <q-btn color="primary" icon="home" label="На главную" to="/" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
defineOptions({ name: 'NotFoundPage' })
</script>
