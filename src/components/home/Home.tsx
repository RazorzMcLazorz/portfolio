import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Contributions from '../contributions/Contributions'
import ContactInfo from '../contact/ContactInfo'
import References from '../contact/References'
import ResumeInfo from '../contact/ResumeInfo'
import Projects from '../projects/Projects'
import SkillsOrbit from '../skills/SkillsOrbit'
import AboutMe from './AboutMe'
import WorkExperience from './WorkExperience'

export default function Home() {
  return (
    <>
      <section className='hero' aria-labelledby='home-title'>
        <Typography component='p' className='eyebrow'>
          TypeScript · React · Frontend Developer
        </Typography>
        <Typography variant='h1' id='home-title'>
          Nathaniel Patrick Young
        </Typography>
        <Typography
          component='p'
          sx={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', maxWidth: '34rem' }}>
          Thoughtful interfaces. A little curiosity. A love of building.
        </Typography>
        <div className='actions'>
          <Button component='a' href='#projects' variant='contained'>
            Explore my projects
          </Button>
          <Button component='a' href='#contact' variant='outlined'>
            Get in touch
          </Button>
        </div>
        <IconButton
          component='a'
          href='#workexperience'
          className='scroll-down'
          aria-label='Scroll to work experience'>
          <ArrowDownwardIcon />
        </IconButton>
      </section>
      <WorkExperience />
      <Projects embedded />
      <Contributions />
      <section
        className='landing-section'
        id='languages'
        aria-labelledby='languages-title'
        tabIndex={-1}>
        <p className='eyebrow'>The toolkit</p>
        <Typography variant='h2' id='languages-title' className='section-title'>
          Languages & Technologies
        </Typography>
        <p className='section-intro'>The languages, frameworks, and tools behind my work.</p>
        <SkillsOrbit />
      </section>
      <AboutMe />
      <section
        className='landing-section'
        id='contact'
        aria-labelledby='contact-title'
        tabIndex={-1}>
        <p className='eyebrow'>Let's connect</p>
        <Typography variant='h2' id='contact-title' className='section-title'>
          Contact Me
        </Typography>
        <ContactInfo />
      </section>
      <ResumeInfo />
      <section
        className='landing-section'
        id='references'
        aria-labelledby='references-section-title'
        tabIndex={-1}>
        <p className='eyebrow'>People I've worked with</p>
        <Typography variant='h2' id='references-section-title' className='section-title'>
          References
        </Typography>
        <References />
      </section>
    </>
  )
}
