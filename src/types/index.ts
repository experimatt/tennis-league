// Database entity types (based on Prisma schema)
export interface Player {
  id: string
  name: string
  email: string | null
  phone?: string | null
  username?: string | null
  location?: string | null
  rating?: string | null
  group?: string | null
  createdAt?: Date
}

export interface League {
  id: string
  name: string
  description?: string | null
  adminId?: string | null
  status?: string
  createdAt?: Date
}

export interface Match {
  id: string
  leagueId: string
  player1Id: string
  player2Id: string
  winnerId: string
  datePlayed: Date
  createdAt: Date
  createdBy: string
}

export interface Set {
  id: string
  matchId: string
  setNumber: number
  player1Games: number
  player2Games: number
  createdAt: Date
}

// Form data types
export interface SetFormData {
  player1Games: number
  player2Games: number
}

export interface MatchSubmission {
  leagueId: string
  player1Id: string
  player2Id: string
  winnerId: string
  datePlayed: string
  sets: SetFormData[]
}

// Context types
export interface LeagueContextType {
  currentLeague: League | null
  setCurrentLeague: (league: League | null) => void
  isLoading: boolean
}

// Component props types
export interface MatchReportFormProps {
  players: Player[]
  leagueId: string
  leagueSlug: string
}

// Page props types - generic reusable interface
export interface PageProps<T extends Record<string, string> = Record<string, string>> {
  params: Promise<T>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

// Specific page props
export type LeaguePageProps = PageProps<{ leagueId: string }>
export type ScoreEntryPageProps = PageProps<{ leagueId: string }>

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface MatchSubmissionResponse {
  success: boolean
  match?: {
    id: string
    player1Id: string
    player2Id: string
    winnerId: string
    datePlayed: Date
    sets: Set[]
  }
  error?: string
}

// Auth types
export interface Credentials {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthToken {
  sub?: string
  role?: string
  [key: string]: unknown
}

export interface AuthSession {
  user: AuthUser
  [key: string]: unknown
} 