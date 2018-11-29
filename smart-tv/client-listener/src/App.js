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
                justifyContent: !this.state.images.length ? 'center' : 'flex-start',
                alignItems: !this.state.images.length ? 'center' : 'flex-start'
              }}
              className="container">
              <h1 className="container-title">Imagens irão aparecer aqui...</h1>
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
