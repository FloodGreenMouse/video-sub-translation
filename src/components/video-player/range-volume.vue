<template lang="pug">
  .range-volume-component(@click="setRangePosition")
    .range(ref="range" :style="{width: `${currentVolume * 100}px`}")
</template>

<script>
export default {
  name: 'range-volume-component',
  props: {
    currentVolume: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      percent: 0
    }
  },
  methods: {
    setRangePosition (e) {
      const barCoords = this.$refs.range.getBoundingClientRect()
      this.percent = e.pageX - barCoords.left + 2
      if (this.percent > 100) {
        this.percent = 100
      }
      if (this.percent < 0) {
        this.percent = 0
      }
      const range = this.$refs.range
      range.style.width = `${this.percent}px`
      this.$emit('setvolume', this.percent)
    },
    activateMouseMove (e) {
      if (e.target === this.$refs.range) {
        this.$refs.range.style.transition = 'none'
        document.addEventListener('mousemove', this.setRangePosition)
      }
    },
    deactivateMouseMove () {
      this.$refs.range.style.transition = null
      document.removeEventListener('mousemove', this.setRangePosition)
    }
  },
  mounted () {
    document.addEventListener('mousedown', this.activateMouseMove)
    document.addEventListener('mouseup', this.deactivateMouseMove)
  },
  beforeDestroy () {
    document.removeEventListener('mousedown', this.activateMouseMove)
    document.removeEventListener('mouseup', this.deactivateMouseMove)
  }
}
</script>

<style lang="scss" scoped>
  .range-volume-component {
    height: 40px;
    width: 80px;
    cursor: pointer;
    background-color: transparent;
    display: inline-flex;
    align-items: center;
    overflow: hidden;
    position: relative;
    z-index: 1;
    .range {
      position: relative;
      background-color: #ffffff;
      height: 5px;
      width: 100%;
      transition: width 0.2s ease;
      border-radius: 2px;
      max-width: calc(100% - 1px);
      &:hover:after, &:active:after {
        transform: scale(1);
      }
      &:after {
        content: '';
        position: absolute;
        background-color: #ffffff;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        transform: scale(0);
        top: 0;
        bottom: 0;
        left: calc(100% - 7px);
        margin: auto;
        transition: transform 0.2s ease;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        height: 100%;
        width: 79px;
        background-color: rgba(#ffffff, 0.4);
        border-radius: 2px;
        z-index: -1;
      }
    }
  }
</style>
