import NavBar from '../common/navBar/NavBar'
import ContactInfo from './ContactInfo'
import ResumeInfo from './ResumeInfo'
import Refferences from './Refferences'
import './styles.scss'

function Contact() {
  return (
    <div id='contact'>
      <NavBar />
      <div className='contactLeftSide'>
        <ContactInfo />
        <ResumeInfo />
      </div>
      <div className='contactRightSide'>
        <Refferences />
      </div>
    </div>
  )
}
export default Contact
