<template>
  <div class="ufs-back-to-top" v-on:click="backToTop()" v-show="show">
    <i class="icon icon-top icon-size"></i>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

.ufs-back-to-top {
  position: fixed;
  z-index: 10;
  bottom: 15%;
  right: 3%;
  cursor: pointer;

  .icon-top {
    display: block;
    position: relative;
    background: url('images/icon-top.png') center no-repeat;
    background-size: 100%;
  }

  .icon-size {
      width: 50px;
      height: 50px;
    }
}

@media (max-width: @webBoundary) {
  .ufs-back-to-top {
    .icon-size {
      width: 40px;
      height: 40px;
    }
  }
}
</style>

<script>
import view from '../utils/view'

export default {
  data () {
    return {
      show: false
    }
  },
  methods: {
    backToTop () {
      view.backToTop()
      this.show = false
    }
  },
  ready () {
    var self = this
    window.addEventListener('scroll', () => {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > window.screen.availHeight) {
        self.show = true
      } else {
        self.show = false
      }
    })
  }
}
</script>
