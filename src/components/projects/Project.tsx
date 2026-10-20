import GitHubIcon from '@mui/icons-material/GitHub'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { PortfolioProject } from './constants'

export default function Project({ project }: { project: PortfolioProject }) {
  return (
    <Paper
      component='article'
      className='panel project-card'
      aria-labelledby={`project-${project.id}`}>
      <Typography variant='h3' id={`project-${project.id}`}>
        {project.title}
      </Typography>
      <Typography component='p' variant='body2' color='text.secondary'>
        {project.date}
      </Typography>
      <p>{project.summary}</p>
      <div className='project-actions'>
        <Button
          component='a'
          href={project.github}
          target='_blank'
          rel='noopener noreferrer'
          startIcon={<GitHubIcon />}
          aria-label={`View ${project.title} on GitHub (opens in a new tab)`}>
          View source
        </Button>
        {project.archivedDemo && (
          <Typography variant='caption' color='text.secondary'>
            Original demo is no longer available.
          </Typography>
        )}
      </div>
    </Paper>
  )
}
