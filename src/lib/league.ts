import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

export async function getDefaultLeague() {
  try {
    const leagues = await prisma.league.findMany({
      orderBy: { createdAt: 'desc' }
    })

    if (leagues.length === 0) {
      throw new Error('No leagues found')
    }

    // If there's only one league, return it
    if (leagues.length === 1) {
      return leagues[0]
    }

    // If there are multiple leagues, return the first active one
    const activeLeague = leagues.find(league => league.status === 'active')
    if (activeLeague) {
      return activeLeague
    }

    // Otherwise, return the most recent one
    return leagues[0]
  } catch (error) {
    console.error('Error getting default league:', error)
    throw error
  }
}

export async function getDefaultLeagueUrl() {
  try {
    const defaultLeague = await getDefaultLeague()
    return `/leagues/${defaultLeague.id}`
  } catch (error) {
    console.error('Error getting default league URL:', error)
    return '/'
  }
}

export async function getLeagueById(id: string) {
  try {
    const league = await prisma.league.findUnique({
      where: { id }
    })

    if (!league) {
      throw new Error(`League with id ${id} not found`)
    }

    return league
  } catch (error) {
    console.error('Error getting league by ID:', error)
    throw error
  }
} 