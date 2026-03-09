import teamsData from './data/teams.json'
import type { Team } from './types'

export const teams: Team[] = teamsData as Team[]

// Create a lookup object for teams by slug
export const teamsBySlug: Record<string, Team> = teams.reduce((acc, team) => {
  if (team.slug) {
    acc[team.slug] = team
  }
  return acc
}, {} as Record<string, Team>)
