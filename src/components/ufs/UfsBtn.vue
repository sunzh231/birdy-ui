<template>
  <div class="ufs-button-container" :class="[isInline ? 'inline' : '']">
    <a v-if="btnType == 'link'" class="ufs-button" v-link="vlink"
      :class="[
        btnStyle,
        btnSize,
        disabled ? 'disable': ''
      ]">{{ text }}</a>
    <button v-else class="ufs-button"
      type="button"
      :class="[
        btnStyle,
        btnSize,
        disabled ? 'disable': ''
      ]"
      @click="handler($event)">{{ text }}</button>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

.ufs-button-container {
  display: block;
  text-align: left;

  &.inline {
    display: inline-block;
    vertical-align: middle;
  }

  .ufs-button {
    display: block;
    outline: 0;
    margin: 0;
    cursor: pointer;
    text-align: center;

    border: 1px solid @ufsOrange;
    color: @white;
    background-color: @ufsOrange;

    font-size: 16px;
    line-height: 20px;
    padding: 5px 0;
    width: 288px;

    &.bg-orange {
    }

    &.bg-white {
      border-color: @ufsGray;
      color: @ufsOrange;
      background-color: @white;
    }

    &.large {
    }

    &.middle {
      width: 214px;
    }

    &.small {
      width: 128px;
    }

    &.smaller {
      width: 48px;
      font-size: 12px;
      line-height: 16px;
      padding: 7px 0;
    }

    &.disable {
      cursor: default;
      border-color: @ufsFontGray;
      color: @white;
      background-color: @ufsFontGray;
    }
  }
}


@media (max-width: @webBoundary) {
  .ufs-button-container {
    .ufs-button {
      box-sizing: border-box;
      font-size: 12px;
      line-height: 16px;
      padding: 7px 0;
      width: 100%;

      &.large {
        font-size: 14px;
      }

      &.middle {
        width: 148px;
      }

      &.small {
        width: 96px;
      }

      &.smaller {
      }
    }
  }
}
</style>

<script>
export default {
  replace: true,
  props: {
    text: {
      type: String,
      required: true
    },
    btnType: {
      type: String,
      required: false,
      default: 'button' // 'link'
    },
    btnStyle: {
      type: String,
      required: false,
      default: 'bg-orange' // 'bg-white'
    },
    btnSize: {
      type: String,
      required: false,
      default: 'large' // 'middle', 'small', smaller
    },
    isInline: {
      type: Boolean,
      required: false,
      default: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    link: [String, Object],
    clickHandler: Function
  },
  computed: {
    vlink () {
      return this.disabled ? null : this.link
    }
  },
  methods: {
    handler (event) {
      if (!this.disabled && typeof this.clickHandler === 'function') {
        this.clickHandler(event)
      }
    }
  }
}
</script>
