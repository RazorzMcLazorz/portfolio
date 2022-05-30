import NavBar from '../../common/navBar/NavBar'
import ContactInfo from '../ContactInfo'
import ResumeInfo from '../ResumeInfo'
import Refferences from '../Refferences'
import '../styles.scss'

function ContactMob() {
  return (
    <div id='contactMob'>
      <NavBar />
      <ContactInfo isMobile />
      <Refferences isMobile />
      <ResumeInfo isMobile />
    </div>
  )
}

export default ContactMob
