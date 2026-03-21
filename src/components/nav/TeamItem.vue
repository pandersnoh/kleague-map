<template>
  <div
    class="team-card"
    :class="{
      'k2-card':  team.league === 'K리그2',
      selected:   store.selectedTeam?.id === team.id,
      'my-team':  store.isMyTeam(team.id),
    }"
    @click="emit('select', team)"
  >
    <div class="team-card-left">
      <!-- 엠블럼 이미지 or 이모지 -->
      <div class="team-emblem">
        <img v-if="team.emblemUrl" :src="team.emblemUrl" :alt="team.teamName" />
        <span v-else>{{ team.emoji }}</span>
      </div>

      <div class="team-info">
        <div class="team-name">
          {{ team.teamName }}
          <span v-if="store.isMyTeam(team.id)" class="my-badge">MY</span>
        </div>
        <div class="team-stadium">{{ team.stadiumName }}</div>
        <div class="team-city">📍 {{ team.city }}</div>
      </div>
    </div>

    <div class="team-card-actions">
      <button
        class="action-btn"
        :class="{ active: store.isFavorite(team.id) }"
        title="즐겨찾기"
        @click.stop="store.toggleFavorite(team.id)"
      >★</button>
      <button
        class="action-btn my-btn"
        :class="{ active: store.isMyTeam(team.id) }"
        title="나의 구단"
        @click.stop="store.setMyTeam(team.id)"
      >♥</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKleagueStore } from '@/stores/kleague'
import type { Stadium } from '@/types'

defineProps<{ team: Stadium }>()
const emit = defineEmits<{ select: [team: Stadium] }>()
const store = useKleagueStore()
</script>

<style scoped>
.team-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
}
.team-card:hover  { background: var(--color-surface-3); }
.team-card.selected { background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.2); }
.team-card.my-team  { background: rgba(250,204,21,0.06); border-color: rgba(250,204,21,0.2); }
.team-card.k2-card  { opacity: 0.8; }
.team-card.k2-card:hover { opacity: 1; }

.team-card-left { display: flex; align-items: center; gap: 10px; min-width: 0; }

.team-emblem {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--color-surface-3);
}
.team-emblem img { width: 85%; height: 85%; object-fit: contain; }

.team-info { min-width: 0; }
.team-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 5px;
}
.my-badge {
  font-size: 9px;
  font-weight: 700;
  background: var(--color-accent-2);
  color: #1a1a1a;
  padding: 1px 5px;
  border-radius: 3px;
}
.team-stadium {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}
.team-city { font-size: 10px; color: var(--color-text-muted); margin-top: 1px; }

.team-card-actions { display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
.action-btn {
  background: none;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  padding: 3px 7px;
  font-size: 13px;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all 0.15s;
  line-height: 1;
}
.action-btn:hover { background: var(--color-surface-3); color: var(--color-text); }
.action-btn.active { color: var(--color-accent-2); border-color: rgba(250,204,21,0.3); background: rgba(250,204,21,0.08); }
.action-btn.my-btn.active { color: #f87171; border-color: rgba(248,113,113,0.3); background: rgba(248,113,113,0.08); }
</style>
