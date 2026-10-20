import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import NameSignedComponent from '../common/nameSigned/NameSignedComponent'
import { goals, technologies } from './constants'

export default function Home() {
  return (
    <>
      <section className='hero' aria-labelledby='home-title'>
        <Typography component='p' className='eyebrow' color='primary'>
          Frontend Developer
        </Typography>
        <Typography variant='h1' id='home-title'>
          Nathaniel P. Young
        </Typography>
        <Typography
          component='p'
          color='text.secondary'
          sx={{ fontSize: '1.25rem', maxWidth: '38rem' }}>
          Building thoughtful interfaces with TypeScript and React.
        </Typography>
        <div className='actions'>
          <Button
            component={Link}
            to='/projects'
            variant='contained'
            endIcon={<ArrowForwardIcon />}>
            Explore my projects
          </Button>
          <Button component={Link} to='/contact' variant='outlined'>
            Get in touch
          </Button>
        </div>
        <NameSignedComponent />
      </section>
      <div className='content-grid'>
        <Paper component='section' className='panel' aria-labelledby='goal-title'>
          <Typography variant='h2' id='goal-title' className='section-title'>
            My Goal
          </Typography>
          {Object.values(goals).map((goal) => (
            <p key={goal}>{goal}</p>
          ))}
        </Paper>
        <Paper component='section' className='panel' aria-labelledby='education-title'>
          <Typography variant='h2' id='education-title' className='section-title'>
            Education
          </Typography>
          <Typography variant='h3'>Bottega</Typography>
          <p>Coding boot camp focused on JavaScript and Python.</p>
          <Typography variant='h3'>Utah Valley University</Typography>
          <p>Computer science studies.</p>
        </Paper>
      </div>
      <section className='section' aria-labelledby='technology-title'>
        <Typography variant='h2' id='technology-title' className='section-title'>
          Technologies I Work With
        </Typography>
        <div className='technology-list'>
          {technologies.map(({ name, url }) => (
            <Chip
              key={name}
              label={name}
              component='a'
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              clickable
              variant='outlined'
            />
          ))}
        </div>
      </section>
    </>
  )
}
