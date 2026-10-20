import { describe, expect, it } from 'vitest'
import { calendarDays, calendarWeeks, contributionLevel, formatContributionDate } from './calendar'
import type { ContributionSnapshot } from './calendar'

const snapshot: ContributionSnapshot = {
  from: '2024-02-28',
  to: '2024-03-01',
  sources: {
    github: {
      status: 'ok',
      syncedAt: '2024-03-01T12:00:00Z',
      days: { '2024-02-28': 2, '2024-02-29': 1 },
    },
    gitea: { status: 'ok', syncedAt: '2024-03-01T12:00:00Z', days: { '2024-02-29': 3 } },
  },
}

describe('contribution calendar', () => {
  it('merges daily counts in UTC, including leap days and zero-activity dates', () => {
    expect(calendarDays(snapshot, 'combined')).toEqual([
      { date: '2024-02-28', github: 2, gitea: 0, count: 2 },
      { date: '2024-02-29', github: 1, gitea: 3, count: 4 },
      { date: '2024-03-01', github: 0, gitea: 0, count: 0 },
    ])
    expect(calendarDays(snapshot, 'github').map(({ count }) => count)).toEqual([2, 1, 0])
    expect(calendarDays(snapshot, 'gitea').map(({ count }) => count)).toEqual([0, 3, 0])
  })

  it('distinguishes unavailable data from valid zero counts and retains stale counts', () => {
    const partial: ContributionSnapshot = {
      ...snapshot,
      sources: {
        github: { ...snapshot.sources.github, status: 'unavailable' },
        gitea: { ...snapshot.sources.gitea, status: 'stale' },
      },
    }
    expect(calendarDays(partial, 'combined')[1]).toEqual({
      date: '2024-02-29',
      github: null,
      gitea: 3,
      count: 3,
    })
    expect(calendarDays(partial, 'github')[0]!.count).toBe(0)
    partial.sources.gitea.status = 'unavailable'
    expect(calendarDays(partial, 'gitea')[0]!.gitea).toBeNull()
  })

  it('aligns weeks to Sunday and pads dates without inventing activity', () => {
    const days = calendarDays(snapshot, 'combined')
    const weeks = calendarWeeks(days)
    expect(weeks).toHaveLength(1)
    expect(weeks[0]).toEqual([null, null, null, ...days, null])
    expect(calendarWeeks([])).toEqual([])
    expect(formatContributionDate('2024-02-29')).toBe('Feb 29, 2024')
  })

  it('maps counts to a zero level and four nonzero intensity levels', () => {
    expect([0, 1, 3, 5, 8].map((count) => contributionLevel(count, 8))).toEqual([0, 1, 2, 3, 4])
  })
})
