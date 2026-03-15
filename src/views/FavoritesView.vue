<template>
  <div class="fav-view">
    <div class="fav-container">
      <div class="fav-header">
        <h1 class="fav-title">
          <span class="title-star">★</span>
          즐겨찾기 경기장
        </h1>
        <div class="fav-count">{{ store.favorites.length }}개</div>
      </div>

      <div v-if="store.myTeamData" class="my-team-section">
        <div class="section-label">🏆 나의 구단</div>
        <div class="my-team-card" :style="{ borderColor: store.myTeamData.primaryColor + '55' }">
          <div class="mt-emoji" :style="{ background: store.myTeamData.primaryColor }">
            {{ store.myTeamData.emoji }}
          </div>
          <div class="mt-info">
            <div class="mt-name">{{ store.myTeamData.teamName }}</div>
            <div class="mt-stadium">{{ store.myTeamData.stadiumName }}</div>
            <div class="mt-addr">{{ store.myTeamData.address }}</div>
          </div>
          <button class="unset-btn" @click="store.setMyTeam(store.myTeamData!.id)">해제</button>
        </div>
      </div>

      <div v-if="store.favoriteTeams.length" class="favorites-grid">
        <div class="section-label">즐겨찾기 목록</div>
        <div
          v-for="team in store.favoriteTeams"
          :key="team.id"
          class="fav-card"
          :style="{ '--team-color': team.primaryColor }"
        >
          <div class="fav-card-top">
            <div class="fav-emoji" :style="{ background: team.primaryColor + '22', border: '2px solid ' + team.primaryColor + '44' }">
              {{ team.emoji }}
            </div>
            <div class="fav-info">
              <div class="fav-name">{{ team.teamName }}</div>
              <div class="fav-league">K리그1</div>
            </div>
            <button class="fav-remove" @click="store.toggleFavorite(team.id)">✕</button>
          </div>
          <div class="fav-detail">
            <div class="fav-stadium-name">{{ team.stadiumName }}</div>
            <div class="fav-addr">{{ team.address }}</div>
            <div class="fav-meta">
              <span>👥 {{ team.capacity.toLocaleString() }}명</span>
              <span>📅 창단 {{ team.founded }}년</span>
              <span>📍 {{ team.city }}</span>
            </div>
          </div>
          <div class="fav-actions">
            <router-link :to="`/?team=${team.id}`" class="fav-map-btn" @click="goToMap(team.id)">
              🗺 지도에서 보기
            </router-link>
            <button
              class="fav-my-btn"
              :class="{ active: store.isMyTeam(team.id) }"
              @click="store.setMyTeam(team.id)"
            >
              {{ store.isMyTeam(team.id) ? '♥ MY' : '♡ 나의 구단' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-fav">
        <div class="empty-illustration">☆</div>
        <div class="empty-title">즐겨찾기가 없습니다</div>
        <div class="empty-desc">지도에서 팀 카드의 ★ 버튼을 눌러 즐겨찾기에 추가해보세요</div>
        <router-link to="/" class="go-map-btn">지도로 이동 →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useKleagueStore } from '@/stores/kleague'

const store = useKleagueStore()
const router = useRouter()

function goToMap(teamId: string) {
  const team = store.teams.find(t => t.id === teamId)
  if (team) store.selectTeam(team)
  router.push('/')
}
</script>

<style scoped>
.fav-view {
  height: 100%;
  overflow-y: auto;
  padding: 24px;
}

.fav-container {
  max-width: 800px;
  margin: 0 auto;
}

.fav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.fav-title {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 24px;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.title-star {
  color: var(--color-accent-2);
}

.fav-count {
  background: var(--color-surface-3);
  color: var(--color-text-muted);
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 20px;
}

.section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

.my-team-section {
  margin-bottom: 32px;
}

.my-team-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(250,204,21,0.08), rgba(250,204,21,0.03));
  border: 1px solid;
  border-radius: 14px;
}

.mt-emoji {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
}

.mt-info {
  flex: 1;
}

.mt-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
}

.mt-stadium {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.mt-addr {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 3px;
}

.unset-btn {
  background: var(--color-surface-3);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--color-text-muted);
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.unset-btn:hover {
  color: var(--color-text);
  background: rgba(255,255,255,0.1);
}

.favorites-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fav-card {
  background: var(--color-surface-2);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 16px 18px;
  transition: border-color 0.15s;
}

.fav-card:hover {
  border-color: rgba(255,255,255,0.12);
}

.fav-card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.fav-emoji {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.fav-info {
  flex: 1;
}

.fav-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
}

.fav-league {
  font-size: 11px;
  color: var(--color-accent);
  margin-top: 2px;
}

.fav-remove {
  background: none;
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--color-text-muted);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.fav-remove:hover {
  background: rgba(255,100,100,0.1);
  border-color: rgba(255,100,100,0.3);
  color: #f87171;
}

.fav-detail {
  padding: 12px;
  background: var(--color-surface-3);
  border-radius: 8px;
  margin-bottom: 12px;
}

.fav-stadium-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.fav-addr {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
  line-height: 1.5;
}

.fav-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.fav-meta span {
  font-size: 11px;
  color: var(--color-text-muted);
}

.fav-actions {
  display: flex;
  gap: 8px;
}

.fav-map-btn {
  flex: 2;
  padding: 8px;
  text-align: center;
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 8px;
  color: var(--color-accent);
  font-size: 13px;
  text-decoration: none;
  transition: all 0.15s;
}

.fav-map-btn:hover {
  background: rgba(74, 222, 128, 0.14);
}

.fav-my-btn {
  flex: 1;
  padding: 8px;
  background: var(--color-surface-3);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.fav-my-btn:hover {
  border-color: rgba(255,255,255,0.2);
  color: var(--color-text);
}

.fav-my-btn.active {
  background: rgba(248, 113, 113, 0.1);
  border-color: rgba(248, 113, 113, 0.3);
  color: #f87171;
}

/* Empty state */
.empty-fav {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  gap: 12px;
}

.empty-illustration {
  font-size: 60px;
  line-height: 1;
  color: var(--color-text-muted);
  opacity: 0.4;
  margin-bottom: 8px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
}

.empty-desc {
  font-size: 13px;
  color: var(--color-text-muted);
  max-width: 280px;
  line-height: 1.6;
}

.go-map-btn {
  margin-top: 8px;
  padding: 10px 24px;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 24px;
  color: var(--color-accent);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
}

.go-map-btn:hover {
  background: rgba(74, 222, 128, 0.18);
}
</style>
