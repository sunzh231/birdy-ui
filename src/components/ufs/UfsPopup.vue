<template>
  <div class="ufs-dropdown" v-show="show">
    <slot></slot>
    <div class="close" @click="close">
      <div class="tip">轻触下面任何区域关闭弹层</div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

@ufs-gary-bg: #e8e8e8;
@ufs-gary-ft-bg: #bbbebe;

.ufs-dropdown {
  display: none;
}

@media (max-width: @webBoundary) {
  .ufs-dropdown {
    display: inherit;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background-color: @white;
  }

  .close {
    width: 100%;
    height: 100%;
    background-color: @ufs-gary-bg;
  }

  .tip {
    width: 100%;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 12px;
    background-color: @ufs-gary-ft-bg;
    color: @white;
  }
}
</style>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      twoWay: true
    },
    callback: {
      type: Function,
      required: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    close () {
      this.show = false
      if (this.callback) this.callback()
    }
  }
}
</script>
