import Typography from '@mui/material/Typography'
import Project from './Project'
import { projectGroups } from './constants'

export default function Projects() {
  return (
    <>
      <Typography variant='h1' className='page-title'>
        Projects
      </Typography>
      <p className='page-intro'>A selection of websites, games, and experiments I've built.</p>
      {projectGroups.map(({ title, projects }) => (
        <section className='section' key={title} aria-label={title}>
          <Typography variant='h2' className='section-title'>
            {title}
          </Typography>
          <div className='project-grid'>
            {projects.map((project) => (
              <Project key={project.id} project={project} />
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
