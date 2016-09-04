<template>
  <div class="ufs-collapse">
    <div class="ufs-collapse-hd">
      <div class="title" v-text="title"></div>
      <div class="ufs-collapse-operation" @click="toggle">
        {{ isCollapse ? '收起' : '展开' }}
        <span class="ufs-collapse-caret" v-bind:class="{ 'up': isCollapse, 'down': !isCollapse}"></span>
      </div>
    </div>
    <div class="ufs-collapse-bd" v-show="isCollapse">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import view from '../utils/view'
import {debounce} from '../../../../static/h5/utils/interaction'

const reachBottom = () => {
  let scrollTop = 0
  let clientHeight = 0
  let scrollHeight = 0
  // compatible IE and chrome
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
  } else if (document.body) {
    scrollTop = document.body.scrollTop
  }
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
  } else {
    clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
  }
  scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
  return (scrollTop + clientHeight === scrollHeight)
}

export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isCollapse: document.body.clientWidth >= 960
    }
  },
  ready () {
    // Only listen mobile scroll down event
    if (document.body.clientWidth < 960) {
      this.scrollHandler = debounce(() => {
        if (reachBottom()) {
          this.isCollapse = true
        }
      }, 20)
      window.addEventListener('scroll', this.scrollHandler)
    }
  },
  destroyed () {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler)
    }
  },
  methods: {
    toggle () {
      this.isCollapse = !this.isCollapse
      if (!this.isCollapse && document.body.clientWidth < 960) {
        view.backToTop()
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '../styles/variables.less';

@ufs-collapse-border-color: #ecebed;
@ufs-collapse-operation-color: #9e9e9f;

.ufs-collapse {
  &-hd {
    padding: 11px 8px;
    border-width: 2px 0;
    border-color: @ufs-collapse-border-color;
    border-style: solid;
    position: relative;

    .title {
      font-size: 16px;
    }
  }

  &-bd {
    padding: 15px 0;
  }

  &-operation {
    position: absolute;
    top: 11px;
    right: 8px;
    color: @ufs-collapse-operation-color;
    font-size: 12px;
  }

  &-caret {
    display: inline-block;
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #c8c8cd;
    border-style: solid;
    position: relative;

    &.up {
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      top: 1px;
    }

    &.down {
      -webkit-transform: rotate(135deg);
      transform: rotate(135deg);
      top: -3px;
    }
  }
}

@media (max-width: @webBoundary) {
  .ufs-collapse {
    &-hd {
      padding: 9px 8px;

      .title {
        font-size: 12px;
      }
    }
  }
}
</style>
