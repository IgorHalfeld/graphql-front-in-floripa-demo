import React from 'react'
import PropTypes from 'prop-types'

const PhotoViewer = props => props.images.map((image, index) => (
  <img
    className="container-image"
    alt="Something"
    src={image}
    key={index} />
))

PhotoViewer.protoTypes = {
  images: PropTypes.array
}

export default PhotoViewer