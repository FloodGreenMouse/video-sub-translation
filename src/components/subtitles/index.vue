<template lang="pug">
  .subtitle-component(:style="{'bottom': `${showControls ? '70px' : '20px'} `}")
    translateWindow(:currentText="currentText" @pauseVideo="pauseVideo")
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
        words.forEach(word => {
          word = word + ' '
          spansArray.push(word)
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
    bottom: 60px;
    display: flex;
    justify-content: center;
    width: 100%;
    transition: bottom 0.3s ease;
  }
</style>
