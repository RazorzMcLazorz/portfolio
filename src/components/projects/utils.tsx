// @ts-nocheck
import GitHubIcon from '@mui/icons-material/GitHub'
import WebIcon from '@mui/icons-material/Web'
import { projectInfo } from './constants'

export const buildProject = (project: any) => {
  return (
    <div className='project'>
      <div className='project-title'>{projectInfo.projects.title[project]}</div>
      <div className='project-details'>
        <div className='project-description'>{projectInfo.projects.summary[project]}</div>
        <div className='project-buttons'>
          {projectInfo.projects.link[project] && (
            <a
              className='project-button-component'
              onMouseOver={() => console.log('mouseover')}
              target='_blank'
              href={projectInfo.projects.link[project]}
              rel='noreferrer'>
              <WebIcon className='projectButtonComponentIcon' />
            </a>
          )}
          {projectInfo.projects.dedicate[project] && (
            <a className='project-button-component' href={projectInfo.projects.dedicate[project]}>
              <WebIcon className='projectButtonComponentIcon' />
            </a>
          )}
          {projectInfo.projects.github[project] && (
            <a
              className='project-button-component'
              target='_blank'
              href={projectInfo.projects.github[project]}
              rel='noreferrer'>
              <GitHubIcon className='projectButtonComponentIcon' />
            </a>
          )}
        </div>
      </div>
      <div className='project-date'>{projectInfo.projects.date[project]}</div>
    </div>
  )
}

export const buildMobProject = (project: any) => {
  return (
    <div className='mobProject-box'>
      <div className='mobProject-title'>{projectInfo.projects.title[project]}</div>
      <div className='mobProject-details'>
        <div className='mobProject-description'>{projectInfo.projects.summary[project]}</div>
        <div className='mobProject-buttons'>
          {projectInfo.projects.link[project] && (
            <a
              className='mobProject-button-component'
              onMouseOver={() => console.log('mouseover')}
              target='_blank'
              href={projectInfo.projects.link[project]}
              rel='noreferrer'>
              <i className='fas fa-pager'></i>
            </a>
          )}
          {projectInfo.projects.dedicate[project] && (
            <a
              className='mobProject-button-component'
              href={projectInfo.projects.dedicate[project]}>
              <i className='far fa-newspaper'></i>
            </a>
          )}
          {projectInfo.projects.github[project] && (
            <a
              className='mobProject-button-component'
              target='_blank'
              href={projectInfo.projects.github[project]}
              rel='noreferrer'>
              <i className='fab fa-github'></i>
            </a>
          )}
        </div>
      </div>
      <div className='mobProject-date'>{projectInfo.projects.date[project]}</div>
    </div>
  )
}
