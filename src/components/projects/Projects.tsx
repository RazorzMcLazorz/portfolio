import './styles.scss'

function Home() {
  return (
    <div>
      <NavBar />
      <div id='projectWall'>
        <div id='allProjects'>
          {this.props.bestProject && (
            <div className='projectBox'>
              <div id='bestProject' className='projectBoxHeader'>
                Best Project
              </div>
              {this.props.bestProject.map((project, key) => (
                <div key={key}> {this.project(project)}</div>
              ))}
            </div>
          )}

          {this.props.currentProject && (
            <div className='projectBox'>
              <div id='currentProject' className='projectBoxHeader'>
                Current Projects
              </div>
              {this.props.currentProject.map((project, key) => (
                <div key={key}> {this.project(project)}</div>
              ))}
            </div>
          )}

          {this.props.pastOtherProject && (
            <div className='projectBox'>
              <div id='pastProject' className='projectBoxHeader'>
                Past Projects
              </div>
              {this.props.pastOtherProject.map((project, key) => (
                <div key={key}> {this.project(project)}</div>
              ))}
            </div>
          )}

          {this.props.pastPersonalProject && (
            <div className='projectBox'>
              <div className='projectBoxHeader'>Past Personal Projects</div>
              {this.props.pastPersonalProject.map((project, key) => (
                <div key={key}> {this.project(project)}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
