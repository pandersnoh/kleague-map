<template>
  <div class="app-shell">
    <!-- Top Nav -->
    <nav class="topnav">
      <div class="topnav-left">
        <span class="logo">
          <span class="logo-k">K</span>리그 경기장 맵
        </span>
      </div>
      <div class="topnav-right">
        <router-link to="/" class="nav-btn" :class="{ active: route.name === 'map' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
          지도
        </router-link>
        <router-link to="/favorites" class="nav-btn" :class="{ active: route.name === 'favorites' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          즐겨찾기
          <span v-if="store.favorites.length" class="badge">{{ store.favorites.length }}</span>
        </router-link>
        <div v-if="store.myTeamData" class="my-team-chip">
          <span>{{ store.myTeamData.emoji }}</span>
          <span>{{ store.myTeamData.shortName }}</span>
        </div>
      </div>
    </nav>

    <!-- Main -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useKleagueStore } from '@/stores/kleague'

const route = useRoute()
const store = useKleagueStore()
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-surface);
}

.topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 52px;
  background: var(--color-surface-2);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
  z-index: 100;
}

.topnav-left, .topnav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 18px;
  color: var(--color-text);
  letter-spacing: -0.5px;
}

.logo-k {
  color: var(--color-accent);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all 0.15s;
  position: relative;
}

.nav-btn:hover {
  background: var(--color-surface-3);
  color: var(--color-text);
}

.nav-btn.active {
  background: rgba(74, 222, 128, 0.12);
  color: var(--color-accent);
}

.badge {
  background: var(--color-accent-2);
  color: #1a1a1a;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.my-team-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: linear-gradient(135deg, rgba(250, 204, 21, 0.15), rgba(250, 204, 21, 0.05));
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-accent-2);
}

.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}
</style>
