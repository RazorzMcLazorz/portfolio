import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { projectGroups } from './components/projects/constants'

function renderPage(path = '/') {
  window.history.replaceState({}, '', path)
  return render(<App />)
}

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

describe('portfolio', () => {
  it('renders the home page, education, technologies, and working calls to action', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'Nathaniel P. Young' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Education' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Explore my projects' })).toHaveAttribute(
      'href',
      '/projects',
    )
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: 'TypeScript' })).toHaveAttribute(
      'href',
      'https://www.typescriptlang.org/',
    )
    expect(screen.getByRole('link', { name: 'React' })).toHaveAttribute(
      'href',
      'https://react.dev/',
    )
    expect(document.title).toBe('Frontend Developer | Nathaniel P. Young')
  })

  it('navigates without reloading and moves focus to the new page', async () => {
    const user = userEvent.setup()
    renderPage()
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })

    for (const page of ['Projects', 'Skills', 'Contact', 'Home']) {
      await user.click(within(nav).getByRole('link', { name: page }))
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: page === 'Home' ? 'Nathaniel P. Young' : page,
        }),
      ).toBeVisible()
      expect(within(nav).getByRole('link', { name: page })).toHaveAttribute('aria-current', 'page')
      expect(screen.getByRole('main')).toHaveFocus()
    }
    expect(window.scrollTo).toHaveBeenCalledTimes(4)
  })

  it('renders every project once, with source links instead of broken demos', () => {
    renderPage('/projects')
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible()
    for (const { title, projects } of projectGroups) {
      const group = screen.getByRole('region', { name: title })
      for (const project of projects) {
        const card = within(group).getByRole('article', { name: project.title })
        expect(within(card).getByRole('link', { name: /on GitHub/ })).toHaveAttribute(
          'href',
          project.github,
        )
        expect(screen.getAllByRole('heading', { name: project.title })).toHaveLength(1)
      }
    }
    expect(document.querySelector('a[href*="herokuapp.com"]')).not.toBeInTheDocument()
    expect(document.title).toBe('Projects | Nathaniel P. Young')
  })

  it('renders current skills on a direct URL', () => {
    renderPage('/skills')
    expect(screen.getByRole('heading', { level: 1, name: 'Skills' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'TypeScript & JavaScript' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'React' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Bun & Vite' })).toBeVisible()
  })

  it('provides email, telephone, social, and accessible résumé links', () => {
    renderPage('/contact')
    expect(screen.getByRole('link', { name: 'nateyoungdev@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:nateyoungdev@gmail.com',
    )
    expect(screen.getByRole('link', { name: '385-207-6257' })).toHaveAttribute(
      'href',
      'tel:3852076257',
    )
    const resume = screen.getByRole('link', { name: 'Open résumé (PDF)' })
    expect(resume).toHaveAttribute('href', '/assets/Resume.pdf')
    expect(resume).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'Download résumé' })).toHaveAttribute(
      'download',
      'Nathaniel-Young-Resume.pdf',
    )
    expect(screen.getByLabelText('Résumé preview')).toHaveAttribute('data', '/assets/Resume.pdf')
    expect(screen.getByRole('link', { name: 'Open the résumé instead.' })).toHaveAttribute(
      'href',
      '/assets/Resume.pdf',
    )
  })

  it('shows a helpful 404 and lets visitors return home', async () => {
    const user = userEvent.setup()
    renderPage('/not-a-page')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeVisible()
    expect(document.title).toBe('Page not found | Nathaniel P. Young')
    await user.click(screen.getByRole('link', { name: 'Back to home' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Nathaniel P. Young' })).toBeVisible()
  })

  it('labels external links and safely opens them in new tabs', () => {
    renderPage('/contact')
    for (const link of screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('target') === '_blank')) {
      expect(link).toHaveAccessibleName()
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#main-content',
    )
  })
})
