import { createTheme } from '@mui/material/styles'
import type { Scenery } from './SceneryContext'

export default function createPortfolioTheme(scenery: Scenery) {
  const sunrise = scenery === 'sunrise'
  return createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: sunrise ? '#9cdbff' : '#ffe0a6',
        contrastText: sunrise ? '#062b79' : '#550701',
      },
      background: {
        default: sunrise ? '#062b79' : '#540700',
        paper: sunrise ? '#16498a' : '#be2501',
      },
      text: { primary: '#fff8ed', secondary: sunrise ? '#e1efff' : '#ffe4cb' },
    },
    typography: {
      fontFamily: '"Iceberg", "Trebuchet MS", sans-serif',
      h1: { fontSize: 'clamp(2.5rem, 5.4vw, 5.25rem)', fontWeight: 400, lineHeight: 1.15 },
      h2: { fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400 },
      h3: { fontSize: '1.4rem', fontWeight: 400 },
      body1: { lineHeight: 1.75 },
      button: { textTransform: 'none' },
    },
    shape: { borderRadius: 2 },
    components: {
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: `8px 8px ${sunrise ? '#5995b7' : '#911201'}`,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { minHeight: 44, paddingInline: 18, fontSize: '1rem' } },
      },
      MuiCssBaseline: { styleOverrides: { body: { margin: 0 } } },
    },
  })
}
