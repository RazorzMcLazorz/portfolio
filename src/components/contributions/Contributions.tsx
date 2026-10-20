import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import {
  calendarDays,
  calendarWeeks,
  contributionLevel,
  contributionProfiles,
  formatContributionDate,
} from './calendar'
import type { ContributionSnapshot, ContributionView } from './calendar'
import data from './data.json'

const views = [
  ['combined', 'Combined'],
  ['github', 'GitHub'],
  ['gitea', 'Gitea'],
] as const

export default function Contributions({
  snapshot = data as ContributionSnapshot,
}: {
  snapshot?: ContributionSnapshot
}) {
  const [view, setView] = useState<ContributionView>('combined')
  const [selectedDate, setSelectedDate] = useState(snapshot.to)
  const scrollRef = useRef<HTMLDivElement>(null)
  const days = calendarDays(snapshot, view)
  const weeks = calendarWeeks(days)
  const maximum = Math.max(1, ...days.map(({ count }) => count))
  const total = days.reduce((sum, { count }) => sum + count, 0)
  const activeDays = days.filter(({ count }) => count > 0).length
  const selected = days.find(({ date }) => date === selectedDate)
  const sources = view === 'combined' ? (['github', 'gitea'] as const) : [view]
  const available = sources.some((source) => snapshot.sources[source].status !== 'unavailable')
  const notices = sources.filter((source) => snapshot.sources[source].status !== 'ok')

  useEffect(() => {
    const container = scrollRef.current
    if (container) container.scrollLeft = container.scrollWidth
  }, [snapshot.to, available])

  function moveDay(event: KeyboardEvent<HTMLButtonElement>, date: string) {
    const index = days.findIndex((day) => day.date === date)
    const destinations: Record<string, number> = {
      ArrowRight: index + 7,
      ArrowLeft: index - 7,
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: days.length - 1,
    }
    if (!(event.key in destinations)) return
    event.preventDefault()
    const next = days[Math.max(0, Math.min(days.length - 1, destinations[event.key]!))]!
    event.currentTarget
      .closest('[data-contribution-calendar]')
      ?.querySelector<HTMLButtonElement>(`[data-date="${next.date}"]`)
      ?.focus()
  }

  return (
    <section
      className='landing-section'
      id='contributions'
      aria-labelledby='contributions-title'
      tabIndex={-1}>
      <p className='eyebrow'>A little every day</p>
      <Typography variant='h2' id='contributions-title' className='section-title'>
        Contributions
      </Typography>
      <p className='section-intro'>
        Building in the open and behind the scenes, across GitHub and my self-hosted Gitea.
      </p>
      <Paper className='panel contribution-panel'>
        <div className='contribution-toolbar'>
          <div>
            <Typography component='h3' variant='h3'>
              {available
                ? `${total.toLocaleString('en-US')} recorded contributions`
                : 'Contribution data unavailable'}
            </Typography>
            <Typography component='p' variant='body2' color='text.secondary'>
              {formatContributionDate(snapshot.from)} – {formatContributionDate(snapshot.to)} · UTC
            </Typography>
          </div>
          <div className='contribution-views' role='group' aria-label='Contribution source'>
            {views.map(([value, label]) => (
              <Button
                key={value}
                variant={view === value ? 'contained' : 'outlined'}
                aria-pressed={view === value}
                onClick={() => setView(value)}>
                {label}
              </Button>
            ))}
          </div>
        </div>
        {notices.length > 0 && (
          <p role='status'>
            {notices
              .map(
                (source) =>
                  `${contributionProfiles[source].name}: ${snapshot.sources[source].status === 'stale' ? 'showing the last successful sync' : 'data unavailable'}`,
              )
              .join('. ')}
            .
          </p>
        )}
        {available && (
          <>
            <p>{activeDays} active days in this view.</p>
            <div
              ref={scrollRef}
              className='contribution-scroll'
              role='region'
              aria-label='Scrollable contribution calendar'
              tabIndex={0}>
              <div
                className='contribution-graph'
                role='group'
                aria-label='Daily contribution calendar'
                aria-describedby='contribution-help'
                data-contribution-calendar>
                <div className='contribution-weekdays' aria-hidden='true'>
                  {['', '', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, index) => (
                    <span key={index}>{label}</span>
                  ))}
                </div>
                {weeks.map((week, weekIndex) => {
                  const first = week.find((day) => day && day.date.endsWith('-01'))
                  const month = first
                    ? new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(
                        new Date(`${first.date}T00:00:00Z`),
                      )
                    : ''
                  return (
                    <div className='contribution-week' key={weekIndex}>
                      <span className='contribution-month' aria-hidden='true'>
                        {month}
                      </span>
                      {week.map((day, dayIndex) =>
                        day ? (
                          <button
                            key={day.date}
                            type='button'
                            className='contribution-day'
                            data-level={contributionLevel(day.count, maximum)}
                            data-date={day.date}
                            aria-label={`${formatContributionDate(day.date)}: ${day.count} contributions`}
                            title={`${formatContributionDate(day.date)}: ${day.count} contributions`}
                            aria-pressed={selectedDate === day.date}
                            tabIndex={selectedDate === day.date ? 0 : -1}
                            onClick={() => setSelectedDate(day.date)}
                            onFocus={() => setSelectedDate(day.date)}
                            onKeyDown={(event) => moveDay(event, day.date)}
                          />
                        ) : (
                          <span key={`blank-${dayIndex}`} aria-hidden='true' />
                        ),
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='contribution-legend' aria-label='Contribution intensity: less to more'>
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className='contribution-day'
                  data-level={level}
                  aria-hidden='true'
                />
              ))}
              <span>More</span>
            </div>
            <Typography component='p' variant='body2' id='contribution-help' color='text.secondary'>
              Select a day for details. Use arrow keys to move between days.
            </Typography>
            {selected && (
              <p role='status' className='contribution-selection'>
                <strong>{formatContributionDate(selected.date)}</strong>: {selected.count}{' '}
                contributions
                {' · '}GitHub: {selected.github ?? 'unavailable'}
                {' · '}Gitea: {selected.gitea ?? 'unavailable'}
              </p>
            )}
          </>
        )}
        <div className='contribution-profiles'>
          {(['github', 'gitea'] as const).map((source) => (
            <Typography key={source} component='p' variant='body2' color='text.secondary'>
              <a href={contributionProfiles[source].url} target='_blank' rel='noopener noreferrer'>
                {contributionProfiles[source].name} profile (opens in a new tab)
              </a>
              {' · '}
              {snapshot.sources[source].syncedAt
                ? `Synced ${formatContributionDate(snapshot.sources[source].syncedAt!.slice(0, 10))}`
                : 'Not synced'}
            </Typography>
          ))}
        </div>
        <Typography component='p' variant='body2' color='text.secondary' sx={{ marginTop: 2 }}>
          Private activity is shared only as daily counts when supplied by each service. GitHub
          contributions and Gitea activity use different counting rules; combined totals add both,
          so mirrored activity may count twice. Refreshed on deployment.
        </Typography>
      </Paper>
    </section>
  )
}
