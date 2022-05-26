import { Component } from 'react'
import { Link } from 'react-router-dom'

class NavBar extends Component {
  render() {
    return (
      <div id='NavBar'>
        <Link className='NavBarBack' to='/'>
          <i className='fas fa-chevron-left'></i>
        </Link>
        <div></div>
      </div>
    )
  }
}

export default NavBar
