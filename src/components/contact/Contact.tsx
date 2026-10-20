import Typography from '@mui/material/Typography'
import ContactInfo from './ContactInfo'
import References from './References'
import ResumeInfo from './ResumeInfo'

export default function Contact() {
  return (
    <>
      <Typography variant='h1' className='page-title'>
        Contact
      </Typography>
      <p className='page-intro'>Let's talk about what we can build together.</p>
      <div className='content-grid'>
        <ContactInfo />
        <References />
      </div>
      <ResumeInfo />
    </>
  )
}
