import type {
  ContributionSnapshot,
  SourceContributions,
} from '../src/components/contributions/calendar'

const username = 'RazorzMcLazorz'
const githubQuery = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar { weeks { contributionDays { date contributionCount } } }
    }
  }
}`

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid contribution response')
  return value as Record<string, unknown>
}

function nonnegativeCount(value: unknown): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0)
    throw new Error('Invalid contribution count')
  return value as number
}

export function parseGitHubContributions(value: unknown) {
  const response = record(value)
  if (response.errors) throw new Error('GitHub contribution request failed')
  const calendar = record(
    record(record(record(response.data).user).contributionsCollection).contributionCalendar,
  )
  if (!Array.isArray(calendar.weeks)) throw new Error('Missing GitHub contribution weeks')
  const days: Record<string, number> = {}
  for (const week of calendar.weeks) {
    const entries = record(week).contributionDays
    if (!Array.isArray(entries)) throw new Error('Missing GitHub contribution days')
    for (const entry of entries) {
      const day = record(entry)
      if (
        typeof day.date !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(day.date) ||
        !Number.isFinite(Date.parse(day.date))
      )
        throw new Error('Invalid contribution date')
      const count = nonnegativeCount(day.contributionCount)
      if (count > 0) days[day.date] = count
    }
  }
  return days
}

export function parseGiteaContributions(value: unknown) {
  if (!Array.isArray(value)) throw new Error('Invalid Gitea heatmap')
  const days: Record<string, number> = {}
  for (const entry of value) {
    const bucket = record(entry)
    const timestamp = nonnegativeCount(bucket.timestamp)
    const date = new Date(timestamp * 1000)
    if (!Number.isFinite(date.getTime())) throw new Error('Invalid Gitea timestamp')
    const key = date.toISOString().slice(0, 10)
    const count = nonnegativeCount(bucket.contributions)
    if (count > 0) days[key] = (days[key] ?? 0) + count
  }
  return days
}

async function requestCounts(url: string, token: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', ...options.headers },
    signal: AbortSignal.timeout(20_000),
    redirect: 'error',
  })
  if (!response.ok) throw new Error('Contribution service unavailable')
  return response.json() as Promise<unknown>
}

export async function syncContributionSnapshot(
  previous: ContributionSnapshot,
  tokens: { github?: string; gitea?: string },
  now = new Date(),
): Promise<ContributionSnapshot> {
  const end = new Date(now)
  const start = new Date(now)
  start.setUTCDate(start.getUTCDate() - 364)
  const from = start.toISOString().slice(0, 10)
  const to = end.toISOString().slice(0, 10)
  const sources = { ...previous.sources }
  await Promise.all(
    (['github', 'gitea'] as const).map(async (source) => {
      const token = tokens[source]
      if (!token) {
        if (previous.to !== to && previous.sources[source].syncedAt) {
          sources[source] = { ...previous.sources[source], status: 'stale' }
        }
        return
      }
      try {
        const raw =
          source === 'github'
            ? await requestCounts('https://api.github.com/graphql', token, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  query: githubQuery,
                  variables: { login: username, from: `${from}T00:00:00Z`, to: now.toISOString() },
                }),
              })
            : await requestCounts(
                `https://gitea.natelinyoungnas.com/api/v1/users/${username}/heatmap`,
                token,
              )
        const parsed =
          source === 'github' ? parseGitHubContributions(raw) : parseGiteaContributions(raw)
        sources[source] = {
          status: 'ok',
          syncedAt: now.toISOString(),
          days: Object.fromEntries(
            Object.entries(parsed)
              .filter(([date]) => date >= from && date <= to)
              .sort(([left], [right]) => left.localeCompare(right)),
          ),
        }
      } catch {
        const old = previous.sources[source]
        sources[source] = {
          ...old,
          status: old.syncedAt ? 'stale' : 'unavailable',
        } satisfies SourceContributions
      }
    }),
  )
  return { from, to, sources }
}
