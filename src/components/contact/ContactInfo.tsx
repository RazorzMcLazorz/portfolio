import FacebookIcon from '@mui/icons-material/Facebook'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

const links = [
  { label: 'GitHub', href: 'https://github.com/RazorzMcLazorz', Icon: GitHubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nate-p-young/', Icon: LinkedInIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/RazorzMcLazorz', Icon: FacebookIcon },
]

export default function ContactInfo() {
  return (
    <Paper component='section' className='panel' aria-labelledby='contact-info-title'>
      <Typography variant='h2' id='contact-info-title' className='section-title'>
        My Contact Info
      </Typography>
      <p>Find me online or send me an email.</p>
      <div className='social-links'>
        {links.map(({ label, href, Icon }) => (
          <Button
            component='a'
            key={label}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            startIcon={<Icon />}
            aria-label={`${label} (opens in a new tab)`}>
            {label}
          </Button>
        ))}
      </div>
      <a className='email-link' href='mailto:nateyoungdev@gmail.com'>
        nateyoungdev@gmail.com
      </a>
    </Paper>
  )
}
