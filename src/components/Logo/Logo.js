import React from 'react'
import Tilty from 'react-tilty'
import brain from './brain.png';
import './Logo.css';


const Logo = () => {
  return (
    <div className='ma4 mt0'>
      <Tilty
        className='Tilt br2 shadow-2'
        options={{ max: 55 }}
        style={{ height: 150, width: 150 }}
      >
        <div className='Tilt-inner pa3'>
            <img style={{paddingTop:'5px'}} src={brain} alt="brain"/>
        </div>
      </Tilty>
    </div>
  )
}

export default Logo
