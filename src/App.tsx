import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from './constants/routes'
import Home from './components/home/Home'

function App() {
  return (
    <BrowserRouter>
      {window.screen.width < 600 ? (
        <Routes>
          <Route path={routes.home} element={<Home />} />
        </Routes>
      ) : (
        <Routes>
          <Route path={routes.home} element={<Home />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App