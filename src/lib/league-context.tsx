'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { League } from '../generated/prisma'

interface LeagueContextType {
  currentLeague: League | null
  setCurrentLeague: (league: League | null) => void
  isLoading: boolean
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined)

export function LeagueProvider({ children }: { children: React.ReactNode }) {
  const [currentLeague, setCurrentLeague] = useState<League | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // This will be called when the component mounts
    // We can fetch the default league here or get it from the URL
    const fetchDefaultLeague = async () => {
      try {
        // We'll get the league from the URL or fetch the default one
        // For now, we'll let the parent component set it
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching default league:', error)
        setIsLoading(false)
      }
    }

    fetchDefaultLeague()
  }, [])

  return (
    <LeagueContext.Provider value={{ currentLeague, setCurrentLeague, isLoading }}>
      {children}
    </LeagueContext.Provider>
  )
}

export function useLeague() {
  const context = useContext(LeagueContext)
  if (context === undefined) {
    throw new Error('useLeague must be used within a LeagueProvider')
  }
  return context
}

export function useCurrentLeague() {
  const { currentLeague } = useLeague()
  return currentLeague
} 