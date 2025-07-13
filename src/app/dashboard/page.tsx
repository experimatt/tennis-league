import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import LogoutButton from "./logout-button"

export default async function Dashboard() {
  const session = await getServerSession()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tennis League Dashboard
              </h1>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Welcome, {session.user?.name || session.user?.email}!
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-900">Players</h3>
                  <p className="text-3xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-blue-700">Total registered players</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-green-900">Matches</h3>
                  <p className="text-3xl font-bold text-green-600">0</p>
                  <p className="text-sm text-green-700">Matches played</p>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-yellow-900">League</h3>
                  <p className="text-lg font-bold text-yellow-600">2025 Demo League</p>
                  <p className="text-sm text-yellow-700">Active league</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 