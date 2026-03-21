<template>
  <Layout ref="layout">
    <template #default="{ mobileSidebarOpen }">
      <router-view
        :mobileSidebarOpen="mobileSidebarOpen"
        @toggleSidebar="layout?.toggleMobileSidebar()"
      />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'

const layout = ref<InstanceType<typeof Layout> | null>(null)
</script>
