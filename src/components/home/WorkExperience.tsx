import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { useId, useState } from 'react'

// Dyno Nobel's current status was confirmed by Nate in October 2026.
const experiences = [
  {
    company: 'Dyno Nobel',
    role: 'Software Engineer',
    dates: 'May 2021 – Present',
    description:
      'Build and modernize frontend applications for blast reporting, analysis, and design, spanning data-heavy workflows, interactive 2D/3D tools, and developer tooling.',
    highlights: [
      {
        title: 'Reporting and analysis',
        description:
          'Built Blast Report workflows, Shot Report search and filtering, the Fracture Density Model end to end, and an interactive CSV editor.',
      },
      {
        title: 'Interactive tooling',
        description:
          'Developed Burden Control across 2D and 3D, including hole previews, navigation, measurement, PDF previews, and boretrack support.',
      },
      {
        title: 'Frontend modernization',
        description:
          'Led TypeScript migration across core application areas, removed Flow, migrated Enzyme tests to React Testing Library, and forked MUI v4 and its pickers to unblock React 19.',
      },
      {
        title: 'Quality and delivery',
        description:
          'Introduced Storybook, expanded unit coverage, improved test performance and Jenkins sharding, and contributed Playwright foundations.',
      },
      {
        title: 'Developer experience',
        description:
          'Built internal review and onboarding tools, standardized git conventions, introduced AI-assisted development tooling, and retired legacy feature flags.',
      },
    ],
  },
  {
    company: 'RoviTracker',
    role: 'Frontend Developer',
    dates: 'November 2018 – March 2022',
    description:
      'Started in QA automation before taking ownership of major frontend areas of RoviTracker’s equipment and fleet-management platform. Built responsive React and TypeScript interfaces spanning asset management, interactive maps, maintenance, and reporting.',
    highlights: [
      {
        title: 'QA automation',
        description:
          'Built Cypress tests for registration, login, and onboarding across desktop and mobile, with scheduled GitLab CI runs.',
      },
      {
        title: 'Asset management',
        description:
          'Developed searchable, filterable inventory with virtualized lists, detailed equipment profiles, device and user assignments, and account-management interfaces.',
      },
      {
        title: 'Mapping and geofencing',
        description:
          'Built Google Maps experiences for assets, sites, and Bluetooth tags, including search, filtering, geofence drawing, and editable boundaries.',
      },
      {
        title: 'Maintenance tools',
        description:
          'Developed interfaces for service tasks, parts management, ticket creation, editing and resolution, and service history.',
      },
      {
        title: 'Reporting and exports',
        description:
          'Built equipment-runtime, tank-level, and fluid-usage reports with date filtering, charts, tables, CSV exports, and printable views.',
      },
      {
        title: 'Frontend foundations',
        description:
          'Created shared Material UI components, responsive navigation, signup and password-reset flows, and improved error handling with Sentry.',
      },
    ],
  },
]

function WorkHighlights({
  company,
  highlights,
}: {
  company: string
  highlights: { title: string; description: string }[]
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
        Work highlights
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
          <Typography component='h4' variant='h6' id={`${id}-title`}>
            {company} work highlights
          </Typography>
          <IconButton
            aria-label='Close work highlights'
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

export default function WorkExperience() {
  return (
    <section
      className='landing-section'
      id='workexperience'
      aria-labelledby='experience-title'
      tabIndex={-1}>
      <p className='eyebrow'>Where I've been</p>
      <Typography variant='h2' id='experience-title' className='section-title'>
        Work Experience
      </Typography>
      <div className='content-grid'>
        {experiences.map(({ company, role, dates, description, highlights }) => (
          <Paper
            component='article'
            className='panel experience-card'
            key={company}
            aria-label={company}>
            <p className='eyebrow'>{role}</p>
            <Typography variant='h3'>{company}</Typography>
            <p>{description}</p>
            <WorkHighlights company={company} highlights={highlights} />
            <Typography component='p' variant='body2' sx={{ marginTop: 'auto', paddingTop: 2 }}>
              {dates}
            </Typography>
          </Paper>
        ))}
      </div>
    </section>
  )
}
