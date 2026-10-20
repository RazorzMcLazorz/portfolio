import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className='hero'>
      <Typography component='p' color='primary'>
        404
      </Typography>
      <Typography variant='h1'>Page not found</Typography>
      <p>That page doesn't exist. Let's get you back to the portfolio.</p>
      <Button component={Link} to='/' variant='contained'>
        Back to home
      </Button>
    </section>
  )
}
