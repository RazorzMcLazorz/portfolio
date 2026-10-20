export type ContributionSource = 'github' | 'gitea'
export type ContributionView = ContributionSource | 'combined'

export interface SourceContributions {
  status: 'ok' | 'stale' | 'unavailable'
  syncedAt: string | null
  days: Record<string, number>
}

export interface ContributionSnapshot {
  from: string
  to: string
  sources: Record<ContributionSource, SourceContributions>
}

export const contributionProfiles = {
  github: { name: 'GitHub', url: 'https://github.com/RazorzMcLazorz' },
  gitea: { name: 'Gitea', url: 'https://gitea.natelinyoungnas.com/RazorzMcLazorz' },
} as const

export interface ContributionDay {
  date: string
  count: number
  github: number | null
  gitea: number | null
}

export function calendarDays(snapshot: ContributionSnapshot, view: ContributionView) {
  const days: ContributionDay[] = []
  const end = new Date(`${snapshot.to}T00:00:00Z`)
  for (
    const date = new Date(`${snapshot.from}T00:00:00Z`);
    date <= end;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    const key = date.toISOString().slice(0, 10)
    const github =
      snapshot.sources.github.status === 'unavailable'
        ? null
        : (snapshot.sources.github.days[key] ?? 0)
    const gitea =
      snapshot.sources.gitea.status === 'unavailable'
        ? null
        : (snapshot.sources.gitea.days[key] ?? 0)
    const count =
      view === 'combined'
        ? (github ?? 0) + (gitea ?? 0)
        : ((view === 'github' ? github : gitea) ?? 0)
    days.push({ date: key, count, github, gitea })
  }
  return days
}

export function calendarWeeks(days: ContributionDay[]) {
  if (days.length === 0) return []
  const offset = new Date(`${days[0]!.date}T00:00:00Z`).getUTCDay()
  const padded: (ContributionDay | null)[] = [...Array<null>(offset).fill(null), ...days]
  const weeks: (ContributionDay | null)[][] = []
  for (let index = 0; index < padded.length; index += 7) {
    const week = padded.slice(index, index + 7)
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}

export function contributionLevel(count: number, maximum: number) {
  return count === 0 ? 0 : Math.max(1, Math.ceil((count / maximum) * 4))
}

export function formatContributionDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(`${date}T00:00:00Z`),
  )
}
