import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { MatchSubmission } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body: MatchSubmission = await request.json()
    const { leagueId, player1Id, player2Id, winnerId, datePlayed, sets } = body

    // Validation
    if (!leagueId || !player1Id || !player2Id || !winnerId || !datePlayed || !sets?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (player1Id === player2Id) {
      return NextResponse.json(
        { error: "Players must be different" },
        { status: 400 }
      )
    }

    if (winnerId !== player1Id && winnerId !== player2Id) {
      return NextResponse.json(
        { error: "Winner must be one of the players" },
        { status: 400 }
      )
    }

    // Verify league exists
    const league = await prisma.league.findUnique({
      where: { id: leagueId }
    })

    if (!league) {
      return NextResponse.json(
        { error: "League not found" },
        { status: 404 }
      )
    }

    // Verify players exist
    const players = await prisma.player.findMany({
      where: {
        id: { in: [player1Id, player2Id] }
      }
    })

    if (players.length !== 2) {
      return NextResponse.json(
        { error: "One or both players not found" },
        { status: 404 }
      )
    }

    // Create match and sets in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the match
      const match = await tx.match.create({
        data: {
          leagueId,
          player1Id,
          player2Id,
          winnerId,
          datePlayed: new Date(datePlayed),
          createdBy: "system", // For now, until we have user management
        }
      })

      // Create the sets
      const setPromises = sets.map((set, index) =>
        tx.set.create({
          data: {
            matchId: match.id,
            setNumber: index + 1,
            player1Games: set.player1Games,
            player2Games: set.player2Games,
          }
        })
      )

      const createdSets = await Promise.all(setPromises)

      return { match, sets: createdSets }
    })

    return NextResponse.json({
      success: true,
      match: {
        id: result.match.id,
        player1Id: result.match.player1Id,
        player2Id: result.match.player2Id,
        winnerId: result.match.winnerId,
        datePlayed: result.match.datePlayed,
        sets: result.sets
      }
    })

  } catch (error) {
    console.error("Error creating match:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 