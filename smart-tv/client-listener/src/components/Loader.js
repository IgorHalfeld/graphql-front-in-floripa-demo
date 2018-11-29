import React from 'react'

export default props => props.isLoading
  ? (
      <div class="loading">
        <div class="loading-spinner"></div>
      </div>
    )
  : null