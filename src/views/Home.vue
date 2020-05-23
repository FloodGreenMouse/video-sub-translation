<template lang="pug">
.page.home
  .flex.j-center
    videoPlayer(:subtitles="subtitles")
  vConverter(@ready="setSubtitles")
</template>

<script>
import videoPlayer from '../components/video-player'
import vConverter from '../components/converter'

export default {
  components: {
    videoPlayer,
    vConverter
  },
  data () {
    return {
      showVideo: false,
      subtitles: []
    }
  },
  methods: {
    setSubtitles (value) {
      this.subtitles = value
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
