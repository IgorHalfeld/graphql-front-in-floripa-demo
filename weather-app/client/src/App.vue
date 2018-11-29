<template>
  <div class="container">
    <div class="loading" v-if="$apollo.loading">
      <div class="loading-spinner"></div>
    </div>

    <h1 class="title">Weather App</h1>
    <div class="container-content">
  
      <transition name="appear">
        <div class="content-temp" v-if="!$apollo.loading">
          <span class="content-temp-current">{{ forecast.currentTemp }} ºC</span>
          <div class="content-temp-minmax">
            <p>Min: {{ forecast.minTemp }} ºC</p>
            <p>Max: {{ forecast.maxTemp }} ºC</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

const getCoordinates = navigator => new Promise(resolve => {
  navigator.geolocation.getCurrentPosition(position => {
    const { coords } = position
    resolve({ lat: coords.latitude, lng: coords.longitude })
  })
})

export default {
  name: 'App',
  apollo: {
    forecast: {
      query: gql`query forecast($lat: Float!, $lng: Float!) {
        forecast (lat: $lat, lng: $lng) {
          currentTemp,
          minTemp,
          maxTemp
        }
      }`,
      variables () {
        return this.coords
      }
    }
  },
  data: () => ({
    coords: {
      lat: '',
      lng: ''
    },
    isLoading: false,
    forecast: {}
  }),
  async created () {
    this.coords = await getCoordinates(window.navigator)
    this.$apollo.queries.forecast.refetch()
  }
}
</script>

<style src="./style.css"></style>