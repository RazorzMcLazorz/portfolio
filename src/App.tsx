import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from './constants/routes'
import Home from './components/home/Home'
import Projects from './components/projects/Projects'
import Skills from './components/skills/Skills'
import Contact from './components/contact/Contact'

function App() {
  return (
    <BrowserRouter>
      {window.screen.width < 600 ? (
        <Routes>
          <Route path={routes.home} element={<Home />} />
          <Route path={routes.projects} element={<Projects />} />
          <Route path={routes.skills} element={<Skills />} />
          <Route path={routes.contact} element={<Contact />} />
        </Routes>
      ) : (
        <Routes>
          <Route path={routes.home} element={<Home />} />
          <Route path={routes.projects} element={<Projects />} />
          <Route path={routes.skills} element={<Skills />} />
          <Route path={routes.contact} element={<Contact />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
