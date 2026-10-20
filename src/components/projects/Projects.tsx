import Typography from '@mui/material/Typography'
import Project from './Project'
import { projectGroups } from './constants'

export default function Projects({ embedded = false }: { embedded?: boolean }) {
  return (
    <section
      className={embedded ? 'landing-section' : undefined}
      id='projects'
      aria-labelledby='projects-title'
      tabIndex={-1}>
      {embedded && <p className='eyebrow'>Ideas made real</p>}
      <Typography
        variant={embedded ? 'h2' : 'h1'}
        id='projects-title'
        className={embedded ? 'section-title' : 'page-title'}>
        Projects
      </Typography>
      <p className={embedded ? 'section-intro' : 'page-intro'}>
        A selection of websites, games, and experiments I've built.
      </p>
      {embedded ? (
        <div className='project-grid'>
          {projectGroups
            .flatMap(({ projects }) => projects)
            .map((project) => (
              <Project key={project.id} project={project} />
            ))}
        </div>
      ) : (
        projectGroups.map(({ title, projects }) => (
          <section className='section' key={title} aria-label={title}>
            <Typography variant='h2' className='project-group-title'>
              {title}
            </Typography>
            <div className='project-grid'>
              {projects.map((project) => (
                <Project key={project.id} project={project} />
              ))}
            </div>
          </section>
        ))
      )}
    </section>
  )
}
