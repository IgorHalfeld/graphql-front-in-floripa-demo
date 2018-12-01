import React, { PureComponent } from 'react'
import gql from 'graphql-tag'
import { Subscription } from 'react-apollo'

import Loader from './components/Loader'
import PhotoViewer from './components/PhotoViewer'
import './index.css'

const CAPTURED_IMAGE = gql`
  subscription {
    capturedImage {
      image
    }
  }
`

class App extends PureComponent {

  state = {
    images: []
  }

  handleUpdates = payload => {
    const { subscriptionData: { data } } = payload
    const { capturedImage: { image } } = data
    const images = [...this.state.images, image]
    this.setState(() => ({ images }))
  }


  render () {
    return (
      <Subscription
        onSubscriptionData={this.handleUpdates}
        subscription={CAPTURED_IMAGE}>
        {(data, loading) => {
          
          if (!data) return null;
          if (!this.state.images.length) return (
            <div
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              className="container">
              <span role="img" aria-label="emoji" className="container-title">😘</span>
              <h2 className="container-subtitle">Imagens irão <br /> aparecer aqui...</h2>
            </div>
          )
          return (
            <div className="container">
              <Loader isLoading={loading} />
              <PhotoViewer images={this.state.images} />
            </div>
          )
        }}
      </Subscription>
    )
  }
}

export default App
