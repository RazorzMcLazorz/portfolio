import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import routes from './constants/routes'
import Home from './components/home/Home'
import HomeMob from './components/home/mobile/HomeMob'
import Projects from './components/projects/Projects'
import ProjectMob from './components/projects/mobile/ProjectMob'
import Skills from './components/skills/Skills'
import SkillsMob from './components/skills/mobile/SkillsMob'
import Contact from './components/contact/Contact'
import ContactMob from './components/contact/mobile/ContactMob'

function App() {
  return (
    <BrowserRouter>
      {isMobile ? (
        <Routes>
          <Route path={routes.home} element={<HomeMob />} />
          <Route path={routes.projects} element={<ProjectMob />} />
          <Route path={routes.skills} element={<SkillsMob />} />
          <Route path={routes.contact} element={<ContactMob />} />
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
