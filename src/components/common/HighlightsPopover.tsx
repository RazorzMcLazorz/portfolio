import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { useId, useState } from 'react'

export interface Highlight {
  title: string
  description: string
}

export default function HighlightsPopover({
  title,
  label,
  highlights,
  headingLevel = 'h4',
}: {
  title: string
  label: string
  highlights: Highlight[]
  headingLevel?: 'h4' | 'h5'
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const id = useId()
  const open = Boolean(anchorEl)

  return (
    <>
      <Button
        fullWidth
        aria-expanded={open}
        aria-haspopup='dialog'
        aria-controls={open ? id : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        startIcon={<ArrowRightIcon sx={{ transform: open ? 'rotate(90deg)' : 'none' }} />}
        sx={{
          justifyContent: 'flex-start',
          padding: '0.75rem 0',
          borderTop: '1px solid',
          borderColor: 'divider',
          borderRadius: 0,
          color: 'text.primary',
        }}>
        {label}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        marginThreshold={16}
        slotProps={{
          paper: {
            id,
            role: 'dialog',
            'aria-modal': true,
            'aria-labelledby': `${id}-title`,
            sx: {
              width: 'min(34rem, calc(100vw - 32px))',
              maxHeight: 'min(28rem, calc(100dvh - 32px))',
              padding: 3,
              overscrollBehavior: 'contain',
            },
          },
        }}>
        <header
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Typography component={headingLevel} variant='h6' id={`${id}-title`}>
            {title}
          </Typography>
          <IconButton
            aria-label={`Close ${label.toLowerCase()}`}
            onClick={() => setAnchorEl(null)}
            sx={{ marginLeft: 'auto' }}>
            <CloseIcon />
          </IconButton>
        </header>
        <Typography
          component='ul'
          sx={{
            margin: 0,
            paddingLeft: 2.5,
            color: 'text.secondary',
            '& li + li': { marginTop: 1.5 },
          }}>
          {highlights.map(({ title, description }) => (
            <li key={title}>
              <strong>{title}:</strong> {description}
            </li>
          ))}
        </Typography>
      </Popover>
    </>
  )
}
