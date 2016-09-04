<template>
  <div class="ufs-btn-group" :class="[btnSize]" v-show="list.length > 0">
    <div class="btns-wrap clearfix">
      <span class="btn-wrap" :class="[btnSize]" v-for="item in list" track-by="$index" @click="click($index)">
        <ufs-btn
          :text="item.text"
          :btn-style="item.actived ? 'bg-orange': 'bg-white'"
          :btn-size="btnSize"
          :is-inline="isInline">
        </ufs-btn>
      </span>
    </div>
  </div>
</template>

<style lang="less">
@import '../styles/variables.less';
@import '../../../../static/h5/styles/mixins.less';

@ufs-btn-bg: #eeeeee;

.ufs-btn-group {
  display: inline-block;
  width: auto;
  background-color: @ufs-btn-bg;

  .btns-wrap {
    padding: 0 0 24px 20px;
  }

  .btn-wrap {
    display: inline-block;
    margin-right: 14px;
    margin-top: 24px;
  }
}

@media (max-width: @webBoundary) {
  .ufs-btn-group {
    height: inherit;
    line-height: inherit;
    padding: 0;
    background-color: inherit;

    &.middle {
      display: block;
      width: auto;
      text-align: center;
      margin: 0 auto;
      padding: 0;

      .btns-wrap {
        display: block;
      }
    }

    &.small {
      height: 48px;
      line-height: 48px;
      text-align: center;
      padding: 0;

      .btns-wrap {
        display: inline-block;
        width: auto;
      }
    }

    &.large {
      display: block;
      width: 100%;
    }

    .btns-wrap {
      padding: 0;
      text-align: left;
    }

    .btn-wrap {
      display: inherit;
      margin-top: 0;

      &.large {
        display: block;
        text-align: center;
        width: 100%;
        margin-bottom: 10px;
      }

      &.middle {
        display: inline-block;
        width: 48%;
        margin-right: 0;
        margin-bottom: 10px;

        &:nth-child(2n + 1) {
          margin-right: 3%;
        }
      }

      &.small {
        float: left;

        &:not(:last-child) {
          margin-right: 0px;
        }
      }
    }

    .ufs-button-container {
      width: 100% !important;

      .ufs-button.middle {
        width: 100% !important;
      }
    }
  }
}
</style>

<script>
import UfsBtn from './UfsBtn'

export default {
  props: {
    list: {
      type: Array,
      required: true,
      twoWay: true
    },
    callback: {
      type: Function,
      required: false
    },
    btnSize: {
      type: String,
      required: false,
      default: 'small'
    }
  },
  computed: {
    isInline () {
      return this.btnSize !== 'large'
    }
  },
  methods: {
    click (index) {
      if (this.list[index].actived) return
      this.list.forEach((item) => {
        item.actived = false
      })
      this.list[index].actived = true
      if (this.callback) this.callback(index)
    }
  },
  components: {
    UfsBtn
  }
}
</script>
