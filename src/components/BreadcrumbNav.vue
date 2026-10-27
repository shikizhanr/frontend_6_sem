<template>
  <q-breadcrumbs class="text-grey-7" active-color="primary">
    <q-breadcrumbs-el label="Главная" icon="home" to="/" />
    <q-breadcrumbs-el v-if="route.path !== '/'" :label="route.meta.breadcrumb" />
  </q-breadcrumbs>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
defineOptions({ name: 'BreadcrumbNav' })
const route = useRoute()
</script>
