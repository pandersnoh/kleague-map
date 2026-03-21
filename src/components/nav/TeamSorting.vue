<template>
  <div class="league-tabs">
    <button
      v-for="(tab, i) in leagueTabs"
      :key="tab.value"
      class="league-tab"
      :class="[{ active: store.leagueFilter === tab.value }, `tab-${i}`]"
      @click="store.setLeagueFilter(tab.value)"
    >
      <span class="tab-dot" :style="{ background: tab.color }" />
      {{ tab.label }}
      <span class="tab-count">{{ tab.count }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useKleagueStore } from '@/stores/kleague'
import type { LeagueFilter } from '@/stores/kleague'

const store = useKleagueStore()

const leagueTabs = computed(() => [
  { value: 'all'    as LeagueFilter, label: '전체',   color: '#4ade80', count: store.teams.length },
  { value: 'K리그1' as LeagueFilter, label: 'K리그1', color: '#3b82f6', count: store.kleague1Teams.length },
  { value: 'K리그2' as LeagueFilter, label: 'K리그2', color: '#f59e0b', count: store.kleague2Teams.length },
])
</script>

<style scoped>
.league-tabs {
  display: flex;
  gap: 4px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  flex-shrink: 0;
}
.league-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px 4px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: var(--color-surface-3);
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.league-tab:hover { border-color: rgba(255,255,255,0.18); color: var(--color-text); }
.league-tab.tab-0.active { background: rgba(74,222,128,0.10); border-color: rgba(74,222,128,0.35); color: #4ade80; }
.league-tab.tab-1.active { background: rgba(59,130,246,0.12); border-color: rgba(59,130,246,0.40); color: #60a5fa; }
.league-tab.tab-2.active { background: rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.40); color: #fbbf24; }
.tab-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.tab-count {
  font-size: 10px;
  background: rgba(255,255,255,0.08);
  padding: 1px 5px;
  border-radius: 8px;
  font-weight: 700;
}
</style>
