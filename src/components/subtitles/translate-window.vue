<template lang="pug">
  .translate-window-component
    transition(name="fade" :duration="100")
      .window.flex.column.center(v-show="showWindow" ref="translateWindow")
        .preloader(v-if="isLoading")
          vPreloader
        .content(v-if="!isLoading && hasTranslation")
          .head
            span {{ word }}
            sup.pos &nbsp; {{ [pos] }}
          .transcription
            span {{ [transcription] }}
          .translation
            span {{ translation }}
        .no-translation(v-if="!isLoading && !hasTranslation")
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
      word: '',
      pos: '',
      transcription: '',
      translation: '',
      cash: [],
      hasTranslation: false,
      timer: null
    }
  },
  methods: {
    getTranslate (target, word) {
      this.isLoading = true
      this.updateWindowPosition(target)
      this.resetTranslation()
      let currentWord = word.replace(/\W/g, '')
      currentWord = currentWord.toLowerCase().trim()
      this.word = currentWord
      clearTimeout(this.timer)
      const cashedWord = this.cash.find(item => item.word === currentWord)
      if (currentWord.length > 1) {
        if (!cashedWord) {
          this.timer = setTimeout(() => {
            this.getTranslation(target, currentWord)
          }, 300)
        } else {
          this.word = cashedWord.word
          this.pos = cashedWord.pos
          this.transcription = cashedWord.transcription
          this.translation = cashedWord.translation
          this.isLoading = false
          this.hasTranslation = cashedWord.hasTranslation
        }
      } else {
        this.isLoading = false
        this.hasTranslation = false
      }
    },
    getTranslation (target, currentWord) {
      this.$store.dispatch('getTranslate', currentWord).then(res => {
        if (res.data.def.length) {
          this.cash.push(currentWord)
          this.pos = res.data.def[0].pos
          this.transcription = res.data.def[0].ts
          this.translation = res.data.def[0].tr[0].text
          this.hasTranslation = true
          this.cash.push({
            word: this.word,
            pos: this.pos,
            transcription: this.transcription,
            translation: this.translation,
            hasTranslation: true
          })
        } else {
          this.cash.push({
            word: this.word,
            hasTranslation: false
          })
          this.resetTranslation()
        }
      }).catch(e => {
        this.hasTranslation = false
        console.warn('Error', e)
      }).finally(() => {
        this.updateWindowPosition(target)
        this.isLoading = false
      })
    },
    closeTranslate () {
      clearTimeout(this.timer)
      this.showWindow = false
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
      this.pos = ''
      this.transcription = ''
      this.translation = ''
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
      min-height: 100px;
      min-width: 150px;
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
