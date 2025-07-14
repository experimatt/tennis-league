import { redirect } from "next/navigation"
import { getDefaultLeague } from "@/lib/league"

export default async function LeaguesPage() {
  try {
    const defaultLeague = await getDefaultLeague()
    redirect(`/leagues/${defaultLeague.id}`)
  } catch (error) {
    console.error('Error getting default league:', error)
    // If no league exists, redirect to an error page or homepage
    redirect('/')
  }
} 