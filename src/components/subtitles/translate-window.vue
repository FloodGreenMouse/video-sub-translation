<template lang="pug">
  .translate-window-component
    transition(name="fadeUp" :duration="100")
      .window.flex.column.center(v-show="showWindow" ref="translateWindow")
        .preloader(v-if="isLoading")
          vPreloader
        .content(v-if="hasTranslation")
          .head
            span {{ currentWord }}
            sup.pos &nbsp; {{ [currentPos] }}
          .transcription
            span {{ [currentTranscription] }}
          .translation
            span {{ currentTranslation }}
        .no-translation(v-if="!hasTranslation")
          span Слово не найдено
    .text.flex.j-center
      span(
        v-for="(word, i) in currentText"
        :key="i"
        @mouseenter="getTranslate($event.target, word)"
        @mouseleave="closeTranslate")
        pre {{ word }}
</template>

<script>
import vPreloader from './preloader'

export default {
  name: 'translate-window-component',
  components: {
    vPreloader
  },
  props: {
    currentText: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showWindow: false,
      isLoading: false,
      currentWord: '',
      currentPos: '',
      currentTranscription: '',
      currentTranslation: '',
      hasTranslation: false,
      timer: null
    }
  },
  methods: {
    getTranslate (target, word) {
      this.isLoading = true
      this.$emit('pauseVideo', true)
      this.resetTranslation()
      let currentWord = word.replace(/\W/g, '')
      currentWord = currentWord.toLowerCase()
      this.currentWord = currentWord
      clearTimeout(this.timer)
      if (currentWord.length > 1) {
        this.updateWindowPosition(target)
        this.timer = setTimeout(() => {
          this.$store.dispatch('getTranslate', currentWord).then(res => {
            if (res.data.def.length) {
              this.currentPos = res.data.def[0].pos
              this.currentTranscription = res.data.def[0].ts
              this.currentTranslation = res.data.def[0].tr[0].text
              this.hasTranslation = true
            } else {
              this.resetTranslation()
            }
            this.updateWindowPosition(target)
          }).catch(e => {
            console.warn('Error', e)
          }).finally(() => {
            this.isLoading = false
          })
        }, 300)
      }
    },
    closeTranslate () {
      clearTimeout(this.timer)
      this.showWindow = false
      this.$emit('pauseVideo', false)
    },
    updateWindowPosition (target) {
      const translate = this.$refs.translateWindow
      const targetCoords = target.getBoundingClientRect()
      this.showWindow = true
      setTimeout(() => {
        const translateCoords = translate.getBoundingClientRect()
        translate.style.left = `${targetCoords.left + (targetCoords.width - translateCoords.width) / 2}px`
        translate.style.top = `${targetCoords.top - translateCoords.height - 14}px`
      }, 1)
    },
    resetTranslation () {
      this.currentPos = ''
      this.currentTranscription = ''
      this.currentTranslation = ''
      this.hasTranslation = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .translate-window-component {
    .text {
      max-width: 850px;
      width: 100%;
      font-size: 34px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 0 4px #111111;
      -webkit-text-stroke: 1px #111111;
      cursor: default;
      align-items: flex-end;
      span {
        position: relative;
        cursor: pointer;
        z-index: 0;
        line-height: 1;
        &:after {
          content: '';
          position: absolute;
          left: -4px;
          top: -4px;
          width: calc(100% + 4px);
          height: calc(100% + 8px);
          background-color: rgba(#9dc2ff, 0.6);
          border-radius: 4px;
          opacity: 0;
          transition: $trs2;
          z-index: -1;
        }
        &:hover:after {
          opacity: 1;
        }
      }
      pre {
        font-family: inherit;
        font-size: inherit;
        margin: 0;
      }
    }
    .window {
      position: fixed;
      min-height: 50px;
      min-width: 50px;
      max-width: 320px;
      background-color: #ffffff;
      border-radius: 4px;
      border: 1px solid rgba(#111111, 0.3);
      box-shadow: 0 0 10px 1px rgba(#111111, 0.4);
      &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        width: 10px;
        bottom: -20px;
        border: 10px solid transparent;
        border-top-color: #ffffff;
      }
      .preloader {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        border-radius: 4px;
        background-color: #ffffff;
      }
      .head, .transcription, .translation {
        padding: 10px;
        font-size: 18px;
      }
      .head, .transcription {
        border-bottom: 1px solid rgba(#111111, 0.1);
      }
      .head {
        font-weight: 900;
        .pos {
          font-weight: 300;
          font-size: 12px;
        }
      }
      .transcription {
        font-style: italic;
      }
      .no-translation {
        padding: 10px;
        font-size: 18px;
      }
    }
  }
</style>
