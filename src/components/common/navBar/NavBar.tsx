import GitHubIcon from '@mui/icons-material/GitHub'
import IconButton from '@mui/material/IconButton'
import { Link, NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <header className='site-header'>
      <Link className='brand' to='/' aria-label='Nathaniel P. Young — home'>
        <img src={`${import.meta.env.BASE_URL}favicon.ico`} alt='' width={40} height={40} />
        <span>Nate Young</span>
      </Link>
      <nav aria-label='Main navigation'>
        <NavLink to='/' end>
          Home
        </NavLink>
        <NavLink to='/projects'>Projects</NavLink>
        <NavLink to='/skills'>Skills</NavLink>
        <NavLink to='/contact'>Contact</NavLink>
      </nav>
      <IconButton
        component='a'
        href='https://github.com/RazorzMcLazorz'
        target='_blank'
        rel='noopener noreferrer'
        aria-label='Nate on GitHub (opens in a new tab)'
        color='primary'>
        <GitHubIcon />
      </IconButton>
    </header>
  )
}
