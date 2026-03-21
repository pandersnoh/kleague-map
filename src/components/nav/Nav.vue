<template>
  <!-- 모바일 딤 오버레이 -->
  <div
    v-if="isMobile && isOpen"
    class="sidebar-overlay"
    @click="emit('close')"
  />

  <!-- 데스크탑 사이드바 (v-if로 flex 레이아웃에서 완전 분리) -->
  <aside
    v-if="!isMobile"
    class="sidebar sidebar--desktop"
    :class="{ 'sidebar--collapsed': !isOpen }"
  >
    <TeamSearch />
    <TeamSorting />
    <TeamCount />
    <TeamList @select="emit('select', $event)" />
  </aside>

  <!-- 모바일 Bottom Sheet (position:fixed — flex 레이아웃 영향 없음) -->
  <aside
    v-if="isMobile"
    class="sidebar sidebar--mobile"
    :class="{ 'sidebar--open': isOpen }"
  >
    <!-- 핸들 -->
    <div class="sidebar-handle">
      <span class="handle-bar" />
      <button class="handle-close" @click="emit('close')">✕</button>
    </div>
    <TeamSearch />
    <TeamSorting />
    <TeamCount />
    <TeamList @select="onMobileSelect($event)" />
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Stadium } from '@/types'
import TeamSearch  from '@/components/nav/TeamSearch.vue'
import TeamSorting from '@/components/nav/TeamSorting.vue'
import TeamCount   from '@/components/nav/TeamCount.vue'
import TeamList    from '@/components/nav/TeamList.vue'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{
  close:  []
  select: [team: Stadium]
}>()

const isMobile = ref(window.innerWidth <= 768)

function onResize() { isMobile.value = window.innerWidth <= 768 }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

function onMobileSelect(team: Stadium) {
  emit('select', team)
  emit('close') // 모바일에서 팀 선택 시 자동 닫기
}
</script>

<style scoped>
/* 딤 오버레이 */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(2px);
}

/* 공통 사이드바 */
.sidebar {
  display: flex;
  flex-direction: column;
  z-index: 160;
}

/* ── 데스크탑 ── */
.sidebar--desktop {
  position: relative;
  width: 300px;
  min-width: 300px;
  height: 100%;
  background: var(--color-surface-2);
  border-right: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  transition: width 0.3s ease, min-width 0.3s ease;
}
.sidebar--desktop.sidebar--collapsed {
  width: 0;
  min-width: 0;
  overflow: hidden;
}

/* ── 모바일 Bottom Sheet ── */
.sidebar--mobile {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  width: 100%;
  min-width: unset;
  height: 45dvh;
  background: #1a2535 !important;
  border-radius: 20px 20px 0 0;
  border-top: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  z-index: 500;
}
.sidebar--mobile.sidebar--open {
  transform: translateY(0);
}

/* 모바일 핸들 */
.sidebar-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 8px 0 4px;
  flex-shrink: 0;
}
.handle-bar {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255,255,255,0.2);
}
.handle-close {
  position: absolute;
  right: 12px;
  top: 6px;
  background: var(--color-surface-3);
  border: none;
  color: var(--color-text-muted);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.handle-close:hover { background: rgba(255,255,255,0.1); color: var(--color-text); }
</style>
