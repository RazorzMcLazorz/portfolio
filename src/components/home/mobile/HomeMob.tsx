import { Link } from 'react-router-dom'
import NameSignedComponent from '../../common/nameSigned/NameSignedComponent'
import Footer from './Footer'
import './styles.scss'

function HomeMob() {
  return (
    <div id='homeMob'>
      <div id='mobile'>
        <div id='mobileName'>
          <h4 className='mobHomeName'>
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
          </h4>
        </div>
        <h6>Frontend Developer</h6>
        <NameSignedComponent />
        <div id='mobileLogo'>
          <img src='/favicon.ico' alt='mylogo' />
        </div>
        <div id='mobileLinks'>
          <Link to='/projects' className='mobileLinkButtons'>
            Projects
          </Link>
          <Link to='/skills' className='mobileLinkButtons'>
            My Skills
          </Link>
          <Link to='/contact' className='mobileLinkButtons'>
            Contact Me
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HomeMob
