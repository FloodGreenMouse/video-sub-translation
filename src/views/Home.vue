<template lang="pug">
.page.home
  .flex.j-center
    videoPlayer
  // vSubtitles(@ready="subtitlesReady" )
</template>

<script>
import videoPlayer from '../components/video-player'

export default {
  components: {
    videoPlayer
  },
  data () {
    return {
      showVideo: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .page.home {
    background-color: #303030;
    height: 100vh;
  }
</style>
