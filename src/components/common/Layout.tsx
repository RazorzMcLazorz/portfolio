import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavBar from './navBar/NavBar'

const pageTitles: Record<string, string> = {
  '/': 'Frontend Developer',
  '/projects': 'Projects',
  '/skills': 'Skills',
  '/contact': 'Contact',
}

export default function Layout() {
  const { pathname } = useLocation()
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

  return (
    <>
      <a className='skip-link' href='#main-content'>
        Skip to content
      </a>
      <NavBar />
      <main id='main-content' className='page-shell' tabIndex={-1} ref={mainRef}>
        <Outlet />
      </main>
      <footer className='site-footer'>Built with React, TypeScript, Vite & Bun.</footer>
    </>
  )
}
