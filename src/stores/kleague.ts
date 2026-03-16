import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Stadium } from '@/types'
import { allTeams } from '@/data/teams'

export type LeagueFilter = 'all' | 'K리그1' | 'K리그2'

export const useKleagueStore = defineStore('kleague', () => {
  // State
  const teams = ref<Stadium[]>(allTeams)
  const selectedTeam = ref<Stadium | null>(null)
  const myTeam = ref<string | null>(localStorage.getItem('myTeam'))
  const favorites = ref<string[]>(JSON.parse(localStorage.getItem('favorites') || '[]'))
  const searchQuery = ref('')
  const leagueFilter = ref<LeagueFilter>('all')

  // Getters
  const filteredTeams = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    return teams.value.filter(t => {
      const matchLeague = leagueFilter.value === 'all' || t.league === leagueFilter.value
      const matchQuery =
        !q ||
        t.teamName.includes(q) ||
        t.shortName.includes(q) ||
        t.city.includes(q) ||
        t.stadiumName.includes(q)
      return matchLeague && matchQuery
    })
  })

  const myTeamData = computed(() =>
    myTeam.value ? teams.value.find(t => t.id === myTeam.value) ?? null : null
  )

  const favoriteTeams = computed(() =>
    teams.value.filter(t => favorites.value.includes(t.id))
  )

  const kleague1Teams = computed(() => teams.value.filter(t => t.league === 'K리그1'))
  const kleague2Teams = computed(() => teams.value.filter(t => t.league === 'K리그2'))

  // Actions
  function selectTeam(team: Stadium | null) {
    selectedTeam.value = team
  }

  function setMyTeam(teamId: string) {
    if (myTeam.value === teamId) {
      myTeam.value = null
      localStorage.removeItem('myTeam')
    } else {
      myTeam.value = teamId
      localStorage.setItem('myTeam', teamId)
    }
  }

  function toggleFavorite(teamId: string) {
    const idx = favorites.value.indexOf(teamId)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push(teamId)
    }
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  function isFavorite(teamId: string) {
    return favorites.value.includes(teamId)
  }

  function isMyTeam(teamId: string) {
    return myTeam.value === teamId
  }

  function setLeagueFilter(filter: LeagueFilter) {
    leagueFilter.value = filter
  }

  return {
    teams,
    selectedTeam,
    myTeam,
    favorites,
    searchQuery,
    leagueFilter,
    filteredTeams,
    myTeamData,
    favoriteTeams,
    kleague1Teams,
    kleague2Teams,
    selectTeam,
    setMyTeam,
    toggleFavorite,
    isFavorite,
    isMyTeam,
    setLeagueFilter
  }
})
