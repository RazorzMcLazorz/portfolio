import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import Switch from '@mui/material/Switch'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { SceneryContext } from '../../../SceneryContext'

const sections = [
  ['workexperience', 'Experience'],
  ['projects', 'Projects'],
  ['languages', 'Languages'],
  ['aboutme', 'About Me'],
  ['resume', 'Resume'],
  ['references', 'References'],
] as const

export default function NavBar() {
  const { scenery, toggleScenery } = useContext(SceneryContext)
  return (
    <header className='site-header' id='page-top' tabIndex={-1}>
      <Link className='brand' to='/' aria-label='Nathaniel P. Young — home'>
        <img
          src={`${import.meta.env.BASE_URL}assets/concept/myLogo.jpeg`}
          alt=''
          width={52}
          height={52}
        />
      </Link>
      <nav aria-label='Main navigation'>
        {sections.map(([id, label]) => (
          <Link key={id} to={`/#${id}`}>
            {label}
          </Link>
        ))}
      </nav>
      <div className='scenery-control'>
        <div className='scenery-switch'>
          <DarkModeOutlinedIcon fontSize='small' />
          <Switch
            checked={scenery === 'sunrise'}
            onChange={toggleScenery}
            slotProps={{ input: { 'aria-label': 'Sunrise theme' } }}
          />
          <WbSunnyOutlinedIcon fontSize='small' />
        </div>
        <span>{scenery === 'sunset' ? 'Sunset' : 'Sunrise'}</span>
      </div>
    </header>
  )
}
