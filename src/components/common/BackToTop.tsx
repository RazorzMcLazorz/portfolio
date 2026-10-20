import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import Fab from '@mui/material/Fab'
import useScrollTrigger from '@mui/material/useScrollTrigger'

export default function BackToTop() {
  const visible = useScrollTrigger({ disableHysteresis: true, threshold: 240 })

  if (!visible) return null

  return (
    <Fab
      color='primary'
      size='medium'
      aria-label='Back to top'
      title='Back to top'
      onClick={() => {
        document.getElementById('page-top')?.focus({ preventScroll: true })
        // CSS provides smooth scrolling unless reduced motion is preferred.
        window.scrollTo({ top: 0, behavior: 'auto' })
      }}
      sx={{
        position: 'fixed',
        top: 'max(1rem, env(safe-area-inset-top))',
        right: 'max(1rem, env(safe-area-inset-right))',
        zIndex: (theme) => theme.zIndex.appBar + 1,
        boxShadow: '4px 4px var(--shadow)',
        '&:hover': { boxShadow: '4px 4px var(--shadow)' },
      }}>
      <ArrowUpwardIcon />
    </Fab>
  )
}
