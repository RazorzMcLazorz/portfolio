import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Contributions from './Contributions'
import type { ContributionSnapshot } from './calendar'

const snapshot: ContributionSnapshot = {
  from: '2026-10-18',
  to: '2026-10-20',
  sources: {
    github: {
      status: 'ok',
      syncedAt: '2026-10-20T12:00:00Z',
      days: { '2026-10-18': 2, '2026-10-20': 1 },
    },
    gitea: {
      status: 'ok',
      syncedAt: '2026-10-20T12:00:00Z',
      days: { '2026-10-19': 4, '2026-10-20': 3 },
    },
  },
}

describe('contribution section', () => {
  it('shows combined counts, source filters, day details, and safe profile links', async () => {
    const user = userEvent.setup()
    render(<Contributions snapshot={snapshot} />)
    expect(screen.getByRole('heading', { name: '10 recorded contributions' })).toBeVisible()
    expect(screen.getByText('3 active days in this view.')).toBeVisible()
    const controls = within(screen.getByRole('group', { name: 'Contribution source' }))
    expect(controls.getByRole('button', { name: 'Combined' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('status')).toHaveTextContent(
      'Oct 20, 2026: 4 contributions · GitHub: 1 · Gitea: 3',
    )
    await user.click(controls.getByRole('button', { name: 'GitHub' }))
    expect(screen.getByRole('heading', { name: '3 recorded contributions' })).toBeVisible()
    await user.click(controls.getByRole('button', { name: 'Gitea' }))
    expect(screen.getByRole('heading', { name: '7 recorded contributions' })).toBeVisible()
    await user.click(controls.getByRole('button', { name: 'Combined' }))
    await user.click(screen.getByRole('button', { name: 'Oct 18, 2026: 2 contributions' }))
    expect(screen.getByRole('status')).toHaveTextContent('Oct 18, 2026: 2 contributions')
    for (const name of ['GitHub', 'Gitea']) {
      expect(
        screen.getByRole('link', { name: `${name} profile (opens in a new tab)` }),
      ).toHaveAttribute('rel', 'noopener noreferrer')
    }
    expect(screen.getByText(/Private activity is shared only as daily counts/)).toBeVisible()
  })

  it('supports roving keyboard focus without hundreds of tab stops', async () => {
    const user = userEvent.setup()
    render(<Contributions snapshot={snapshot} />)
    const calendar = within(screen.getByRole('group', { name: 'Daily contribution calendar' }))
    const buttons = calendar.getAllByRole('button')
    expect(buttons.filter((button) => button.tabIndex === 0)).toHaveLength(1)
    buttons[2]!.focus()
    await user.keyboard('{Home}{ArrowDown}')
    expect(buttons[1]).toHaveFocus()
    await user.keyboard('{ArrowUp}{ArrowRight}')
    expect(buttons[2]).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(buttons[0]).toHaveFocus()
    await user.keyboard('{End}{Enter}')
    expect(buttons[2]).toHaveFocus()
    expect(buttons.filter((button) => button.tabIndex === 0)).toHaveLength(1)
  })

  it('shows partial failures honestly and preserves the last successful counts', async () => {
    const user = userEvent.setup()
    render(
      <Contributions
        snapshot={{
          ...snapshot,
          sources: {
            github: { status: 'unavailable', syncedAt: null, days: {} },
            gitea: { ...snapshot.sources.gitea, status: 'stale' },
          },
        }}
      />,
    )
    expect(screen.getByRole('heading', { name: '7 recorded contributions' })).toBeVisible()
    expect(
      screen.getByText(/GitHub: data unavailable. Gitea: showing the last successful sync/),
    ).toBeVisible()
    expect(screen.getByText(/GitHub: unavailable · Gitea: 3/)).toBeVisible()
    await user.click(
      within(screen.getByRole('group', { name: 'Contribution source' })).getByRole('button', {
        name: 'GitHub',
      }),
    )
    expect(screen.getByRole('heading', { name: 'Contribution data unavailable' })).toBeVisible()
    expect(
      screen.queryByRole('group', { name: 'Daily contribution calendar' }),
    ).not.toBeInTheDocument()
    expect(screen.getByText(/Not synced/)).toBeVisible()
  })
})
