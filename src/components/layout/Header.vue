<template>
  <nav class="topnav">
    <div class="topnav-left">
      <!-- Logo -->
      <span class="logo">
        <span class="logo-k">K</span>리그 경기장 맵
      </span>

      <!-- Breadcrumb (데스크탑) -->
      <div class="breadcrumb">
        <span class="breadcrumb-sep">/</span>
        <router-link to="/" class="breadcrumb-item" :class="{ active: route.name === 'map' }">지도</router-link>
        <template v-if="route.name === 'favorites'">
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-item active">즐겨찾기</span>
        </template>
        <template v-if="store.selectedTeam">
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-item active">{{ store.selectedTeam.shortName }}</span>
        </template>
      </div>

      <!-- 모바일 구단 목록 토글 버튼 -->
      <button
        v-if="route.name === 'map'"
        class="mobile-menu-btn"
        :class="{ active: mobileSidebarOpen }"
        @click="emit('toggleSidebar')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        구단 목록
      </button>
    </div>

    <div class="topnav-right">
      <router-link to="/" class="nav-btn" :class="{ active: route.name === 'map' }">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 11l19-9-9 19-2-8-8-2z"/>
        </svg>
        <span class="nav-label">지도</span>
      </router-link>

      <router-link to="/favorites" class="nav-btn" :class="{ active: route.name === 'favorites' }">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
          fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
        <span class="nav-label">즐겨찾기</span>
        <span v-if="store.favorites.length" class="badge">{{ store.favorites.length }}</span>
      </router-link>

      <div v-if="store.myTeamData" class="my-team-chip">
        <span>{{ store.myTeamData.emoji }}</span>
        <span class="chip-label">{{ store.myTeamData.shortName }}</span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useKleagueStore } from '@/stores/kleague'

defineProps<{ mobileSidebarOpen: boolean }>()
const emit = defineEmits<{ toggleSidebar: [] }>()

const route = useRoute()
const store = useKleagueStore()
</script>

<style scoped>
.topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 52px;
  background: var(--color-surface-2);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
  z-index: 200;
  gap: 8px;
}

.topnav-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.topnav-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.logo {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 17px;
  color: var(--color-text);
  letter-spacing: -0.5px;
  white-space: nowrap;
  flex-shrink: 0;
}
.logo-k { color: var(--color-accent); }

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}
.breadcrumb-sep { color: rgba(255,255,255,0.2); font-size: 13px; }
.breadcrumb-item {
  font-size: 12px;
  color: var(--color-text-muted);
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  transition: color 0.15s;
}
.breadcrumb-item:hover { color: var(--color-text); }
.breadcrumb-item.active { color: var(--color-accent); font-weight: 600; }

/* Mobile menu button */
.mobile-menu-btn {
  display: none;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.12);
  background: var(--color-surface-3);
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}
.mobile-menu-btn:hover,
.mobile-menu-btn.active {
  background: rgba(74,222,128,0.1);
  border-color: rgba(74,222,128,0.3);
  color: var(--color-accent);
}

/* Nav buttons */
.nav-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all 0.15s;
  white-space: nowrap;
}
.nav-btn:hover { background: var(--color-surface-3); color: var(--color-text); }
.nav-btn.active { background: rgba(74,222,128,0.12); color: var(--color-accent); }

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
  background: linear-gradient(135deg, rgba(250,204,21,0.15), rgba(250,204,21,0.05));
  border: 1px solid rgba(250,204,21,0.3);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-accent-2);
}

/* ── 모바일 반응형 ─────────────────────────────────────── */
@media (max-width: 768px) {
  .topnav { padding: 0 12px; }
  .logo { font-size: 15px; }
  .breadcrumb { display: none; }
  .mobile-menu-btn { display: flex; }
  .nav-label { display: none; }
  .nav-btn { padding: 6px 8px; }
  .chip-label { display: none; }
  .my-team-chip { padding: 4px 7px; }
}
</style>
