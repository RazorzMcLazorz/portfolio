import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { projectGroups } from './components/projects/constants'

function renderPage(path = '/') {
  window.history.replaceState({}, '', path)
  return render(<App />)
}

beforeEach(() => {
  localStorage.clear()
  if (!document.querySelector('meta[name="theme-color"]')) {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.append(meta)
  }
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  Element.prototype.scrollIntoView = vi.fn()
})

describe('portfolio', () => {
  it('renders the home page, education, technologies, and working calls to action', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'Nathaniel Patrick Young' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Education' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Explore my projects' })).toHaveAttribute(
      'href',
      '#projects',
    )
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '#contact')
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

  it('navigates between sections and focuses each destination', async () => {
    const user = userEvent.setup()
    renderPage()
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })

    for (const [label, id] of [
      ['Experience', 'workexperience'],
      ['Projects', 'projects'],
      ['Languages', 'languages'],
      ['About Me', 'aboutme'],
      ['Resume', 'resume'],
      ['References', 'references'],
    ]) {
      await user.click(within(nav).getByRole('link', { name: label }))
      expect(document.getElementById(id!)).toHaveFocus()
      expect(window.location.hash).toBe(`#${id}`)
      expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'auto' })
    }
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(6)
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('renders every project once, with source links instead of broken demos', () => {
    renderPage('/projects')
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible()
    for (const { title, projects } of projectGroups) {
      const group = screen.getByRole('region', { name: title })
      for (const project of projects) {
        const card = within(group).getByRole('article', { name: project.title })
        if (project.github)
          expect(within(card).getByRole('link', { name: /on GitHub/ })).toHaveAttribute(
            'href',
            project.github,
          )
        if (project.private) expect(within(card).getByText('Private repository')).toBeVisible()
        if (project.website)
          expect(within(card).getByRole('link', { name: /Visit/ })).toHaveAttribute(
            'href',
            project.website,
          )
        expect(screen.getAllByRole('heading', { name: project.title })).toHaveLength(1)
      }
    }
    expect(document.querySelector('a[href*="herokuapp.com"]')).not.toBeInTheDocument()
    expect(document.querySelector('a[href*="allergenbuddy.com"]')).not.toBeInTheDocument()
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
    expect(screen.getByRole('heading', { level: 1, name: 'Nathaniel Patrick Young' })).toBeVisible()
  })

  it('retains legacy routes and returns to the correct home section', async () => {
    const user = userEvent.setup()
    renderPage('/contact')
    await user.click(screen.getByRole('link', { name: 'Experience' }))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('region', { name: 'Work Experience' })).toHaveFocus()
    expect(window.scrollTo).toHaveBeenCalledOnce()
  })

  it('opens direct section URLs', () => {
    renderPage('/#aboutme')
    expect(screen.getByRole('region', { name: 'About Me' })).toHaveFocus()
  })

  it('ignores unknown section hashes safely', () => {
    renderPage('/#missing')
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
  })

  it('switches artwork and palette, remembers the preference, and restores it', async () => {
    const user = userEvent.setup()
    const view = renderPage()
    const toggle = screen.getByRole('switch', { name: 'Sunrise theme' })
    expect(toggle).not.toBeChecked()
    await user.click(toggle)
    expect(toggle).toBeChecked()
    expect(document.querySelector('.portfolio')).toHaveAttribute('data-scenery', 'sunrise')
    expect(document.querySelector('.mountain-backdrop img')).toHaveAttribute(
      'src',
      '/assets/concept/mSunrise.svg',
    )
    expect(localStorage.getItem('portfolio-scenery')).toBe('sunrise')
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', '#062b79')
    view.unmount()
    renderPage()
    expect(screen.getByRole('switch', { name: 'Sunrise theme' })).toBeChecked()
    await user.click(screen.getByRole('switch', { name: 'Sunrise theme' }))
    expect(localStorage.getItem('portfolio-scenery')).toBe('sunset')
  })

  it('works when browser storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('switch', { name: 'Sunrise theme' }))
    expect(screen.getByRole('switch', { name: 'Sunrise theme' })).toBeChecked()
  })

  it('lets visitors pause and resume the skill orbits', async () => {
    const user = userEvent.setup()
    renderPage()
    const pause = screen.getByRole('button', { name: 'Pause skills animation' })
    expect(pause).toHaveAttribute('aria-pressed', 'false')
    await user.click(pause)
    expect(screen.getByRole('button', { name: 'Resume skills animation' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(document.querySelector('.skills-orbit')).toHaveClass('is-paused')
    await user.click(screen.getByRole('button', { name: 'Resume skills animation' }))
    expect(document.querySelector('.skills-orbit')).not.toHaveClass('is-paused')
  })

  it('shows a back-to-top button after scrolling and returns focus to the header', async () => {
    const user = userEvent.setup()
    const offset = vi.spyOn(window, 'pageYOffset', 'get').mockReturnValue(0)
    renderPage()
    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument()

    offset.mockReturnValue(500)
    fireEvent.scroll(window)
    await user.click(screen.getByRole('button', { name: 'Back to top' }))
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'auto' })
    expect(screen.getByRole('banner')).toHaveFocus()

    offset.mockReturnValue(0)
    fireEvent.scroll(window)
    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument()
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
