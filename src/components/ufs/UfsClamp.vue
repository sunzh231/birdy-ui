<template>
  <div :title="tooltip">
    {{ text }}
  </div>
</template>

<style scoped lang="less">

</style>

<script>
import clamp from 'clamp'
import {debounce} from '../../../../static/h5/utils/interaction'

let states = {}

export default {
  props: {
    clamp: {
      type: [String, Number], // can be 16px or 2 (2 lines)
      required: false,
      default: 2
    },
    text: {
      type: String, // the text that is to be ellipsised
      required: true
    }
  },
  data () {
    return {
      tooltip: ''
    }
  },
  methods: {
    update () {
      this.tooltip = this.text
      this.$nextTick(() => {
        // make sure all the browsers share the same behavior, does not use native clamp style
        if (this.$el) {
          clamp(this.$el, {clamp: this.clamp, useNativeClamp: false})
        }
      })
    }
  },
  watch: {
    text () {
      this.update()
    }
  },
  ready () {
    this.update()

    states.debounceUpdate = debounce(() => {
      if (document.body.clientWidth > 960) {
        this.update()
      }
    }, 100)
    window.addEventListener('resize', states.debounceUpdate)
  },
  destroyed () {
    window.removeEventListener('resize', states.debounceUpdate)
  }
}
</script>
