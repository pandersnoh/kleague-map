<template>
  <div class="map-view">

    <!-- Nav (사이드바 — 데스크탑/모바일 분리 처리는 Nav.vue 내부에서) -->
    <Nav
      :isOpen="sidebarOpen"
      @close="sidebarOpen = false"
      @select="onTeamSelect"
    />

    <!-- 데스크탑 사이드바 토글 버튼 -->
    <button
      v-if="!isMobile"
      class="collapse-btn"
      :class="{ collapsed: !sidebarOpen }"
      @click="sidebarOpen = !sidebarOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        :style="{ transform: sidebarOpen ? '' : 'rotate(180deg)' }">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>

    <!-- 지도 -->
    <div class="map-container">
      <div id="map" ref="mapEl" />

      <!-- 팀 상세 패널 -->
      <transition name="slide-up">
        <div v-if="store.selectedTeam" class="team-detail-panel">
          <button class="close-panel" @click="closePanel">✕</button>
            <div class="panel-badges">
              <span class="league-badge" :class="store.selectedTeam.league === 'K리그1' ? 'k1' : 'k2'">
                {{ store.selectedTeam.league }}
              </span>
              <span v-if="store.isMyTeam(store.selectedTeam.id)" class="my-team-tag">MY TEAM</span>
              <span v-if="store.isFavorite(store.selectedTeam.id)" class="fav-tag">★ 즐겨찾기</span>
            </div>          
          <div class="panel-header" :style="{ borderLeftColor: store.selectedTeam.primaryColor }">
            <div class="panel-icon">
              <img v-if="store.selectedTeam.emblemUrl"
                :src="store.selectedTeam.emblemUrl" :alt="store.selectedTeam.teamName" />
              <span v-else>{{ store.selectedTeam.emoji }}</span>
            </div>
            <div class="panel-title">
              <div class="panel-team-name">{{ store.selectedTeam.teamName }}</div>
              <div class="panel-stadium-name">{{ store.selectedTeam.stadiumName }}</div>
            </div>
          </div>          
          <div class="panel-grid">
            <div class="panel-item">
              <span class="panel-label">주소</span>
              <span class="panel-value addr">{{ store.selectedTeam.address }}</span>
            </div>
            <div class="panel-item">
              <span class="panel-label">수용 인원</span>
              <span class="panel-value">{{ store.selectedTeam.capacity.toLocaleString() }}명</span>
            </div>
            <div class="panel-item">
              <span class="panel-label">창단 연도</span>
              <span class="panel-value">{{ store.selectedTeam.founded }}년</span>
            </div>
            <div class="panel-item">
              <span class="panel-label">연고 도시</span>
              <span class="panel-value">{{ store.selectedTeam.city }}</span>
            </div>
          </div>
          <div class="panel-actions">
            <button class="panel-btn fav-btn"
              :class="{ active: store.isFavorite(store.selectedTeam.id) }"
              @click="store.toggleFavorite(store.selectedTeam.id)">
              {{ store.isFavorite(store.selectedTeam.id) ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기 추가' }}
            </button>
            <button class="panel-btn my-btn"
              :class="{ active: store.isMyTeam(store.selectedTeam.id) }"
              @click="store.setMyTeam(store.selectedTeam.id)">
              {{ store.isMyTeam(store.selectedTeam.id) ? '♥ 나의 구단 해제' : '♡ 나의 구단 설정' }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useKleagueStore } from '@/stores/kleague'
import type { Stadium } from '@/types'
import Nav from '@/components/nav/Nav.vue'

const props = defineProps<{ mobileSidebarOpen?: boolean }>()
const emit  = defineEmits(['toggleSidebar'])

const store  = useKleagueStore()
const mapEl  = ref<HTMLElement | null>(null)

const isMobile    = ref(window.innerWidth <= 768)
const sidebarOpen = ref(!isMobile.value)

function onResize() {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) sidebarOpen.value = true
}
window.addEventListener('resize', onResize)

watch(() => props.mobileSidebarOpen, (val) => {
  if (isMobile.value && val !== undefined) sidebarOpen.value = val
})

// ── Map ──────────────────────────────────────────────────
let map: L.Map | null = null
const markerMap = new Map<string, L.Marker>()

function createIcon(team: Stadium): L.DivIcon {
  const isMy        = store.isMyTeam(team.id)
  const isFav       = store.isFavorite(team.id)
  const isSelected  = store.selectedTeam?.id === team.id
  const isK2        = team.league === 'K리그2'
  const isHidden    = store.leagueFilter !== 'all' && team.league !== store.leagueFilter
  const hasPriority = store.myTeam !== null || store.favorites.length > 0
  const isDimmed    = hasPriority && !isMy && !isFav

  const size        = isSelected ? 64 : isMy ? 56 : isK2 ? 40 : 52
  const border      = isMy ? '#facc15' : isSelected ? '#4ade80' : isK2 ? '#f59e0b' : 'rgba(255,255,255,0.9)'
  const glow        = isMy
    ? '0px 0px 9px 5px rgba(250,204,21,0.45), 0 4px 18px rgba(0,0,0,0.65)'
    : isSelected
    ? '0 0 0 3px rgba(74,222,128,0.35), 0 4px 18px rgba(0,0,0,0.65)'
    : '0 3px 10px rgba(0,0,0,0.55)'
  const opacity     = isHidden ? 0 : isDimmed ? 0.75 : 1
  const pe          = isHidden ? 'none' : 'auto'
  const scale       = isSelected ? 1.15 : 1
  const labelColor  = isMy ? '#facc15' : isK2 ? '#fbbf24' : '#ffffff'
  const badgeClass  = [isMy ? 'myteam' : '', isFav ? 'favorite' : ''].filter(Boolean).join(' ')
  const favStar     = isFav
    ? `<span style="position:absolute;top:-6px;right:-6px;font-size:11px;color:#facc15;text-shadow:0 0 4px rgba(0,0,0,0.9);line-height:1">★</span>`
    : ''
  const touchSize   = Math.max(size + 10, 44)
  const emblem      = team.emblemUrl
    ? `<img src="${team.emblemUrl}" alt="${team.teamName}" style="width:85%;height:85%;object-fit:contain;" />`
    : `<span style="font-size:${Math.round(size * 0.42)}px">${team.emoji}</span>`

  const html = `
    <div class="team-icon-wrap ${badgeClass}"
      style="display:flex;flex-direction:column;align-items:center;
             transform:scale(${scale});transform-origin:bottom center;
             opacity:${opacity};pointer-events:${pe};
             transition:opacity 0.2s,transform 0.15s;cursor:pointer;user-select:none;">
      <div style="position:relative;width:${touchSize}px;height:${touchSize}px;border-radius:50%;
               background:${team.primaryColor};border:2px solid ${border};
               box-shadow:${glow};display:flex;align-items:center;justify-content:center;overflow:hidden;">
        ${emblem}${favStar}
      </div>
      <div style="margin-top:3px;background:rgba(10,25,35,0.88);color:${labelColor};
                  font-size:${isK2 ? '9px' : '10px'};font-weight:700;
                  padding:2px 6px;border-radius:4px;white-space:nowrap;
                  backdrop-filter:blur(4px);font-family:inherit;">
        ${team.shortName}
      </div>
    </div>`

  return L.divIcon({
    html,
    className: '',
    iconSize:   [touchSize, touchSize + 18],
    iconAnchor: [touchSize / 2, touchSize + 18],
  })
}

function addKoreaMask() {
  if (!map) return
  const world: [number,number][] = [[-90,-180],[-90,180],[90,180],[90,-180],[-90,-180]]
  const korea: [number,number][] = [
    [37.70,124.60],[38.30,124.90],[38.62,125.40],[38.88,126.00],[38.85,126.80],
    [38.60,127.40],[38.30,128.00],[38.60,128.40],[38.32,128.70],[37.96,129.00],
    [37.50,129.40],[36.70,129.55],[35.99,129.60],[35.10,129.20],[34.88,128.70],
    [34.60,128.40],[34.30,127.60],[34.20,126.90],[34.40,126.30],[34.80,126.10],
    [35.20,125.90],[35.70,126.00],[36.20,125.80],[36.70,124.70],[37.20,124.50],[37.70,124.60],
  ]
  const jeju: [number,number][] = [
    [33.55,126.15],[33.55,126.60],[33.28,126.95],[33.13,126.55],[33.20,126.10],[33.45,125.95],[33.55,126.15],
  ]
  L.geoJSON({ type:'Feature', properties:{}, geometry:{ type:'Polygon', coordinates:[world,korea,jeju] } } as any,
    { style:{ fillColor:'#080e16', fillOpacity:0.82, color:'transparent', weight:0 }, interactive:false }
  ).addTo(map)
  L.geoJSON({ type:'Feature', properties:{}, geometry:{ type:'MultiPolygon', coordinates:[[korea],[jeju]] } } as any,
    { style:{ fill:false, color:'#4ade80', weight:2.5, opacity:0.9 }, interactive:false }
  ).addTo(map)
}

function initMap() {
  if (!mapEl.value) return
  const koreaBounds = L.latLngBounds(L.latLng(32.5, 123.5), L.latLng(39.2, 132.5))
  map = L.map(mapEl.value, {
    center: [36.3, 127.9], zoom: 7, minZoom: 6, maxZoom: 17,
    zoomControl: false, attributionControl: true,
    maxBounds: koreaBounds, maxBoundsViscosity: 1.0,
    tapTolerance: 30, touchZoom: true, bounceAtZoomLimits: false,
  })
  L.tileLayer('https://tiles.osm.kr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap 기여자</a>',
  }).addTo(map)
  addKoreaMask()
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  store.teams.forEach(team => addMarker(team))
}

function addMarker(team: Stadium) {
  if (!map) return
  const marker = L.marker([team.lat, team.lng], {
    icon: createIcon(team),
    zIndexOffset:
      store.isMyTeam(team.id)   ? 1500 :
      store.isFavorite(team.id) ? 2000 :
      team.league === 'K리그1'  ?  100 : 50,
  })
  marker.on('click', () => selectAndFly(team))
  marker.addTo(map)
  markerMap.set(team.id, marker)
}

function refreshMarkers() {
  markerMap.forEach((marker, id) => {
    const team = store.teams.find(t => t.id === id)
    if (!team) return
    marker.setIcon(createIcon(team))
    marker.setZIndexOffset(
      store.isMyTeam(id)            ? 2000 :
      store.isFavorite(id)          ? 1500 :
      store.selectedTeam?.id === id ?  500 :
      team.league === 'K리그1'      ?  100 : 50
    )
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

function onTeamSelect(team: Stadium) {
  selectAndFly(team)
}

watch(() => store.selectedTeam,   () => nextTick(refreshMarkers))
watch(() => store.myTeam,         () => nextTick(refreshMarkers))
watch(() => [...store.favorites], () => nextTick(refreshMarkers))
watch(() => store.leagueFilter,   () => nextTick(refreshMarkers))

onMounted(() => nextTick(initMap))
onUnmounted(() => { window.removeEventListener('resize', onResize); map?.remove(); map = null })
</script>

<style>
.leaflet-control-zoom { border: none !important; box-shadow: none !important; }
.leaflet-control-zoom a {
  display: block !important; width: 36px !important; height: 36px !important;
  line-height: 36px !important; margin-bottom: 4px !important;
  background: rgba(15,25,35,0.9) !important; border: 1px solid rgba(255,255,255,0.12) !important;
  color: #e8edf3 !important; border-radius: 8px !important;
  font-size: 18px !important; text-align: center !important; text-decoration: none !important;
  backdrop-filter: blur(8px); transition: all 0.15s !important;
}
.leaflet-control-zoom a:hover {
  background: rgba(74,222,128,0.15) !important; border-color: rgba(74,222,128,0.35) !important; color: #4ade80 !important;
}
.leaflet-control-zoom-in  { border-radius: 8px 8px 0 0 !important; }
.leaflet-control-zoom-out { border-radius: 0 0 8px 8px !important; margin-bottom: 0 !important; }

@keyframes markerPulse {
  0%,100% { box-shadow: 0 0 0 3px rgba(250,204,21,0.45), 0 4px 18px rgba(0,0,0,0.65); }
  50%     { box-shadow: 0 0 0 7px rgba(250,204,21,0.15), 0 4px 18px rgba(0,0,0,0.65); }
}
.team-icon-wrap { opacity: 0.76; }
.team-icon-wrap.myteam { opacity: 1 !important; }

.leaflet-container { background: #080e16 !important; font-family: 'Pretendard Variable','Noto Sans KR',sans-serif !important; }
.leaflet-tile-pane { filter: invert(100%) hue-rotate(180deg) brightness(0.55) saturate(0.65); }
.leaflet-control-attribution { background: rgba(8,14,22,0.75) !important; color: rgba(255,255,255,0.4) !important; font-size: 10px !important; }
.leaflet-control-attribution a { color: rgba(255,255,255,0.5) !important; }
</style>

<style scoped>
.map-view { display: flex; height: 100%; overflow: hidden; position: relative; }

.collapse-btn {
  position: absolute; left: 300px; top: 50%; transform: translate(-50%, -50%);
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--color-surface-3); border: 1px solid rgba(255,255,255,0.1);
  color: var(--color-text-muted); cursor: pointer; z-index: 20;
  display: flex; align-items: center; justify-content: center;
  transition: left 0.3s ease, background 0.15s;
}
.collapse-btn.collapsed { left: 0; }
.collapse-btn:hover { background: var(--color-surface-2); color: var(--color-text); }

.map-container { flex: 1; position: relative; overflow: hidden; min-width: 0; }
#map { width: 100%; height: 100%; }

.team-detail-panel {
  position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
  width: 480px; max-width: calc(100% - 32px);
  background: var(--color-surface-2); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px; padding: 12px 20px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.6); z-index: 1000; backdrop-filter: blur(12px);
}
.close-panel {
  position: absolute; top: 12px; right: 12px;
  background: var(--color-surface-3); border: none; color: var(--color-text-muted);
  width: 28px; height: 28px; border-radius: 50%;
  cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.15s;
}
.close-panel:hover { background: rgba(255,255,255,0.1); color: var(--color-text); }

.panel-header { display: flex; align-items: center; gap: 14px; padding-left: 12px; border-left: 4px solid; margin-top:12px; }
.panel-icon { width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--color-surface-3); font-size: 28px; }
.panel-icon img { width: 85%; height: 85%; object-fit: contain; }
.panel-title { flex: 1; }
.panel-team-name { font-size: 16px; font-weight: 700; color: var(--color-text); font-family: 'Black Han Sans', sans-serif; }
.panel-stadium-name { font-size: 12px; color: var(--color-text-muted); margin-top: 2px; }
.league-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
.league-badge.k1 { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
.league-badge.k2 { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
.my-team-tag { font-size: 10px; font-weight: 700; background: rgba(250,204,21,0.15); color: var(--color-accent-2); border: 1px solid rgba(250,204,21,0.3); padding: 2px 8px; border-radius: 10px; }
.fav-tag { font-size: 10px; background: rgba(74,222,128,0.1); color: var(--color-accent); border: 1px solid rgba(74,222,128,0.2); padding: 2px 8px; border-radius: 10px; }

.panel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
.panel-item { display: flex; flex-direction: column; gap: 3px; background: var(--color-surface-3); border-radius: 8px; padding: 10px 12px; }
.panel-item:first-child { grid-column: 1 / -1; }
.panel-label { font-size: 10px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.panel-value { font-size: 13px; color: var(--color-text); font-weight: 500; }
.panel-value.addr { font-size: 12px; line-height: 1.5; }

.panel-actions { display: flex; gap: 8px; margin-top:12px; }
.panel-btn { flex: 1; padding: 9px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.1); background: var(--color-surface-3); color: var(--color-text-muted); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; font-family: inherit; }
.panel-btn:hover { border-color: rgba(255,255,255,0.2); color: var(--color-text); }
.panel-btn.fav-btn.active { background: rgba(250,204,21,0.1); border-color: rgba(250,204,21,0.3); color: var(--color-accent-2); }
.panel-btn.my-btn.active  { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.3); color: #f87171; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }

@media (max-width: 768px) {
  .team-detail-panel { bottom: 12px; padding: 14px; }
}
</style>
