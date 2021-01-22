import React from 'react'
import './FaceRecognition.css'

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className='center ma1'>
      <div className='absolute mt2'>
        <img
          id='inputimage'
          src={imageUrl}
          alt=''
          width='550px'
          height='auto'
        />
        <div
          className='bounding-box'
          style={{
            top: box.topRow,
            right: box.rightCol,
            bottom: box.bottomRow,
            left: box.leftCol
          }}
        />
        <div className="ma2">
          {box.faceName}
        </div>
      </div>
    </div>
  )
}

export default FaceRecognition
