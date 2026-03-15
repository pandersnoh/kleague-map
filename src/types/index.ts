export interface Stadium {
  id: string
  teamName: string
  stadiumName: string
  city: string
  address: string
  lat: number
  lng: number
  capacity: number
  primaryColor: string
  secondaryColor: string
  emblemUrl: string
  founded: number
  league: 'K리그1' | 'K리그2'
  website: string
  shortName: string
  emoji: string
}

export interface AppState {
  myTeam: string | null
  favorites: string[]
  searchQuery: string
  selectedStadium: Stadium | null
}
