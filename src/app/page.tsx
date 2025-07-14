import Link from "next/link"
import { getDefaultLeagueUrl } from "@/lib/league"

export default async function Home() {
  const defaultLeagueUrl = await getDefaultLeagueUrl()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Tennis League Manager
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Manage your tennis league with ease. Track players, matches, and standings all in one place.
            </p>

            <div className="mt-10 flex justify-center space-x-6">
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Admin Login
              </Link>
              <Link
                href={defaultLeagueUrl}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View League
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Player Management</h3>
                <p className="mt-2 text-gray-600">
                  Add, edit, and manage players in your league
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Match Scoring</h3>
                <p className="mt-2 text-gray-600">
                  Easy score entry with set-by-set tracking
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Leaderboards</h3>
                <p className="mt-2 text-gray-600">
                  Real-time standings and player statistics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
