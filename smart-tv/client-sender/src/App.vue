<template>
  <div class="container">
    <div class="loading" v-if="$apollo.loading">
      <div class="loading-spinner"></div>
    </div>
    <WebCam
      ref="camera"
      @stopped="logErrors"
      @error="logErrors"
      @cameras="loadCameraIds"
      :deviceId="deviceId"
      :width="screen.innerWidth" 
      :height="screen.innerHeight" />
    <button
      @click="take" 
      class="btn-go">Tirar e enviar</button>
  </div>
</template>

<script>
import { WebCam } from 'vue-web-cam'
import gql from 'graphql-tag'

const SEND_IMAGE = gql`mutation ($base64Image: String!) {
  sendImage(base64: $base64Image) {
    status,
    message
  }
}`

export default {
  name: 'App',
  components: { WebCam },
  data: () => ({
    screen: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    },
    deviceId: null,
  }),
  methods: {
    loadCameraIds (device) {
      this.deviceId = device[0].deviceId
    },
    logErrors (error) {
      console.log('Error', error)
    },
    take () {
      this.$nextTick(async () => {
        try {
          const photo = this.$refs.camera.capture()
          const data = await this.$apollo.mutate({
            mutation: SEND_IMAGE,
            variables: {
              base64Image: photo
            }
          })
          console.log('* Data', data) 
        } catch (error) {
          console.log('Something happen', error)
        }
      })
    }
  }
}
</script>

<style src="./style.css"></style>