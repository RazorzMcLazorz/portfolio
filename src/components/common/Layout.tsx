import { useContext, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SceneryContext } from '../../SceneryContext'
import BackToTop from './BackToTop'
import NavBar from './navBar/NavBar'

const pageTitles: Record<string, string> = {
  '/': 'Frontend Developer',
  '/projects': 'Projects',
  '/skills': 'Skills',
  '/contact': 'Contact',
}

export default function Layout() {
  const { pathname, hash, key } = useLocation()
  const { scenery } = useContext(SceneryContext)
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)

  useEffect(() => {
    document.title = `${pageTitles[pathname] ?? 'Page not found'} | Nathaniel P. Young`
    if (previousPath.current !== pathname) {
      mainRef.current?.focus()
      window.scrollTo({ top: 0, behavior: 'instant' })
      previousPath.current = pathname
    }
  }, [pathname])

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      // Let CSS enable smooth scrolling and honor prefers-reduced-motion.
      target?.scrollIntoView({ behavior: 'auto' })
      target?.focus({ preventScroll: true })
    }
  }, [pathname, hash, key])

  return (
    <div className={pathname === '/' ? 'landing-page' : 'interior-page'}>
      <div className='mountain-backdrop' aria-hidden='true'>
        <img
          src={`${import.meta.env.BASE_URL}assets/concept/${scenery === 'sunset' ? 'mountainsSunset.svg' : 'mSunrise.svg'}`}
          alt=''
          fetchPriority='high'
        />
      </div>
      <a className='skip-link' href='#main-content'>
        Skip to content
      </a>
      <NavBar />
      <main id='main-content' className='page-shell' tabIndex={-1} ref={mainRef}>
        <Outlet />
      </main>
      <footer className='site-footer'>Built with React, TypeScript, Vite & Bun.</footer>
      <BackToTop />
    </div>
  )
}
