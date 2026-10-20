import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/common/Layout'
import Contact from './components/contact/Contact'
import Home from './components/home/Home'
import Projects from './components/projects/Projects'
import Skills from './components/skills/Skills'
import NotFound from './components/NotFound'
import { SceneryContext, type Scenery } from './SceneryContext'
import createPortfolioTheme from './theme'

const preferenceKey = 'portfolio-scenery'

function initialScenery(): Scenery {
  try {
    return localStorage.getItem(preferenceKey) === 'sunrise' ? 'sunrise' : 'sunset'
  } catch {
    return 'sunset'
  }
}

export default function App() {
  const [scenery, setScenery] = useState(initialScenery)

  useEffect(() => {
    try {
      localStorage.setItem(preferenceKey, scenery)
    } catch {
      // The theme still works when browser storage is unavailable.
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', scenery === 'sunrise' ? '#062b79' : '#540700')
  }, [scenery])

  return (
    <SceneryContext
      value={{
        scenery,
        toggleScenery: () => setScenery((current) => (current === 'sunset' ? 'sunrise' : 'sunset')),
      }}>
      <ThemeProvider theme={createPortfolioTheme(scenery)}>
        <CssBaseline />
        <div className='portfolio' data-scenery={scenery}>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='projects' element={<Projects />} />
                <Route path='skills' element={<Skills />} />
                <Route path='contact' element={<Contact />} />
                <Route path='*' element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </SceneryContext>
  )
}
