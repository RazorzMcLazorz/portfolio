import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/common/Layout'
import Contact from './components/contact/Contact'
import Home from './components/home/Home'
import Projects from './components/projects/Projects'
import Skills from './components/skills/Skills'
import NotFound from './components/NotFound'
import theme from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  )
}
