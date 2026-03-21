<template>
  <div class="stats-bar">
    <div class="stat">
      <span class="stat-num">{{ store.filteredTeams.length }}</span>
      <span class="stat-label">노출 팀</span>
    </div>
    <div class="stat-div" />
    <div class="stat">
      <span class="stat-num">{{ store.favorites.length }}</span>
      <span class="stat-label">즐겨찾기</span>
    </div>
    <div class="stat-div" />
    <div class="stat">
      <span class="stat-num">{{ store.teams.length }}</span>
      <span class="stat-label">전체</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKleagueStore } from '@/stores/kleague'
const store = useKleagueStore()
</script>

<style scoped>
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  flex-shrink: 0;
}
.stat { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.stat-num { font-weight: 700; font-size: 16px; color: var(--color-accent); }
.stat-label { font-size: 10px; color: var(--color-text-muted); }
.stat-div { width: 1px; height: 24px; background: rgba(255,255,255,0.1); }
</style>
