import { Component } from 'react'
import { Link } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import './styles.scss'

class NavBar extends Component {
  render() {
    return (
      <div id='NavBar'>
        <Link className='NavBarBack' to='/'>
          <ArrowBackIosNewIcon />
        </Link>
      </div>
    )
  }
}

export default NavBar
