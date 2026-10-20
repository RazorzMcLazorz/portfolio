import DownloadIcon from '@mui/icons-material/Download'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

const resumeUrl = `${import.meta.env.BASE_URL}assets/Resume.pdf`

export default function ResumeInfo() {
  return (
    <Paper
      component='section'
      className='panel landing-section'
      id='resume'
      aria-labelledby='resume-title'
      tabIndex={-1}>
      <Typography variant='h2' id='resume-title' className='section-title'>
        Résumé
      </Typography>
      <p>Open the PDF in your browser to view or print it, or download a copy.</p>
      <div className='actions'>
        <Button
          component='a'
          href={resumeUrl}
          target='_blank'
          rel='noopener noreferrer'
          variant='outlined'
          endIcon={<OpenInNewIcon />}>
          Open résumé (PDF)
        </Button>
        <Button
          component='a'
          href={resumeUrl}
          download='Nathaniel-Young-Resume.pdf'
          startIcon={<DownloadIcon />}>
          Download résumé
        </Button>
      </div>
      <object
        className='resume-preview'
        data={resumeUrl}
        type='application/pdf'
        aria-label='Résumé preview'>
        <p>
          Your browser cannot display this PDF. <a href={resumeUrl}>Open the résumé instead.</a>
        </p>
      </object>
    </Paper>
  )
}
