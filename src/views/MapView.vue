<template>
  <div class="map-view">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-inner">

        <!-- Search -->
        <div class="search-box">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="store.searchQuery"
            type="text"
            placeholder="팀명, 도시, 경기장 검색..."
            class="search-input"
          />
          <button v-if="store.searchQuery" @click="store.searchQuery = ''" class="clear-btn">✕</button>
        </div>

        <!-- League Filter Tabs -->
        <div class="league-tabs">
          <button
            v-for="(tab, i) in leagueTabs"
            :key="tab.value"
            class="league-tab"
            :class="[{ active: store.leagueFilter === tab.value }, `tab-${i}`]"
            @click="store.setLeagueFilter(tab.value)"
          >
            <span class="tab-dot" :style="{ background: tab.color }"></span>
            {{ tab.label }}
            <span class="tab-count">{{ tab.count }}</span>
          </button>
        </div>

        <!-- Stats bar -->
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-num">{{ store.filteredTeams.length }}</span>
            <span class="stat-label">노출 팀</span>
          </div>
          <div class="stat-div"></div>
          <div class="stat">
            <span class="stat-num">{{ store.favorites.length }}</span>
            <span class="stat-label">즐겨찾기</span>
          </div>
          <div class="stat-div"></div>
          <div class="stat">
            <span class="stat-num">{{ store.teams.length }}</span>
            <span class="stat-label">전체</span>
          </div>
        </div>

        <!-- Team list -->
        <div class="team-list">
          <template v-if="store.leagueFilter === 'all'">
            <div v-if="store.filteredTeams.some(t => t.league === 'K리그1')"
              class="list-section-header k1">K리그1</div>
            <div
              v-for="team in store.filteredTeams.filter(t => t.league === 'K리그1')"
              :key="team.id"
              class="team-card"
              :class="{ selected: store.selectedTeam?.id === team.id, 'my-team': store.isMyTeam(team.id) }"
              @click="selectAndFly(team)"
            >
              <div class="team-card-left">
                <div class="team-emoji">
                  <div v-if="team.emblemUrl">
                    <img :src="`${team.emblemUrl}`" :alt="`${team.teamName}`" />
                  </div>
                  <div v-else>
                    <span>{{ team.emoji }}</span>
                  </div>
                </div>
                <div class="team-info">
                  <div class="team-name">{{ team.teamName }}<span v-if="store.isMyTeam(team.id)" class="my-badge">MY</span></div>
                  <div class="team-stadium">{{ team.stadiumName }}</div>
                  <div class="team-city">📍 {{ team.city }}</div>
                </div>
              </div>
              <div class="team-card-actions">
                <button class="action-btn" :class="{ active: store.isFavorite(team.id) }" @click.stop="store.toggleFavorite(team.id)">★</button>
                <button class="action-btn my-btn" :class="{ active: store.isMyTeam(team.id) }" @click.stop="store.setMyTeam(team.id)">♥</button>
              </div>
            </div>

            <div v-if="store.filteredTeams.some(t => t.league === 'K리그2')"
              class="list-section-header k2">K리그2</div>
            <div
              v-for="team in store.filteredTeams.filter(t => t.league === 'K리그2')"
              :key="team.id"
              class="team-card k2-card"
              :class="{ selected: store.selectedTeam?.id === team.id, 'my-team': store.isMyTeam(team.id) }"
              @click="selectAndFly(team)"
            >
              <div class="team-card-left">
                <div class="team-emoji" :style="{ background: team.primaryColor + '22', border: '2px solid ' + team.primaryColor + '55' }">{{ team.emoji }}</div>
                <div class="team-info">
                  <div class="team-name">{{ team.teamName }}<span v-if="store.isMyTeam(team.id)" class="my-badge">MY</span></div>
                  <div class="team-stadium">{{ team.stadiumName }}</div>
                  <div class="team-city">📍 {{ team.city }}</div>
                </div>
              </div>
              <div class="team-card-actions">
                <button class="action-btn" :class="{ active: store.isFavorite(team.id) }" @click.stop="store.toggleFavorite(team.id)">★</button>
                <button class="action-btn my-btn" :class="{ active: store.isMyTeam(team.id) }" @click.stop="store.setMyTeam(team.id)">♥</button>
              </div>
            </div>
          </template>

          <template v-else>
            <div
              v-for="team in store.filteredTeams"
              :key="team.id"
              class="team-card"
              :class="{
                'k2-card': team.league === 'K리그2',
                selected: store.selectedTeam?.id === team.id,
                'my-team': store.isMyTeam(team.id)
              }"
              @click="selectAndFly(team)"
            >
              <div class="team-card-left">
                <div class="team-emoji">
                  <div v-if="team.emblemUrl">
                    <img :src="`${team.emblemUrl}`" :alt="`${team.teamName}`" />
                  </div>
                  <div v-else>
                    <span>{{ team.emoji }}</span>
                  </div>                  
                </div>
                <div class="team-info">
                  <div class="team-name">{{ team.teamName }}<span v-if="store.isMyTeam(team.id)" class="my-badge">MY</span></div>
                  <div class="team-stadium">{{ team.stadiumName }}</div>
                  <div class="team-city">📍 {{ team.city }}</div>
                </div>
              </div>
              <div class="team-card-actions">
                <button class="action-btn" :class="{ active: store.isFavorite(team.id) }" @click.stop="store.toggleFavorite(team.id)">★</button>
                <button class="action-btn my-btn" :class="{ active: store.isMyTeam(team.id) }" @click.stop="store.setMyTeam(team.id)">♥</button>
              </div>
            </div>
          </template>

          <div v-if="!store.filteredTeams.length" class="empty-state">
            <div class="empty-icon">🔍</div>
            <div>검색 결과가 없습니다</div>
          </div>
        </div>
      </div>

    </aside>

    <!-- Collapse toggle -->
    <button class="collapse-btn" :class="{ collapsed: sidebarCollapsed }" @click="sidebarCollapsed = !sidebarCollapsed">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        :style="{ transform: sidebarCollapsed ? 'rotate(180deg)' : '' }">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>

    <!-- Map -->
    <div class="map-container">
      <div id="map" ref="mapEl"></div>

      <!-- Selected team detail panel -->
      <transition name="slide-up">
        <div v-if="store.selectedTeam" class="team-detail-panel">
          <button class="close-panel" @click="closePanel()">✕</button>
          <div class="panel-header" :style="{ borderLeftColor: store.selectedTeam.primaryColor }">
            <div class="panel-icon" style="width:64px;">
                <div class="panel-img" v-if="store.selectedTeam.emblemUrl">
                  <div style="width:100%;">
                  <img :src="`${store.selectedTeam.emblemUrl}`" :alt="`${store.selectedTeam.teamName}`" />
                  </div>
                </div>
                <div class="panel-img" v-else>
                  {{ store.selectedTeam.emoji }}
                </div>
            </div>
            <div class="panel-title">
              <div class="panel-team-name">{{ store.selectedTeam.teamName }}</div>
              <div class="panel-stadium-name">{{ store.selectedTeam.stadiumName }}</div>
            </div>
            <div class="panel-badges">
              <span class="league-badge" :class="store.selectedTeam.league === 'K리그1' ? 'k1' : 'k2'">
                {{ store.selectedTeam.league }}
              </span>
              <span v-if="store.isMyTeam(store.selectedTeam.id)" class="my-team-tag">MY TEAM</span>
              <span v-if="store.isFavorite(store.selectedTeam.id)" class="fav-tag">★ 즐겨찾기</span>
            </div>
          </div>
          <div class="panel-grid">
            <div class="panel-item"><span class="panel-label">주소</span><span class="panel-value addr">{{ store.selectedTeam.address }}</span></div>
            <div class="panel-item"><span class="panel-label">수용 인원</span><span class="panel-value">{{ store.selectedTeam.capacity.toLocaleString() }}명</span></div>
            <div class="panel-item"><span class="panel-label">창단 연도</span><span class="panel-value">{{ store.selectedTeam.founded }}년</span></div>
            <div class="panel-item"><span class="panel-label">연고 도시</span><span class="panel-value">{{ store.selectedTeam.city }}</span></div>
          </div>
          <div class="panel-actions">
            <button class="panel-btn fav-btn" :class="{ active: store.isFavorite(store.selectedTeam.id) }" @click="store.toggleFavorite(store.selectedTeam.id)">
              {{ store.isFavorite(store.selectedTeam.id) ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기 추가' }}
            </button>
            <button class="panel-btn my-btn" :class="{ active: store.isMyTeam(store.selectedTeam.id) }" @click="store.setMyTeam(store.selectedTeam.id)">
              {{ store.isMyTeam(store.selectedTeam.id) ? '♥ 나의 구단 해제' : '♡ 나의 구단 설정' }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useKleagueStore } from '@/stores/kleague'
import type { LeagueFilter } from '@/stores/kleague'
import type { Stadium } from '@/types'

const store = useKleagueStore()
const mapEl = ref<HTMLElement | null>(null)
const sidebarCollapsed = ref(false)

// ── League tabs ──────────────────────────────────────────
const leagueTabs = computed(() => [
  { value: 'all'    as LeagueFilter, label: '전체',   color: '#4ade80', count: store.teams.length },
  { value: 'K리그1' as LeagueFilter, label: 'K리그1', color: '#3b82f6', count: store.kleague1Teams.length },
  { value: 'K리그2' as LeagueFilter, label: 'K리그2', color: '#f59e0b', count: store.kleague2Teams.length },
])

// ── Map ──────────────────────────────────────────────────
let map: L.Map | null = null
const markerMap = new Map<string, L.Marker>()

function createIcon(team: Stadium): L.DivIcon {
  const isMy       = store.isMyTeam(team.id)
  const isFav      = store.isFavorite(team.id)
  const isSelected = store.selectedTeam?.id === team.id
  const isK2       = team.league === 'K리그2'
  const isHidden   = store.leagueFilter !== 'all' && team.league !== store.leagueFilter

  const size   = isSelected ? 64 : isMy ? 48 : isK2 ? 38 : 52
  const border = isMy ? '#facc15' : isSelected ? '#4ade80' : isK2 ? '#f59e0b' : 'rgba(255,255,255,0.9)'
  const glow   = isMy
    ? '0px 0px 9px 5px rgba(250,204,21,0.45), 0 4px 18px rgba(0,0,0,0.65)'
    : isSelected
    ? '0 0 0 3px rgba(74,222,128,0.35), 0 4px 18px rgba(0,0,0,0.65)'
    : '0 3px 10px rgba(0,0,0,0.55)'
  const scale      = isSelected ? 1.2 : 1
  const opacity    = isHidden ? 0 : 0.85
  const pe         = isHidden ? 'none' : 'auto'
  const labelColor = isMy ? '#facc15' : isK2 ? '#fbbf24' : '#ffffff'
  const favStar    = isFav
    ? `<span style="position:absolute;top:-6px;right:-6px;font-size:11px;color:#facc15;text-shadow:0 0 4px rgba(0,0,0,0.9);line-height:1">★</span>`
    : ''
  const badgeClass = [isMy ? 'myteam' : '', isFav ? 'favorite' : ''].filter(Boolean).join(' ')

  const html = `
    <div class="team-icon-wrap ${badgeClass}" 
          style="display:flex;flex-direction:column;align-items:center;
                transform:scale(${scale});transform-origin:bottom center;
                opacity:${opacity};pointer-events:${pe};transition:opacity 0.2s,transform 0.15s;
                cursor:pointer;user-select:none;">
      <div style="position:relative;width:${size}px;height:${size}px;border-radius:50%;
               background:${team.primaryColor};border:2px solid ${border};
               box-shadow:${glow};display:flex;align-items:center;justify-content:center;
               font-size:${Math.round(size * 0.46)}px">
               <img src="${team.emblemUrl}" alt="${team.teamName}" style="width:calc(100% * 0.85);" />
        ${favStar}
      </div>
      <div style="margin-top:3px;background:rgba(10,25,35,0.88);color:${labelColor};
                  font-size:${isK2 ? '9px' : '10px'};font-weight:700;
                  padding:2px 6px;border-radius:4px;white-space:nowrap;
                  backdrop-filter:blur(4px);font-family:inherit;box-shadow:${glow};">
        ${team.shortName}
      </div>
    </div>`

  return L.divIcon({
    html,
    className: '',
    iconSize:   [64, 72],
    iconAnchor: [32, 72],
  })
}

// ── 한국 마스크 + 국경 녹색 테두리 ─────────────────────
function addKoreaMask() {
  if (!map) return

  const world: [number, number][] = [[-90,-180],[-90,180],[90,180],[90,-180],[-90,-180]]
  const korea: [number, number][] = [
    [37.70,124.60],[38.30,124.90],[38.62,125.40],[38.88,126.00],
    [38.85,126.80],[38.60,127.40],[38.30,128.00],[38.60,128.40],
    [38.32,128.70],[37.96,129.00],[37.50,129.40],[36.70,129.55],
    [35.99,129.60],[35.10,129.20],[34.88,128.70],[34.60,128.40],
    [34.30,127.60],[34.20,126.90],[34.40,126.30],[34.80,126.10],
    [35.20,125.90],[35.70,126.00],[36.20,125.80],[36.70,124.70],
    [37.20,124.50],[37.70,124.60],
  ]
  const jeju: [number, number][] = [
    [33.55,126.15],[33.55,126.60],[33.28,126.95],
    [33.13,126.55],[33.20,126.10],[33.45,125.95],[33.55,126.15],
  ]

  // 마스크 (한국 구멍)
  L.geoJSON({
    type: 'Feature', properties: {},
    geometry: { type: 'Polygon', coordinates: [world, korea, jeju] }
  } as any, {
    style: { fillColor: '#080e16', fillOpacity: 0.82, color: 'transparent', weight: 0 },
    interactive: false,
  }).addTo(map)

  // 녹색 국경선
  L.geoJSON({
    type: 'Feature', properties: {},
    geometry: { type: 'MultiPolygon', coordinates: [[korea], [jeju]] }
  } as any, {
    style: { fill: false, color: '#4ade80', weight: 2.5, opacity: 0.9 },
    interactive: false,
  }).addTo(map)
}

function initMap() {
  if (!mapEl.value) return

  const koreaBounds = L.latLngBounds(L.latLng(32.8, 124.3), L.latLng(39.0, 132.0))

  map = L.map(mapEl.value, {
    center:              [36.3, 127.8],
    zoom:                7,
    minZoom:             6,
    maxZoom:             17,
    zoomControl:         false,
    attributionControl:  true,
    maxBounds:           koreaBounds,
    maxBoundsViscosity:  1.0,
  })

  // CartoDB Dark Matter 타일 (무료, 인증 불필요)
  L.tileLayer('https://tiles.osm.kr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap 기여자</a>'
  }).addTo(map);

  addKoreaMask()

  L.control.zoom({ position: 'bottomright' }).addTo(map)

  store.teams.forEach(team => addMarker(team))
}

function addMarker(team: Stadium) {
  if (!map) return
  const marker = L.marker([team.lat, team.lng], {
    icon:        createIcon(team),
    zIndexOffset:    
       store.isMyTeam(team.id) ? 2000 :
       store.isFavorite(team.id) ? 1500 :  // 즐겨찾기 그 다음
      team.league === 'K리그1' ? 100 : 50,
  })
  marker.on('click', () => selectAndFly(team))
  marker.addTo(map)
  markerMap.set(team.id, marker)
}

function refreshMarkers() {
  markerMap.forEach((marker, id) => {
    const team = store.teams.find(t => t.id === id)
    if (team) {
      marker.setIcon(createIcon(team))
      marker.setZIndexOffset(
        store.isMyTeam(id)              ? 2000 :
        store.isFavorite(id)            ? 1500 :
        store.selectedTeam?.id === id   ?  500 :
        team.league === 'K리그1'        ?  100 :
                                            50
      )
    }
  })
}

function selectAndFly(team: Stadium) {
  store.selectTeam(team)
  map?.flyTo([team.lat, team.lng], 10, { duration: 0.8 })
}

function closePanel() {
  store.selectTeam(null)
  map?.flyTo([36.3, 127.8], 7, { duration: 0.8 })
}

// ── Watchers ─────────────────────────────────────────────
watch(() => store.selectedTeam,   () => nextTick(refreshMarkers))
watch(() => store.myTeam,         () => nextTick(refreshMarkers))
watch(() => [...store.favorites], () => nextTick(refreshMarkers))
watch(() => store.leagueFilter,   () => nextTick(refreshMarkers))

// ── Lifecycle ─────────────────────────────────────────────
onMounted(() => nextTick(initMap))
onUnmounted(() => { map?.remove(); map = null })
</script>

<style>
/* Leaflet 줌 버튼 커스텀 */
.leaflet-control-zoom {
  border: none !important;
  box-shadow: none !important;
}
.leaflet-control-zoom a {
  width: 32px !important; height: 32px !important; line-height: 32px !important;
  background: rgba(15,25,35,0.88) !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  color: #e8edf3 !important;
  border-radius: 8px !important;
  margin-bottom: 4px !important;
  display: block !important;
  font-size: 16px !important;
  text-align: center !important;
  text-decoration: none !important;
  backdrop-filter: blur(8px);
  transition: all 0.15s !important;
}
.leaflet-control-zoom a:hover {
  background: rgba(74,222,128,0.15) !important;
  border-color: rgba(74,222,128,0.35) !important;
  color: #4ade80 !important;
}
.leaflet-control-zoom-in  { border-radius: 8px 8px 0 0 !important; }
.leaflet-control-zoom-out { border-radius: 0 0 8px 8px !important; margin-bottom: 0 !important; }

/* 마커 펄스 애니메이션 */
@keyframes markerPulse {
  0%,100% { box-shadow: 0 0 0 3px rgba(250,204,21,0.45), 0 4px 18px rgba(0,0,0,0.65); border:2px solid rgba(255,255,255,0.9); border-radius:50%; }
  50%     { box-shadow: 0 0 0 7px rgba(250,204,21,0.15), 0 4px 18px rgba(0,0,0,0.65); border:2px solid rgba(255,255,255,0.9); border-radius:50%; }
}

/* 지도 배경 */
.leaflet-container { background: #080e16 !important; font-family: 'Pretendard Variable', 'Noto Sans KR', sans-serif !important; }

/* Attribution */
.leaflet-control-attribution {
  background: rgba(8,14,22,0.75) !important;
  color: rgba(255,255,255,0.4) !important;
  font-size: 10px !important;
}
.leaflet-control-attribution a { color: rgba(255,255,255,0.5) !important; }

/* 2. CSS filter — HOT 타일을 다크로 변환 */
.leaflet-tile-pane {
  filter: invert(100%) hue-rotate(180deg) brightness(0.88) saturate(0.65);
  opacity: .65;
}

.team-icon-wrap { opacity:0.76; }
.team-icon-wrap.myteam { opacity:1 !important; }


</style>

<style scoped>
.map-view { display: flex; height: 100%; overflow: hidden; }

/* ── Sidebar ──────────────────────────────────────────── */
.sidebar {
  width: 300px; min-width: 300px;
  background: var(--color-surface-2);
  border-right: 1px solid rgba(255,255,255,0.06);
  display: flex; flex-direction: column;
  transition: width 0.3s ease, min-width 0.3s ease;
  position: relative; overflow: visible; z-index: 10;
}
.sidebar.collapsed { width: 0; min-width: 0; overflow: hidden; }

/* 사이드바 닫혔을 때 버튼 위치 이동 */
.sidebar.collapsed ~ .collapse-btn {
  left: 14px;
}

.sidebar-inner { display: flex; flex-direction: column; height: 100%; overflow: hidden; width: 300px; }

.search-box {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); position: relative;
}
.search-icon { color: var(--color-text-muted); flex-shrink: 0; }
.search-input {
  flex: 1; background: var(--color-surface-3); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px; padding: 7px 10px; color: var(--color-text); font-size: 13px;
  font-family: inherit; outline: none; transition: border-color 0.15s;
}
.search-input::placeholder { color: var(--color-text-muted); }
.search-input:focus { border-color: var(--color-accent); }
.clear-btn { background: none; border: none; color: var(--color-text-muted); cursor: pointer; font-size: 12px; position: absolute; right: 22px; }

/* League tabs */
.league-tabs {
  display: flex; gap: 4px; padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.league-tab {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
  padding: 6px 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
  background: var(--color-surface-3); color: var(--color-text-muted);
  font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: inherit;
}
.league-tab:hover { border-color: rgba(255,255,255,0.18); color: var(--color-text); }
.league-tab.tab-0.active { background: rgba(74,222,128,0.10); border-color: rgba(74,222,128,0.35); color: #4ade80; }
.league-tab.tab-1.active { background: rgba(59,130,246,0.12); border-color: rgba(59,130,246,0.40); color: #60a5fa; }
.league-tab.tab-2.active { background: rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.40); color: #fbbf24; }
.tab-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.tab-count { font-size: 10px; background: rgba(255,255,255,0.08); padding: 1px 5px; border-radius: 8px; font-weight: 700; }

/* Stats */
.stats-bar {
  display: flex; align-items: center; justify-content: center;
  gap: 16px; padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.05);
}
.stat { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.stat-num { font-weight: 700; font-size: 16px; color: var(--color-accent); }
.stat-label { font-size: 10px; color: var(--color-text-muted); }
.stat-div { width: 1px; height: 24px; background: rgba(255,255,255,0.1); }

/* Team list */
.team-list { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 4px; }

.list-section-header {
  font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  padding: 8px 8px 4px; margin-top: 4px;
}
.list-section-header.k1 { color: #60a5fa; }
.list-section-header.k2 { color: #fbbf24; }

.team-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px; border-radius: 10px; cursor: pointer;
  transition: all 0.15s; border: 1px solid transparent;
}
.team-card:hover { background: var(--color-surface-3); }
.team-card.selected { background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.2); }
.team-card.my-team  { background: rgba(250,204,21,0.06); border-color: rgba(250,204,21,0.2); }
.team-card.k2-card  { opacity: 0.8; }
.team-card.k2-card:hover { opacity: 1; }

.team-card-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
.team-emoji { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.team-info { min-width: 0; }
.team-name { font-size: 13px; font-weight: 600; color: var(--color-text); display: flex; align-items: center; gap: 5px; }
.my-badge { font-size: 9px; font-weight: 700; background: var(--color-accent-2); color: #1a1a1a; padding: 1px 5px; border-radius: 3px; }
.team-stadium { font-size: 11px; color: var(--color-text-muted); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
.team-city { font-size: 10px; color: var(--color-text-muted); margin-top: 1px; }
.team-card-actions { display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
.action-btn { background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 3px 7px; font-size: 13px; cursor: pointer; color: var(--color-text-muted); transition: all 0.15s; line-height: 1; }
.action-btn:hover { background: var(--color-surface-3); color: var(--color-text); }
.action-btn.active { color: var(--color-accent-2); border-color: rgba(250,204,21,0.3); background: rgba(250,204,21,0.08); }
.action-btn.my-btn.active { color: #f87171; border-color: rgba(248,113,113,0.3); background: rgba(248,113,113,0.08); }

.empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 20px; color: var(--color-text-muted); font-size: 13px; }
.empty-icon { font-size: 32px; }

.collapse-btn {
  position: absolute;
  left: calc(300px - 14px); /* 사이드바 너비 기준 */
  top: 50%;
  transform: translateY(-50%);
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--color-surface-3); border: 1px solid rgba(255,255,255,0.1);
  color: var(--color-text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; transition: all 0.3s ease;  /* sidebar 애니메이션과 동일하게 */
}
.collapse-btn:hover { background: var(--color-surface-2); color: var(--color-text); }

/* ── Map ────────────────────────────────────────────────── */
.map-container { flex: 1; position: relative; overflow: hidden; }
#map { width: 100%; height: 100%; }

/* ── Detail panel ───────────────────────────────────────── */
.team-detail-panel {
  position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
  width: 480px; max-width: calc(100% - 40px);
  background: var(--color-surface-2); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px; padding: 20px; box-shadow: 0 16px 48px rgba(0,0,0,0.6);
  z-index: 1000; backdrop-filter: blur(12px);
}
.close-panel {
  position: absolute; top: 12px; right: 12px;
  background: var(--color-surface-3); border: none; color: var(--color-text-muted);
  width: 28px; height: 28px; border-radius: 50%;
  cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.15s;
}
.close-panel:hover { background: rgba(255,255,255,0.1); color: var(--color-text); }

.panel-header { display: flex; align-items: center; gap: 14px; padding-left: 12px; border-left: 4px solid; margin-bottom: 16px; }
.panel-emoji { font-size: 32px; }
.panel-title { flex: 1; }
.panel-team-name { font-size: 16px; font-weight: 400; color: var(--color-text); font-family: 'Black Han Sans', sans-serif; }
.panel-stadium-name { font-size: 12px; color: var(--color-text-muted); margin-top: 2px; }
.panel-badges { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; }
.league-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
.league-badge.k1 { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
.league-badge.k2 { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
.my-team-tag { font-size: 10px; font-weight: 700; background: rgba(250,204,21,0.15); color: var(--color-accent-2); border: 1px solid rgba(250,204,21,0.3); padding: 2px 8px; border-radius: 10px; }
.fav-tag { font-size: 10px; background: rgba(74,222,128,0.1); color: var(--color-accent); border: 1px solid rgba(74,222,128,0.2); padding: 2px 8px; border-radius: 10px; }

.panel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
.panel-item { display: flex; flex-direction: column; gap: 3px; background: var(--color-surface-3); border-radius: 8px; padding: 10px 12px; }
.panel-item:first-child { grid-column: 1 / -1; }
.panel-label { font-size: 10px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.panel-value { font-size: 13px; color: var(--color-text); font-weight: 500; }
.panel-value.addr { font-size: 12px; line-height: 1.5; }

.panel-actions { display: flex; gap: 8px; }
.panel-btn { flex: 1; padding: 9px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.1); background: var(--color-surface-3); color: var(--color-text-muted); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; font-family: inherit; }
.panel-btn:hover { border-color: rgba(255,255,255,0.2); color: var(--color-text); }
.panel-btn.fav-btn.active { background: rgba(250,204,21,0.1); border-color: rgba(250,204,21,0.3); color: var(--color-accent-2); }
.panel-btn.my-btn.active  { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.3); color: #f87171; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }



</style>
