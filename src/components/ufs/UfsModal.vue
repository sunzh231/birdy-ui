<template>
<!-- FIXME: It will show two scroll bar when resize window -->
<div v-show="show" transition="true">
  <div class="modal" v-el:modal @click.self="clickMask">
    <div class="modal-dialog" v-el:modal-dialog>
      <div class="modal-content">
        <img class="close" src="../images/close.png" @click.self="clickMask">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="less">
@import '../styles/variables.less';

.modal {
  display: block;
  position: fixed;
  top: 0;
  background: rgba(239,239,239,0.8);
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 200;
  overflow-x: hidden;
  overflow-y: auto;

  .modal-dialog {
    position: relative;
    text-align: center;
    margin: 50px auto;

    .modal-content {
      display: inline-block;
      position: relative;
      border: 1px solid #939598;

      .close {
        position: absolute;
        z-index: 50;
        top: 30px;
        right: 38px;
        cursor: pointer;
      }
    }
  }
}

@media (max-width: @webBoundary) {
  .modal {
    bottom: 0;
    background: @white;
    z-index: 20;
    top: @headerHeightPhone;
    position: absolute;

    .modal-dialog {
      margin: 0 auto;
      width: 100%;

      .modal-content {
        border: 0;
        width: 100%;

        .close {
          top: 12px;
          right: 12px;
        }
      }
    }
  }
}
</style>

<script>
const htmlTag = document.getElementsByTagName('html')[0]

export default {
  props: {
    show: {
      type: Boolean,
      twoWay: true,
      default: false
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
      this.show = false
    },
    clickMask () {
      if (!this.force) {
        this.cancel()
      }
    },
    centerBlock () {
      const modalHeight = this.$els.modal.clientHeight
      const modalDialogHeight = this.$els.modalDialog.clientHeight
      let verticalDistance = (modalHeight - modalDialogHeight) / 2
      verticalDistance = verticalDistance < 30 ? 30 : verticalDistance
      this.$els.modalDialog.style.marginTop = `${verticalDistance}px`
      this.$els.modalDialog.style.marginBottom = `${verticalDistance}px`
    },
    dismiss () {
      if (this.show) {
        this.cancel()
      }
    }
  },
  watch: {
    show (newVal) {
      if (document.body.clientWidth >= 960) {
        this.centerBlock()
      } else {
        let container = this.$root.$el.children[1]
        if (newVal) {
          container.style.height = 0
          container.style.overflowY = 'hidden'
          this.$dispatch('modal-show')
        } else {
          container.style.height = 'initial'
          container.style.overflowY = 'auto'
          this.$dispatch('modal-hide')
        }
      }
      htmlTag.style.overflowY = newVal ? 'hidden' : 'auto'
    }
  },
  ready () {
    // HACK: the popstate event happens when the history changed
    //       and vue-router will add a history before each route changes.
    //       which will trigger this event
    window.addEventListener('popstate', this.dismiss)
    // support IE11
    window.addEventListener('hashchange', this.dismiss)
  },
  destroyed () {
    window.removeEventListener('popstate', this.dismiss)
    window.removeEventListener('hashchange', this.dismiss)
  }
}
</script>
