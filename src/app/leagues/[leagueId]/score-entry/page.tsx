import Link from "next/link"
import { getLeagueById } from "@/lib/league"
import { notFound } from "next/navigation"
import MatchReportForm from "./match-report-form"
import { PrismaClient } from "@/generated/prisma"
import { ScoreEntryPageProps } from "@/types"

const prisma = new PrismaClient()

export default async function ScoreEntryPage({ params }: ScoreEntryPageProps) {
  const { leagueId } = await params
  
  try {
    // Get league data using dynamic function
    const league = await getLeagueById(leagueId)

    if (!league) {
      notFound()
    }

    // Get all players for the dropdowns
    const players = await prisma.player.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <nav className="flex items-center space-x-2 text-sm">
                    <Link 
                      href={`/leagues/${leagueId}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {league.name}
                    </Link>
                    <span className="text-gray-500">/</span>
                    <span className="text-gray-900">Score Entry</span>
                  </nav>
                  <h1 className="text-3xl font-bold text-gray-900 mt-2">
                    Submit Match Score
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Enter the results of your match below
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <MatchReportForm 
                players={players} 
                leagueId={league.id}
                leagueSlug={leagueId}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching league or players:", error)
    notFound()
  }
} 