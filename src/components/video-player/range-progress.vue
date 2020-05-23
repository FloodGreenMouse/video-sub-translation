<template lang="pug">
  .range-progress-component(@click="setRangePosition" ref="range")
    .range(ref="rangeBar")
</template>

<script>
export default {
  name: 'range-progress-component',
  props: {
    duration: {
      type: Number,
      default: 0
    },
    currentTime: {
      type: Number,
      default: 0
    }
  },
  watch: {
    currentTime () {
      this.updateRangePosition()
    }
  },
  methods: {
    setRangePosition (e) {
      const barCoords = this.$refs.range.getBoundingClientRect()
      const width = e.pageX - barCoords.left + 2
      this.percent = Math.round(width / barCoords.width * 100)
      this.$refs.rangeBar.style.width = `${width}px`
      this.$emit('setprogress', this.percent)
    },
    updateRangePosition () {
      this.$refs.rangeBar.style.width = `${this.currentTime / this.duration * 100}%`
    },
    activateMouseMove (e) {
      if (e.target === this.$refs.rangeBar) {
        this.$refs.rangeBar.style.transition = 'none'
        document.addEventListener('mousemove', this.setRangePosition)
      }
    },
    deactivateMouseMove () {
      this.$refs.rangeBar.style.transition = null
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
  .range-progress-component {
    height: 40px;
    max-width: calc(100% - 130px);
    width: 100%;
    cursor: pointer;
    background-color: transparent;
    display: inline-flex;
    align-items: center;
    overflow: hidden;
    position: relative;
    z-index: 1;
    flex: 1;
    user-select: none;
    &:hover .range:after {
      transform: scale(1);
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      height: 5px;
      width: 100%;
      margin: auto;
      background-color: rgba(#ffffff, 0.4);
      border-radius: 2px;
      z-index: -1;
    }
    .range {
      position: relative;
      background-color: #ffffff;
      height: 5px;
      width: 0;
      transition: width 0.2s ease;
      border-radius: 2px;
      max-width: calc(100% - 1px);
      user-select: none;
      &:active:after {
        transform: scale(1);
      }
      &:after {
        content: '';
        position: absolute;
        background-color: #ffffff;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        transform: scale(0);
        top: 0;
        bottom: 0;
        left: calc(100% - 9px);
        margin: auto;
        transition: transform 0.2s ease;
      }
    }
  }
</style>
