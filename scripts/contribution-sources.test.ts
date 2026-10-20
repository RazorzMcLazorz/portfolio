// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ContributionSnapshot } from '../src/components/contributions/calendar'
import {
  parseGiteaContributions,
  parseGitHubContributions,
  syncContributionSnapshot,
} from './contribution-sources'

const githubResponse = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: [
            {
              contributionDays: [
                {
                  date: '2026-10-19',
                  contributionCount: 3,
                  privateRepositoryName: 'must-not-leak',
                },
                { date: '2026-10-20', contributionCount: 0 },
              ],
            },
          ],
        },
      },
    },
  },
}
const previous: ContributionSnapshot = {
  from: '2025-10-21',
  to: '2026-10-20',
  sources: {
    github: { status: 'ok', syncedAt: '2026-10-19T00:00:00Z', days: { '2026-10-19': 2 } },
    gitea: { status: 'unavailable', syncedAt: null, days: {} },
  },
}

afterEach(() => vi.unstubAllGlobals())

describe('contribution source adapters', () => {
  it('keeps only daily GitHub counts, with no repository metadata', () => {
    expect(parseGitHubContributions(githubResponse)).toEqual({ '2026-10-19': 3 })
    for (const invalid of [
      null,
      [],
      { errors: [{ message: 'secret' }] },
      { data: { user: null } },
    ]) {
      expect(() => parseGitHubContributions(invalid)).toThrow()
    }
    expect(() =>
      parseGitHubContributions({
        data: { user: { contributionsCollection: { contributionCalendar: { weeks: null } } } },
      }),
    ).toThrow()
    expect(() =>
      parseGitHubContributions({
        data: { user: { contributionsCollection: { contributionCalendar: { weeks: [{}] } } } },
      }),
    ).toThrow()
    const day =
      githubResponse.data.user.contributionsCollection.contributionCalendar.weeks[0]
        .contributionDays[0]
    expect(() =>
      parseGitHubContributions({
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                weeks: [{ contributionDays: [{ ...day, date: 'not-a-date' }] }],
              },
            },
          },
        },
      }),
    ).toThrow()
  })

  it('sums Gitea timestamp buckets by UTC day and rejects invalid values', () => {
    const timestamp = Date.parse('2026-10-19T23:45:00Z') / 1000
    expect(
      parseGiteaContributions([
        { timestamp, contributions: 2 },
        { timestamp: timestamp - 900, contributions: 3 },
        { timestamp: timestamp + 900, contributions: 4 },
        { timestamp, contributions: 0 },
      ]),
    ).toEqual({ '2026-10-19': 5, '2026-10-20': 4 })
    expect(parseGiteaContributions([])).toEqual({})
    for (const invalid of [
      null,
      {},
      [{ timestamp, contributions: -1 }],
      [{ timestamp, contributions: '2' }],
      [{ timestamp: Number.MAX_SAFE_INTEGER, contributions: 1 }],
    ]) {
      expect(() => parseGiteaContributions(invalid)).toThrow()
    }
  })

  it('fetches both services with server-only auth and emits only bounded daily counts', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(Response.json(githubResponse))
      .mockResolvedValueOnce(
        Response.json([
          {
            timestamp: Date.parse('2026-10-19T18:00:00Z') / 1000,
            contributions: 4,
            repository: 'private',
          },
          { timestamp: Date.parse('2020-01-01T00:00:00Z') / 1000, contributions: 99 },
        ]),
      )
    vi.stubGlobal('fetch', fetcher)
    const result = await syncContributionSnapshot(
      previous,
      { github: 'github-secret', gitea: 'gitea-secret' },
      new Date('2026-10-20T12:00:00Z'),
    )
    expect(result.from).toBe('2025-10-21')
    expect(result.to).toBe('2026-10-20')
    expect(result.sources.github.days).toEqual({ '2026-10-19': 3 })
    expect(result.sources.gitea.days).toEqual({ '2026-10-19': 4 })
    expect(result.sources.gitea.status).toBe('ok')
    expect(fetcher.mock.calls[0][1].headers.Authorization).toBe('Bearer github-secret')
    expect(fetcher.mock.calls[1][1].redirect).toBe('error')
    expect(JSON.stringify(result)).not.toMatch(/secret|private|repository/)
  })

  it('retains snapshots when unauthenticated or services fail, without leaking errors', async () => {
    const fetcher = vi.fn()
    vi.stubGlobal('fetch', fetcher)
    expect(
      (await syncContributionSnapshot(previous, {}, new Date('2026-10-20T12:00:00Z'))).sources,
    ).toEqual(previous.sources)
    expect(fetcher).not.toHaveBeenCalled()
    fetcher
      .mockRejectedValueOnce(new Error('token=private-secret'))
      .mockResolvedValueOnce(new Response('private error', { status: 401 }))
    const result = await syncContributionSnapshot(previous, { github: 'bad', gitea: 'bad' })
    expect(result.sources.github.status).toBe('stale')
    expect(result.sources.github.days).toEqual(previous.sources.github.days)
    expect(result.sources.gitea.status).toBe('unavailable')
    expect(JSON.stringify(result)).not.toMatch(/token|secret|error/)
  })

  it('marks an older unconfigured source stale when the calendar advances', async () => {
    const result = await syncContributionSnapshot(previous, {}, new Date('2026-10-21T12:00:00Z'))
    expect(result.sources.github.status).toBe('stale')
    expect(result.sources.github.days).toEqual(previous.sources.github.days)
    expect(result.sources.gitea.status).toBe('unavailable')
  })
})
