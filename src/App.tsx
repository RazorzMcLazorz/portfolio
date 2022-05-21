import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from './constants/routes'
import Home from './components/home/Home'
import Projects from './components/projects/Projects'

function App() {
  return (
    <BrowserRouter>
      {window.screen.width < 600 ? (
        <Routes>
          <Route path={routes.home} element={<Home />} />
          <Route path={routes.projects} element={<Projects />} />
        </Routes>
      ) : (
        <Routes>
          <Route path={routes.home} element={<Home />} />
          <Route path={routes.projects} element={<Projects />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
