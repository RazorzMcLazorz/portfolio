import NavBar from '../common/navBar/NavBar'
import { projectInfo } from './constants'
import { buildProject } from './utils'
import './styles.scss'

function Projects() {
  return (
    <div>
      <NavBar />
      <div id='projectWall'>
        <div id='allProjects'>
          {projectInfo.bestProject && (
            <div className='projectBox'>
              <div id='bestProject' className='projectBoxHeader'>
                Best Project
              </div>
              {projectInfo.bestProject.map((project, key) => (
                <div key={key}> {buildProject(project)}</div>
              ))}
            </div>
          )}

          {projectInfo.currentProject && (
            <div className='projectBox'>
              <div id='currentProject' className='projectBoxHeader'>
                Current Projects
              </div>
              {projectInfo.currentProject.map((project, key) => (
                <div key={key}> {buildProject(project)}</div>
              ))}
            </div>
          )}

          {projectInfo.pastOtherProject && (
            <div className='projectBox'>
              <div id='pastProject' className='projectBoxHeader'>
                Past Projects
              </div>
              {projectInfo.pastOtherProject.map((project, key) => (
                <div key={key}> {buildProject(project)}</div>
              ))}
            </div>
          )}

          {projectInfo.pastPersonalProject && (
            <div className='projectBox'>
              <div className='projectBoxHeader'>Past Personal Projects</div>
              {projectInfo.pastPersonalProject.map((project, key) => (
                <div key={key}> {buildProject(project)}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Projects
