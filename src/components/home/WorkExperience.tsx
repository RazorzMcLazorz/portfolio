import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

// Employment dates are retained from the 2023 concept, not inferred from today's date.
const experiences = [
  {
    company: 'Dyno Nobel',
    role: 'Software Engineer',
    dates: 'May 2021 – Present',
    description:
      'Frontend development, research into Three.js and WebXR, and advocating for the move from Flow to TypeScript.',
  },
  {
    company: 'RoviTracker',
    role: 'Frontend Developer',
    dates: 'November 2018 – March 2022',
    description:
      'Started in QA, building automated tests with Cypress, before moving into frontend development and taking ownership of major frontend projects.',
  },
]

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
        {experiences.map(({ company, role, dates, description }) => (
          <Paper
            component='article'
            className='panel experience-card'
            key={company}
            aria-label={company}>
            <p className='eyebrow'>{role}</p>
            <Typography variant='h3'>{company}</Typography>
            <p>{description}</p>
            <Typography component='p' variant='body2' sx={{ marginTop: 'auto', paddingTop: 2 }}>
              {dates}
            </Typography>
          </Paper>
        ))}
      </div>
    </section>
  )
}
