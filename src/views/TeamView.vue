<template>
  <div class="team-view">
    <div v-if="team" class="team-page">
      <router-link to="/" class="back-btn">← 지도로 돌아가기</router-link>
      <div class="team-hero" :style="{ background: `linear-gradient(135deg, ${team.primaryColor}22, ${team.secondaryColor}11)`, borderColor: team.primaryColor + '33' }">
        <div class="hero-emoji">{{ team.emoji }}</div>
        <div class="hero-info">
          <h1 class="hero-name">{{ team.teamName }}</h1>
          <div class="hero-meta">창단 {{ team.founded }}년 · K리그1 · {{ team.city }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useKleagueStore } from '@/stores/kleague'

const route = useRoute()
const store = useKleagueStore()
const team = computed(() => store.teams.find(t => t.id === route.params.id))
</script>

<style scoped>
.team-view { padding: 24px; }
.back-btn { color: var(--color-accent); text-decoration: none; font-size: 13px; }
.team-hero {
  display: flex; align-items: center; gap: 20px;
  padding: 24px; border: 1px solid; border-radius: 16px; margin-top: 16px;
}
.hero-emoji { font-size: 48px; }
.hero-name { font-family: 'Black Han Sans', sans-serif; font-size: 24px; margin: 0 0 6px; }
.hero-meta { color: var(--color-text-muted); font-size: 13px; }
</style>
