import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

const skills = [
  {
    title: 'TypeScript & JavaScript',
    description:
      'My main tools for building interactive applications. I use TypeScript to make data models and component interfaces explicit, and JavaScript to connect application behavior with the browser.',
  },
  {
    title: 'React',
    description:
      'I specialize in React interfaces built from reusable components. My work includes state management, routing, and connecting frontend experiences to APIs, using both custom components and Material UI.',
  },
  {
    title: 'HTML & CSS',
    description:
      'Semantic markup, responsive layouts, and custom styling are the foundation of my frontend work. I work with CSS and SCSS to build clear interfaces that adapt to different screen sizes.',
  },
  {
    title: 'Bun & Vite',
    description:
      'My current project workflow uses Bun for package management and scripts, and Vite for a fast development server and production builds.',
  },
  {
    title: 'Python',
    description:
      'I learned Python early in my coding journey and used it to prototype games and automate website diagnostics with Selenium. It helped me work through algorithms before translating them to JavaScript.',
  },
  {
    title: 'My Coding Journey',
    description:
      'I attended Bottega from July to October 2018 and began working with RoviTracker that November. My projects range from database-backed websites to browser games, with a continuing focus on frontend development.',
  },
]

export default function Skills() {
  return (
    <>
      <Typography variant='h1' className='page-title'>
        Skills
      </Typography>
      <p className='page-intro'>The tools I use and the experience behind my work.</p>
      <div className='content-grid'>
        {skills.map(({ title, description }) => (
          <Paper component='section' className='panel' key={title} aria-label={title}>
            <Typography variant='h2' className='section-title'>
              {title}
            </Typography>
            <p>{description}</p>
          </Paper>
        ))}
      </div>
    </>
  )
}
