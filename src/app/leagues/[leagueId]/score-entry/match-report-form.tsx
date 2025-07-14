"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Player {
  id: string
  name: string
  email: string | null
}

interface Set {
  player1Games: number
  player2Games: number
}

interface MatchReportFormProps {
  players: Player[]
  leagueId: string
  leagueSlug: string
}

export default function MatchReportForm({ players, leagueId, leagueSlug }: MatchReportFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  // Form state
  const [player1Id, setPlayer1Id] = useState("")
  const [player2Id, setPlayer2Id] = useState("")
  const [datePlayed, setDatePlayed] = useState(new Date().toISOString().split('T')[0])
  const [sets, setSets] = useState<Set[]>([
    { player1Games: 0, player2Games: 0 }
  ])

  const addSet = () => {
    setSets([...sets, { player1Games: 0, player2Games: 0 }])
  }

  const removeSet = (index: number) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index))
    }
  }

  const updateSet = (index: number, field: 'player1Games' | 'player2Games', value: number) => {
    const updatedSets = sets.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    )
    setSets(updatedSets)
  }

  // Calculate winner based on sets won
  const calculateWinner = () => {
    const player1SetsWon = sets.filter(set => set.player1Games > set.player2Games).length
    const player2SetsWon = sets.filter(set => set.player2Games > set.player1Games).length
    
    if (player1SetsWon > player2SetsWon) return player1Id
    if (player2SetsWon > player1SetsWon) return player2Id
    return null // Tie or incomplete
  }

  const validateForm = () => {
    if (!player1Id || !player2Id) {
      setError("Please select both players")
      return false
    }
    
    if (player1Id === player2Id) {
      setError("Please select two different players")
      return false
    }

    if (!datePlayed) {
      setError("Please select a match date")
      return false
    }

    // Validate sets
    for (let i = 0; i < sets.length; i++) {
      const set = sets[i]
      if (set.player1Games < 0 || set.player2Games < 0) {
        setError(`Set ${i + 1}: Games cannot be negative`)
        return false
      }
      if (set.player1Games === 0 && set.player2Games === 0) {
        setError(`Set ${i + 1}: Please enter valid scores`)
        return false
      }
    }

    const winner = calculateWinner()
    if (!winner) {
      setError("Match must have a clear winner")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leagueId,
          player1Id,
          player2Id,
          winnerId: calculateWinner(),
          datePlayed,
          sets,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit match")
      }

      // Success - redirect to league page with success message
      router.push(`/leagues/${leagueSlug}?success=match-submitted`)
      
    } catch {
      setError("Failed to submit match. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPlayer1 = players.find(p => p.id === player1Id)
  const selectedPlayer2 = players.find(p => p.id === player2Id)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Player Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="player1" className="block text-sm font-medium text-gray-700 mb-2">
            Player 1
          </label>
          <select
            id="player1"
            value={player1Id}
            onChange={(e) => setPlayer1Id(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Player 1</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="player2" className="block text-sm font-medium text-gray-700 mb-2">
            Player 2
          </label>
          <select
            id="player2"
            value={player2Id}
            onChange={(e) => setPlayer2Id(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Player 2</option>
            {players.map((player) => (
              <option key={player.id} value={player.id} disabled={player.id === player1Id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Match Date */}
      <div>
        <label htmlFor="datePlayed" className="block text-sm font-medium text-gray-700 mb-2">
          Match Date
        </label>
        <input
          type="date"
          id="datePlayed"
          value={datePlayed}
          onChange={(e) => setDatePlayed(e.target.value)}
          max={new Date().toISOString().split('T')[0]} // Can't be in the future
          className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Sets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Sets</h3>
          <button
            type="button"
            onClick={addSet}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Set
          </button>
        </div>

        <div className="space-y-4">
          {sets.map((set, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Set {index + 1}</h4>
                {sets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSet(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {selectedPlayer1?.name || "Player 1"}
                  </div>
                  <input
                    type="number"
                    value={set.player1Games}
                    onChange={(e) => updateSet(index, 'player1Games', parseInt(e.target.value) || 0)}
                    min="0"
                    max="20"
                    className="w-full px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="text-center text-gray-500 font-medium">
                  VS
                </div>

                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {selectedPlayer2?.name || "Player 2"}
                  </div>
                  <input
                    type="number"
                    value={set.player2Games}
                    onChange={(e) => updateSet(index, 'player2Games', parseInt(e.target.value) || 0)}
                    min="0"
                    max="20"
                    className="w-full px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Match"}
        </button>
      </div>
    </form>
  )
} 