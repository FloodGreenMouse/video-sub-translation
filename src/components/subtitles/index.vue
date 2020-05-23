<template lang="pug">
  .subtitle-component(:style="{'bottom': `${showControls ? '70px' : '20px'} `}")
    // input(v-if="showFileInput" type="file" @change="getSubs" ref="file")
    .text.flex.j-center
      div(v-html="currentText")
      span Lorem ipsum dolor sit amet, consectetur adipisicing elit
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'subtitle-component',
  props: {
    videoWidth: {
      type: [String, Number],
      default: 0
    },
    showControls: Boolean
  },
  data () {
    return {
      subtitles: [],
      showFileInput: true,
      currentText: ''
    }
  },
  watch: {
    currentTime () {
      this.getCurrentText()
    }
  },
  computed: {
    ...mapState({
      currentTime: state => state.currentTime
    })
  },
  methods: {
    getCurrentText () {
      this.subtitles.find(item => {
      })
      this.subtitles.forEach(item => {
        if (item.start <= this.currentTime && item.end >= this.currentTime) {
          this.currentText = item.text
        }
      })
    },
    getSubs () {
      const fileToRead = this.$refs.file.files[0]
      const fileExtension = fileToRead.name.split('.').pop()
      const reader = new FileReader()
      reader.addEventListener('loadend', () => {
        const rawSubs = reader.result
        if (fileExtension.toLowerCase() === 'srt') {
          this.parseSrt(rawSubs)
        }
      })
      reader.readAsText(fileToRead)
    },
    parseSrt (rawSubs) {
      rawSubs = rawSubs.trim()
      rawSubs = rawSubs.split(/^\n$/gm)
      rawSubs.forEach((item, i) => {
        if (!item.match(/./gm)) {
          rawSubs.splice(i, 1)
        }
      })
      rawSubs.forEach(item => {
        let lineArray = item.trim()
        lineArray = lineArray.split((/\n/))
        const id = lineArray[0]
        let timing = lineArray[1] || ''
        timing = timing.split(' --> ')
        const start = this.convertSrtTime(timing[0])
        const end = this.convertSrtTime(timing[1])
        let text = lineArray.slice(2)
        text = text.join(' ')
        this.subtitles.push({
          id,
          start,
          end,
          text
        })
      })
      this.showFileInput = false
      this.$emit('ready')
    },
    convertSrtTime (timeString) {
      let splitTime = timeString.split(':')
      splitTime[0] = +splitTime[0]
      splitTime[1] = +splitTime[1]
      const splitSeconds = splitTime[2].split(',')
      splitTime[2] = +splitSeconds[0]
      const seconds = (splitTime[0]) * 60 * 60 + (splitTime[1]) * 60 + (splitTime[2])
      return seconds * 1000 + +splitSeconds[1]
    }
  }
}
</script>

<style lang="scss" scoped>
  .subtitle-component {
    position: absolute;
    bottom: 60px;
    display: flex;
    justify-content: center;
    width: 100%;
    transition: bottom 0.3s ease;
    .text {
      max-width: 850px;
      width: 100%;
      font-size: 32px;
      line-height: 33px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 0 4px #111111;
      -webkit-text-stroke: 1px #111111;
      cursor: default;
    }
  }
</style>
