import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import Button from '@mui/material/Button'
import { useState, type CSSProperties } from 'react'
import { technologies } from '../home/constants'

export default function SkillsOrbit() {
  const [paused, setPaused] = useState(false)
  const rings = [technologies.slice(0, 9), technologies.slice(9)]

  return (
    <div className={`skills-orbit${paused ? ' is-paused' : ''}`}>
      <div className='orbit-stage'>
        <div className='orbit-center' aria-hidden='true'>
          &lt;/&gt;<span>Always learning</span>
        </div>
        {rings.map((ring, index) => (
          <ul
            className={`orbit-ring ${index === 0 ? 'orbit-outer' : 'orbit-inner'}`}
            key={index}
            aria-label={index === 0 ? 'Languages and frameworks' : 'Tools and platforms'}>
            {ring.map(({ name, url }, item) => (
              <li
                className='orbit-item'
                key={name}
                style={{ '--angle': `${(item * 360) / ring.length}deg` } as CSSProperties}>
                <a href={url} target='_blank' rel='noopener noreferrer'>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <Button
        className='orbit-toggle'
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
        startIcon={paused ? <PlayArrowIcon /> : <PauseIcon />}>
        {paused ? 'Resume skills animation' : 'Pause skills animation'}
      </Button>
    </div>
  )
}
