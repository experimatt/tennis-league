import { getDefaultLeague } from "@/lib/league"

export default async function Dashboard() {
  // Get the default league dynamically
  let defaultLeague
  try {
    defaultLeague = await getDefaultLeague()
  } catch (error) {
    console.error("Error fetching default league:", error)
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Tennis League Dashboard
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Here&apos;s what&apos;s happening in your tennis league
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900">Players</h3>
                <p className="text-3xl font-bold text-blue-600">5</p>
                <p className="text-sm text-blue-700">Registered players</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-green-900">Matches</h3>
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-green-700">Matches played</p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-900">League</h3>
                <p className="text-lg font-bold text-yellow-600">
                  {defaultLeague ? defaultLeague.name : "No league found"}
                </p>
                <p className="text-sm text-yellow-700">Active league</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 