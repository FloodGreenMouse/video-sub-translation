<template lang="pug">
  .subtitle-component(
    @mouseenter="pauseVideo(true)"
    @mouseleave="pauseVideo(false)"
    :style="{'bottom': `${showControls ? '70px' : '20px'} `}")
    translateWindow(:currentText="currentText")
</template>

<script>
import translateWindow from './translate-window'

export default {
  name: 'subtitle-component',
  components: {
    translateWindow
  },
  props: {
    subtitles: {
      type: Array,
      default: () => []
    },
    currentTime: {
      type: Number,
      default: 0
    },
    showControls: Boolean
  },
  data () {
    return {
      textData: '',
      currentText: []
    }
  },
  watch: {
    currentTime () {
      this.getCurrentText()
    }
  },
  methods: {
    getCurrentText () {
      const currentSubtitle = this.subtitles.find(item => {
        return item.start <= this.currentTime && item.end >= this.currentTime
      })
      if (currentSubtitle) {
        this.textData = currentSubtitle.text
        this.splitCurrentText()
      } else {
        this.textData = ''
      }
    },
    splitCurrentText () {
      const content = document.createElement('div')
      content.innerHTML = this.textData
      const nodesArray = Array.from(content.childNodes)
      const stringsArray = []
      nodesArray.forEach(item => {
        stringsArray.push(item.data || item.innerText)
      })
      const spansArray = []
      stringsArray.forEach(item => {
        const words = item.split(' ')
        words.forEach((word, i) => {
          if (word.trim().length > 0) {
            if (i === words.length - 1) {
              word = word.trim() + '\n'
            } else {
              word = word.trim() + ' '
            }
            spansArray.push(word)
          }
        })
      })
      this.currentText = spansArray
    },
    pauseVideo (value) {
      this.$emit('pauseVideo', value)
    }
  }
}
</script>

<style lang="scss" scoped>
  .subtitle-component {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    max-width: 840px;
    width: 100%;
    bottom: 60px;
    padding-bottom: 20px;
    padding-top: 20px;
    display: flex;
    justify-content: center;
    border-radius: 4px;
    transition: bottom 0.3s ease, background-color 0.2s ease;
    background-color: transparent;
    &:hover {
      background-color: rgba(#9dc2ff, 0.3);
    }
  }
</style>
