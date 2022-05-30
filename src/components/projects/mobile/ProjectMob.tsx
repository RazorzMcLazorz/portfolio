import NavBar from '../../common/navBar/NavBar'
import { projectInfo } from '../constants'
import { buildMobProject } from '../utils'
import './styles.scss'

function ProjectMob() {
  return (
    <div>
      <NavBar />
      <div id='mobProject'>
        <div id='mobAllProjects'>
          {projectInfo.bestProject && (
            <div className='mobProjectBox'>
              <div className='mobProjectBoxHeader'>Best Project</div>
              <div className='mobProjectBoxInformation'>
                {projectInfo.bestProject.map((project, key) => (
                  <div key={key}> {buildMobProject(project)}</div>
                ))}
              </div>
            </div>
          )}

          {projectInfo.currentProject && (
            <div className='mobProjectBox'>
              <div className='mobProjectBoxHeader'>Current Projects</div>
              {projectInfo.currentProject.map((project, key) => (
                <div key={key}> {buildMobProject(project)}</div>
              ))}
            </div>
          )}

          {projectInfo.pastOtherProject && (
            <div className='mobProjectBox'>
              <div className='mobProjectBoxHeader'>Past Projects</div>
              {projectInfo.pastOtherProject.map((project, key) => (
                <div key={key}> {buildMobProject(project)}</div>
              ))}
            </div>
          )}

          {projectInfo.pastPersonalProject && (
            <div className='mobProjectBox'>
              <div className='mobProjectBoxHeader'>Past Personal Projects</div>
              {projectInfo.pastPersonalProject.map((project, key) => (
                <div key={key}> {buildMobProject(project)}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectMob
