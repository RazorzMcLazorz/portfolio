import GitHubIcon from '@mui/icons-material/GitHub'
import FacebookIcon from '@mui/icons-material/Facebook'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

function ContactInfo() {
  return (
    <div className='ContactInfo'>
      <div className={'ContactInfoName'}>My Contact Info</div>
      <div>You can find me at these links</div>
      <div className='MYLinks'>
        <a href='https://github.com/RazorzMcLazorz' target='_blank' rel='noreferrer'>
          <GitHubIcon />
        </a>
        <a href='https://www.facebook.com/RazorzMcLazorz' target='_blank' rel='noreferrer'>
          <FacebookIcon />
        </a>
        <a href='https://www.linkedin.com/in/nate-p-young/' target='_blank' rel='noreferrer'>
          <LinkedInIcon />
        </a>
      </div>
      <div>or</div>
      <div className='MYLinksTop'>message me at:</div>

      <div className='MYLinksTop3' id='email'>
        nateyoungdev@gmail.com
      </div>
    </div>
  )
}

export default ContactInfo
