import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

const references = [
  {
    name: 'Buck Brady',
    affiliation: 'CTO at RoviTracker',
    phone: '385-207-6257',
    email: 'bbrady145@gmail.com',
  },
  {
    name: 'Taylor Millar',
    affiliation: 'Backend Developer at RoviTracker',
    phone: '801-691-4362',
    email: 'millartaylor94@gmail.com',
  },
]

export default function References() {
  return (
    <Paper component='section' className='panel' aria-labelledby='references-title'>
      <Typography variant='h2' id='references-title' className='section-title'>
        References
      </Typography>
      {references.map(({ name, affiliation, phone, email }) => (
        <address className='reference' key={email}>
          <strong>{name}</strong>
          <span>{affiliation}</span>
          <a href={`tel:${phone.replaceAll('-', '')}`}>{phone}</a>
          <a href={`mailto:${email}`}>{email}</a>
        </address>
      ))}
    </Paper>
  )
}
