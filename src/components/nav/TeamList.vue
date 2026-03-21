<template>
  <div class="team-list">
    <!-- 전체 보기: K리그1 / K리그2 섹션 분리 -->
    <template v-if="store.leagueFilter === 'all'">
      <div
        v-if="store.filteredTeams.some(t => t.league === 'K리그1')"
        class="list-section-header k1"
      >K리그1</div>
      <TeamItem
        v-for="team in store.filteredTeams.filter(t => t.league === 'K리그1')"
        :key="team.id"
        :team="team"
        @select="emit('select', $event)"
      />

      <div
        v-if="store.filteredTeams.some(t => t.league === 'K리그2')"
        class="list-section-header k2"
      >K리그2</div>
      <TeamItem
        v-for="team in store.filteredTeams.filter(t => t.league === 'K리그2')"
        :key="team.id"
        :team="team"
        @select="emit('select', $event)"
      />
    </template>

    <!-- 단일 리그 필터 -->
    <template v-else>
      <TeamItem
        v-for="team in store.filteredTeams"
        :key="team.id"
        :team="team"
        @select="emit('select', $event)"
      />
    </template>

    <!-- 검색 결과 없음 -->
    <div v-if="!store.filteredTeams.length" class="empty-state">
      <div class="empty-icon">🔍</div>
      <div>검색 결과가 없습니다</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKleagueStore } from '@/stores/kleague'
import type { Stadium } from '@/types'
import TeamItem from '@/components/nav/TeamItem.vue'

const store = useKleagueStore()
const emit = defineEmits<{ select: [team: Stadium] }>()
</script>

<style scoped>
.team-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-section-header {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 8px 8px 4px;
  margin-top: 4px;
}
.list-section-header.k1 { color: #60a5fa; }
.list-section-header.k2 { color: #fbbf24; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
  color: var(--color-text-muted);
  font-size: 13px;
}
.empty-icon { font-size: 32px; }
</style>
