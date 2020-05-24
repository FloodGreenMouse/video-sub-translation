<template lang="pug">
.video-player-component(
  :class="{'fullscreen': fullscreenMode === true}"
  @click="toggleFocus"
  @mouseover="showControls = true"
  @mouseleave="showControls = false")
  video(
    src="@/files/video.mp4"
    ref="video"
    @dblclick="toggleFullscreen"
    @click="togglePlaying"
    :class="{'fullscreen': fullscreenMode === true}"
    preload="auto")
  transition(name="fade" :duration="200")
    .control-bar.flex.j-between(
      v-if="showControls || !isPlaying"
      @mouseenter="controlsHovered = true"
      @mouseleave="controlsHovered = false")
      .group
        button.play(@click="togglePlaying")
          transition(
            name="fade"
            mode="out-in"
            :duration="120")
            iconPlay(v-if="!isPlaying" :key="0")
            iconPause(v-if="isPlaying" :key="1")
        .element.volume
          button(@click="offVolume")
            transition(
              name="fadeUp"
              mode="out-in"
              :duration="100")
              iconSpeaker(v-if="currentVolume !== 0" :key="0")
              iconSpeakerOff(v-if="currentVolume === 0" :key="1")
          .range(ref="volume")
            rangeVolume(
              @setvolume="setVolume"
              @change="checkVolumeChange"
              :currentVolume="currentVolume")
      .group.range-progress
        rangeProgress(
          @setprogress="setVideoProgress"
          :duration="videoDuration"
          :currentTime="currentVideoTime")
      .group
        span.timer(v-if="videoDuration !== 0") {{ getVideoTimer }} / {{ getVideoFullTIme }}
        button.show-subtitles(@click="toggleSubtitles")
          iconSubtitles
        button(@click="toggleFullscreen")
          iconFullscreen
  transition(name="fadeUp" :duration="150")
    vSubtitles(
      v-show="showSubtitles"
      :subtitles="subtitles"
      :currentTime="currentVideoTime"
      :showControls="showControls || !isPlaying"
      @pauseVideo="pauseVideo")
</template>

<script>
import iconPlay from '@/components/icons/play'
import iconPause from '@/components/icons/pause'
import iconSpeaker from '@/components/icons/speaker'
import iconSpeakerOff from '@/components/icons/speaker-off'
import iconSubtitles from '@/components/icons/subtitles'
import iconFullscreen from '@/components/icons/fullscreen'
import rangeVolume from './range-volume'
import rangeProgress from './range-progress'
import vSubtitles from '../subtitles'

export default {
  name: 'video-player-component',
  components: {
    iconPlay,
    iconPause,
    iconSpeaker,
    iconSpeakerOff,
    iconSubtitles,
    iconFullscreen,
    rangeVolume,
    rangeProgress,
    vSubtitles
  },
  props: {
    subtitles: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isPlaying: false,
      isPausedByButton: false,
      isVolumeOff: false,
      isVolumeChanging: false,
      fullscreenMode: false,
      controlsHovered: false,
      showControls: true,
      isWindowFocused: false,
      showSubtitles: true,
      hideControlsTimer: null,
      lastVolume: 1,
      currentVolume: 1,
      videoWidth: 0,
      videoDuration: 0,
      currentVideoTime: 0
    }
  },
  computed: {
    getVideoTimer () {
      const formatTime = (time) => {
        if (time < 10) {
          return `0${time}`
        }
        return time
      }
      let hours = formatTime(Math.round(this.videoDuration / 3600))
      let minutes = formatTime(Math.round(this.currentVideoTime / 60))
      let seconds = formatTime(Math.round(this.currentVideoTime % 60))
      if (hours > 0) {
        return `${hours}:${minutes}:${seconds}`
      }
      return `${minutes}:${seconds}`
    },
    getVideoFullTIme () {
      const hours = Math.round(this.videoDuration / 3600)
      const minutes = Math.round(this.videoDuration / 60)
      const seconds = Math.round(this.videoDuration % 60)
      if (hours > 0) {
        return `${hours}:${minutes}:${seconds}`
      }
      return `${minutes}:${seconds}`
    }
  },
  methods: {
    checkVolumeChange (value) {
      if (value === true) {
        this.$refs.volume.style.width = '130px'
      } else {
        this.$refs.volume.style.width = null
      }
    },
    toggleSubtitles () {
      this.showSubtitles ? this.showSubtitles = false : this.showSubtitles = true
    },
    toggleFocus () {
      this.isWindowFocused = true
    },
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
      const video = this.$refs.video
      if (this.isPlaying) {
        video.pause()
        this.isPausedByButton = true
      } else {
        video.play()
        this.isPausedByButton = false
      }
      this.isPlaying = !this.isPlaying
    },
    pauseVideo (value) {
      const video = this.$refs.video
      if (!this.isPausedByButton) {
        if (value) {
          video.pause()
        } else {
          video.play()
        }
        this.isPlaying = !value
      }
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
    },
    exitFullscreenOnEscape () {
      if (this.fullscreenMode && !window.screenTop && !window.screenY) {
        this.fullscreenMode = false
      }
    },
    getCurrentVideoTime () {
      this.currentVideoTime = this.$refs.video.currentTime
    },
    getVideoDuration () {
      this.videoDuration = this.$refs.video.duration
    },
    setVideoProgress (value) {
      const video = this.$refs.video
      video.currentTime = video.duration * (value / 100)
    }
  },
  mounted () {
    this.$refs.video.addEventListener('loadedmetadata', this.getVideoDuration)
    document.onfullscreenchange = () => {
      this.exitFullscreenOnEscape()
    }
    this.$refs.video.addEventListener('timeupdate', this.getCurrentVideoTime)
    this.$el.addEventListener('mousemove', this.toggleControls)
  },
  beforeDestroy () {
    this.$refs.video.removeEventListener('loadedmetadata', this.getVideoDuration)
    document.onfullscreenchange = null
    this.$refs.video.removeEventListener('timeupdate', this.getCurrentVideoTime)
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
        &.range-progress {
          width: 100%;
          justify-content: center;
        }
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
        justify-content: flex-start;
        padding-right: 10px;
        width: 130px;
        svg {
          flex-shrink: 0;
        }
        &:hover {
          .range {
            width: 130px;
          }
        }
        .range {
          position: absolute;
          left: 30px;
          top: 0;
          bottom: 0;
          margin: auto;
          width: 0;
          overflow: hidden;
          transition: width 0.2s ease;
        }
      }
      .timer {
        display: block;
        font-size: 16px;
        color: #ffffff;
        margin-right: 20px;
        white-space: nowrap;
      }
      .show-subtitles {
        margin-right: 20px;
      }
    }
  }
</style>
