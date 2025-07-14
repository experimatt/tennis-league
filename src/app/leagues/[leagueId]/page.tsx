import Link from "next/link"
import { getLeagueById } from "@/lib/league"
import { notFound } from "next/navigation"
import { PrismaClient } from "@/generated/prisma"
import { LeaguePageProps } from "@/types"

const prisma = new PrismaClient()

export default async function LeaguePage({ params }: LeaguePageProps) {
  const { leagueId } = await params
  
  try {
    // Get league data using the dynamic function
    const league = await getLeagueById(leagueId)
    
    // Get match count for the league
    const matchCount = await prisma.match.count({
      where: {
        leagueId: leagueId
      }
    })
  
    if (!league) {
      notFound()
    }

    // Get some basic stats
    const playersCount = await prisma.player.count()
    const matchesCount = matchCount

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {league.name}
              </h1>
              <p className="mt-2 text-gray-600">
                {league.description}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Rankings */}
            <Link 
              href={`/leagues/${leagueId}/rankings`}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">🏆</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Rankings</h3>
                    <p className="text-sm text-gray-500">Current standings</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Matches */}
            <Link 
              href={`/leagues/${leagueId}/matches`}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">⚾</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Matches</h3>
                    <p className="text-sm text-gray-500">{matchesCount} total matches</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Players */}
            <Link 
              href={`/leagues/${leagueId}/players`}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Players</h3>
                    <p className="text-sm text-gray-500">{playersCount} players</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Score Entry */}
            <Link 
              href={`/leagues/${leagueId}/score-entry`}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📝</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Submit Score</h3>
                    <p className="text-sm text-gray-500">Report match results</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading league:', error)
    notFound()
  }
} 