import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import NameSignedComponent from '../common/nameSigned/NameSignedComponent'
import { goals } from './constants'

export default function AboutMe() {
  return (
    <section className='landing-section' id='aboutme' aria-labelledby='about-title' tabIndex={-1}>
      <p className='eyebrow'>Beyond the code</p>
      <Typography variant='h2' id='about-title' className='section-title'>
        About Me
      </Typography>
      <div className='about-grid'>
        <Paper className='panel about-copy'>
          <Typography variant='h3'>A developer who loves the process.</Typography>
          <p>
            What started as a coding hobby grew into a passion for frontend development. From
            state-driven games to database-backed websites, I enjoy turning ideas into interfaces
            people can actually use.
          </p>
          <p>{goals.myGoal}</p>
          <p>{goals.simple}</p>
          <Typography variant='h3'>Education</Typography>
          <p>
            Bottega — JavaScript and Python coding boot camp.
            <br />
            Utah Valley University — computer science studies.
          </p>
          <NameSignedComponent />
        </Paper>
        <figure className='portrait'>
          <img
            src={`${import.meta.env.BASE_URL}assets/concept/vacationBarPicture.jpeg`}
            alt='Nate enjoying a vacation'
            width={1118}
            height={2048}
            loading='lazy'
          />
          <figcaption>A little time away from the keyboard.</figcaption>
        </figure>
      </div>
    </section>
  )
}
