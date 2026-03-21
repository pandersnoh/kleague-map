<template>
  <div class="app-shell">
    <AppHeader
      :mobileSidebarOpen="mobileSidebarOpen"
      @toggleSidebar="toggleMobileSidebar"
    />
    <main class="main-content">
      <slot :mobileSidebarOpen="mobileSidebarOpen" @toggleSidebar="toggleMobileSidebar" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/Header.vue'

const mobileSidebarOpen = ref(false)

function toggleMobileSidebar() {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

defineExpose({ mobileSidebarOpen, toggleMobileSidebar })
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: var(--color-surface);
}

.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}
</style>
