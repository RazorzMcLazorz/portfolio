import { Link } from 'react-router-dom'
import './styles.scss'
import NameSignedComponent from '../common/nameSigned/NameSignedComponent'
import { langColLeft, langColRight, website } from './constants'

const languages = (lang: any) => {
  return (
    <a
      target='_blank'
      // @ts-ignore
      href={website[lang]}
      className='homeLanguagesListColumnItem'
      rel='noreferrer'>
      {lang}
    </a>
  )
}

function Home() {
  return (
    <div id='home' className='energyBackground'>
      <div id='homeNav'>
        <Link to='projects' className='homeNavLink'>
          Projects
        </Link>
        <Link to='skills' className='homeNavLink'>
          Skills
        </Link>
        <Link to='contact' className='homeNavLink'>
          Contact
        </Link>
        <a href='https://github.com/RazorzMcLazorz' target='_blank'>
          {/* @ts-ignore */}
          <i class='fab fa-github-square' style={{ fontSize: 40 }}></i>
        </a>
      </div>
      <div id='homeBody'>
        <div className='homeNameBox'>
          <h1 className='homeName'>
            <span>N</span>
            <span>a</span>
            <span>t</span>
            <span>h</span>
            <span>a</span>
            <span>n</span>
            <span>i</span>
            <span>e</span>
            <span>l</span>
            <pre> </pre>
            <span>P</span>
            <span>.</span>
            <pre> </pre>
            <span>Y</span>
            <span>o</span>
            <span>u</span>
            <span>n</span>
            <span>g</span>
          </h1>
          <h5>Frontend Developer</h5>
        </div>
        <div className='homeGoal'>
          <div className='homeGoalName'>My Goal</div>
          <div className='homeGoalBody'>
            I want to be a vital team member in your company, that's why I constantly have new
            projects to work on all the time testing myself on new languages, Programing styles, and
            messing with new technologies, and always reading up to the latest in tech news. I have
            experience in being a frontend developer for 3+ years now, and currently, I'm a frontend
            developer at Rovitracker and work on the critical frontend projects there. I love
            react.js with a passion and it brings me joy to build projects in this framework.
          </div>
          <div className='homeGoalBody'>
            I believe in simplicity to the user interface, but displaying all information to those
            users with out cluttering there screen.
          </div>
          <div className='homeGoalBody'>
            This goal can never end as every project can spark new ideas and better ways to improve
            the user interface.
          </div>
          <div className='homeGoalName'>My Education</div>
          <div className='homeGoalBody'>
            Bottega is the coding boot camp i went to learn javascript and python.
          </div>
          <div className='homeGoalBody'>
            UVU is the school I'm currently in and working towards a bachelors degree in computer
            science.
          </div>
        </div>
        <div className='homeLanguages'>
          <div className='homeLanguagesName'>Languages I Know</div>
          <div className='homeLanguagesList'>
            <div className='homeLanguagesListColumn'>
              {langColLeft.map((project, key) => (
                <div className='homeLanguagesListColumnItem' key={key}>
                  {languages(project)}
                </div>
              ))}
            </div>
            <div className='homeLanguagesListColumn'>
              {langColRight.map((project, key) => (
                <div className='homeLanguagesListColumnItem' key={key}>
                  {languages(project)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div id='homeRightSide'>
        <NameSignedComponent />
        <a href='/contact'>
          <img src='/favicon.ico' />
        </a>
      </div>
    </div>
  )
}

export default Home
