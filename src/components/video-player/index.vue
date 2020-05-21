<template lang="pug">
.video-player-component(
  :class="{'fullscreen': fullscreenMode === true}"
  @mouseover="showControls = true"
  @mouseleave="showControls = false")
  video(
    src="@/files/video2.mp4#t=43"
    ref="video"
    @dblclick="toggleFullscreen"
    @click="togglePlaying"
    :class="{'fullscreen': fullscreenMode === true}"
    preload="false")
  transition(name="fade" :duration="200")
    .control-bar.flex.j-between(
      v-if="showControls || !isPlaying"
      @mouseenter="controlsHovered = true"
      @mouseleave="controlsHovered = false")
      .group
        button.play(@click="togglePlaying")
          transition(name="fade" mode="out-in" :duration="120")
            iconPlay(v-if="!isPlaying" :key="0")
            iconPause(v-if="isPlaying" :key="1")
        .element.volume
          button(@click="offVolume")
            transition(name="fadeUp" mode="out-in" :duration="100")
              iconSpeaker(v-if="currentVolume !== 0" :key="0")
              iconSpeakerOff(v-if="currentVolume === 0" :key="1")
          .range
            rangeVolume(@setvolume="setVolume" :currentVolume="currentVolume")
      .group
        button(@click="toggleFullscreen")
          iconFullscreen
</template>

<script>
import iconPlay from '@/components/icons/play'
import iconPause from '@/components/icons/pause'
import iconSpeaker from '@/components/icons/speaker'
import iconSpeakerOff from '@/components/icons/speaker-off'
import iconFullscreen from '@/components/icons/fullscreen'
import rangeVolume from './range-volume'

export default {
  name: 'video-player-component',
  components: {
    rangeVolume,
    iconPlay,
    iconPause,
    iconSpeaker,
    iconSpeakerOff,
    iconFullscreen
  },
  data () {
    return {
      isPlaying: false,
      isVolumeOff: false,
      fullscreenMode: false,
      controlsHovered: false,
      showControls: true,
      lastVolume: 1,
      currentVolume: 1,
      hideControlsTimer: null
    }
  },
  methods: {
    setVolume (value) {
      this.$refs.video.volume = value / 100
      this.currentVolume = value / 100
      this.lastVolume = value / 100
    },
    offVolume () {
      if (!this.isVolumeOff) {
        this.currentVolume = 0
        this.$refs.video.volume = 0
        this.isVolumeOff = true
      } else {
        this.isVolumeOff = false
        this.$refs.video.volume = this.lastVolume || 1
        this.currentVolume = this.lastVolume
      }
    },
    togglePlaying () {
      if (this.isPlaying) {
        this.$refs.video.pause()
      } else {
        this.$refs.video.play()
      }
      this.isPlaying = !this.isPlaying
    },
    toggleFullscreen () {
      if (!this.fullscreenMode) {
        this.enterFullscreen()
      } else {
        this.exitFullscreen()
      }
    },
    enterFullscreen () {
      const elem = document.documentElement
      this.fullscreenMode = true
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen()
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen()
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen()
      }
    },
    exitFullscreen () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen()
      }
      this.fullscreenMode = false
    },
    toggleControls () {
      this.showControls = true
      this.$el.style.cursor = null
      clearTimeout(this.hideControlsTimer)
      if (this.fullscreenMode) {
        this.hideControlsTimer = setTimeout(() => {
          if (!this.controlsHovered) {
            this.showControls = false
            this.$el.style.cursor = 'none'
          }
        }, 5000)
      } else {
        this.showControls = true
        this.$el.style.cursor = null
      }
    }
  },
  mounted () {
    document.onfullscreenchange = () => {
      if (this.fullscreenMode && !window.screenTop && !window.screenY) {
        this.fullscreenMode = false
      }
    }
    this.$el.addEventListener('mousemove', this.toggleControls)
    // setInterval(() => {
    //   const currentTime = Math.round(this.$refs.video.currentTime * 1000)
    //   this.$store.dispatch('setCurrentTime', currentTime)
    // }, 1)
  },
  beforeDestroy () {
    this.$el.removeEventListener('mousemove', this.toggleControls)
  }
}
</script>

<style lang="scss">
  .video-player-component {
    .control-bar {
      button {
        @include svg(#ffffff);
      }
      .element {
        @include svg(#ffffff);
      }
    }
  }
</style>

<style lang="scss" scoped>
  .video-player-component {
    position: relative;
    width: 100%;
    height: 480px;
    background-color: #111111;
    &.fullscreen {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #111111;
    }
    video {
      position: absolute;
      left: 0;
      bottom: 0;
      width: calc(100% - 1px);
      height: calc(100% - 1px);
      &.fullscreen {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .control-bar {
      position: absolute;
      display: flex;
      align-items: center;
      left: 10px;
      bottom: 10px;
      width: calc(100% - 20px);
      height: 40px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, .4);
      backdrop-filter: blur(3px);
      padding: 0 15px;
      transition: opacity 0.2s ease;
      .group {
        height: 100%;
        display: flex;
        align-items: center;
      }
      .element {
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: stretch;
        width: 20px;
        cursor: pointer;
        &:hover {
          svg {
            transform: scale(0.95);
          }
        }
        svg {
          transition: transform 0.2s ease;
          width: 20px;
          height: 100%;
        }
      }
      button {
        background-color: transparent;
        border: 0;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        outline: none;
        cursor: pointer;
        &:hover {
          svg {
            transform: scale(0.9);
          }
        }
        svg {
          transition: transform 0.2s ease;
          width: 20px;
          height: 20px;
        }
      }
      .play {
        margin-right: 20px;
      }
      .volume {
        position: relative;
        overflow: hidden;
        justify-content: flex-start;
        transition: width 0.2s ease;
        padding-right: 10px;
        svg {
          flex-shrink: 0;
        }
        &:hover {
          width: 130px;
        }
        .range {
          position: absolute;
          left: 30px;
          top: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }
  }
</style>
