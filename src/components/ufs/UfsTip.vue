<template>
  <div :class="['ufs-tip', position]" v-show="show">
    {{ text }}<slot></slot>
  </div>
</template>

<script>
const caretAndSpaceHeight = 16

export default {
  props: {
    text: String,
    show: {
      type: Boolean,
      twoWay: true,
      default: false,
      required: true
    },
    delay: {
      type: Number,
      default: 2
    },
    position: {
      type: String,
      default: 'right'
    },
    event: null
  },
  methods: {
    setAbsolutePosition () {
      this.$el.style.position = 'absolute'
      this.$el.style.bottom = this.$el.parentNode.clientHeight + caretAndSpaceHeight + 'px'
      if (this.position === 'right') {
        this.$el.style.right = 0
      } else if (this.position === 'left') {
        this.$el.style.left = 0
      }
    },
    setFixedPosition (event) {
      const box = event.target.getBoundingClientRect()
      const bodyBox = document.body.getBoundingClientRect()
      const top = box.top - box.height - caretAndSpaceHeight
      this.$el.style.position = 'fixed'
      this.$el.style.top = top + 'px'
      this.$el.style.bottom = 'auto'
      if (this.position === 'right') {
        const right = Math.round(bodyBox.right - box.right)
        this.$el.style.right = `${right}px`
      } else if (this.position === 'left') {
        this.$el.style.left = `${box.left}px`
      }
    }
  },
  ready () {
    this.setAbsolutePosition()
  },
  watch: {
    show (newValue) {
      if (newValue) {
        window.setTimeout(() => {
          this.$set('show', false)
        }, this.delay * 1000)
      }
    },
    event (newValue) {
      if (newValue) {
        this.setFixedPosition(newValue)
      }
    }
  }
}
</script>

<style scoped lang="less">
@ufs-tip-color: #646260;
@ufs-tip-background-color: #f9bb0a;

.ufs-tip {
  font-size: 12px;
  color: @ufs-tip-color;
  background-color: @ufs-tip-background-color;
  padding: 6px 8px;
  z-index: 100;

  &:before {
    content: '';
    position: absolute;
    top: 100%;
    height: 0;
    width: 0;
    font-size: 0;
    line-height: 0;
    border-top: 8px solid @ufs-tip-background-color;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
  }

  &.left:before {
    left: 10px;
  }

  &.right:before {
    right: 10px;
  }
}
</style>
