import { Component } from 'react'
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import './styles.scss'

class NavBar extends Component {
  render() {
    return (
      <div id='NavBar'>
        <Link className='NavBarBack' to='/'>
          <ArrowBackIcon className='NavBarBackIcon' />
        </Link>
      </div>
    )
  }
}

export default NavBar
