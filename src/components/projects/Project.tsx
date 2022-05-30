export const project = (project: any) => {
  return (
    <div className='project'>
      <div className='project-title'>{project.title[project]}</div>
      <div className='project-details'>
        <div className='project-description'>{project.summary[project]}</div>
        <div className='project-buttons'>
          {project.link[project] && (
            <a
              className='project-button-component'
              onMouseOver={() => console.log('mouseover')}
              target='_blank'
              href={project.link[project]}>
              <i className='fas fa-pager'></i>
            </a>
          )}
          {project.dedicate[project] && (
            <a className='project-button-component' href={project.dedicate[project]}>
              <i className='far fa-newspaper'></i>
            </a>
          )}
          {project.github[project] && (
            <a className='project-button-component' target='_blank' href={project.github[project]}>
              <i className='fab fa-github'></i>
            </a>
          )}
        </div>
      </div>
      <div className='project-date'>{project.date[project]}</div>
    </div>
  )
}
