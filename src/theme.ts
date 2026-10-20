import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#44d9e6' },
    background: { default: '#2a2a2a', paper: '#303030' },
    text: { primary: '#f5f5f5', secondary: '#c2c2c2' },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontSize: 'clamp(2.25rem, 6vw, 4rem)', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    h3: { fontSize: '1.2rem', fontWeight: 600 },
    button: { textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: { defaultProps: { elevation: 0, variant: 'outlined' } },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCssBaseline: { styleOverrides: { body: { margin: 0 } } },
  },
})

export default theme
