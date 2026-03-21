<template>
  <div class="search-box">
    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <input
      v-model="store.searchQuery"
      type="text"
      placeholder="팀명, 도시, 경기장 검색..."
      class="search-input"
    />
    <button v-if="store.searchQuery" class="clear-btn" @click="store.searchQuery = ''">✕</button>
  </div>
</template>

<script setup lang="ts">
import { useKleagueStore } from '@/stores/kleague'
const store = useKleagueStore()
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  position: relative;
  flex-shrink: 0;
}
.search-icon { color: var(--color-text-muted); flex-shrink: 0; }
.search-input {
  flex: 1;
  background: var(--color-surface-3);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 7px 10px;
  color: var(--color-text);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}
.search-input::placeholder { color: var(--color-text-muted); }
.search-input:focus { border-color: var(--color-accent); }
.clear-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 12px;
  position: absolute;
  right: 22px;
  padding: 2px 4px;
}
</style>
