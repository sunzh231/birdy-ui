<template>
  <div class="ufs-select-container"
    :class="[size, {'inline': isInline, 'required': required, 'invalid': invalid}]"
    @mouseleave="toggleItemsHandler(event, false)">
    <div class="ufs-select"
      :class="[{'disabled': disabled, 'ufs-select-icon-toggle': showItems}]"
      @click="toggleItemsHandler">
      <span class="ufs-select-item"
        :class="[{'placeholder': !value && value !== 0}]"
        :value="value"
        :title="currentLabel">{{ currentLabel }}</span>
      <span class="ufs-select-icon"></span>
    </div>
    <ul class="ufs-select-items"
      :class="[{'direction-up': directionUp}]"
      v-show="showItems && items.length">
      <li v-for="item in items" class="item"
        @click="selectItemHandler($index)"
        :value="item[valueField]"
        :title="item[textField]">{{ item[textField] }}</li>
    </ul>
    <label class="ufs-error-tip">请填写此字段</label>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

@placeholder-color: #A9A9A9;
@line-height: 20px;
@line-height-mobile: 18px;
@error-red: #da2c27;

.ufs-select-container {
  display: block;
  text-align: left;
  margin-bottom: 10px;
  font-size: 16px;
  line-height: @line-height;
  color: @ufsFontBlack;
  border: 1px solid @ufsBarGray;
  position: relative;

  &.inline {
    display: inline-block;
    vertical-align: top;
  }

  &.large {
    width: 348px;
  }

  &.middle {
    width: 168px;
  }

  &.small {
    width: 88px;
  }

  &.required.invalid {
    margin-bottom: 34px;
    border-color: @error-red;

    .ufs-error-tip {
      display: block;
    }
  }

  .overflow-ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .ufs-select {
    outline: 0;
    margin: 0;

    position: relative;
    height: @line-height;
    padding: 5px 38px 5px 10px;
    cursor: pointer;

    &.disabled {
      background: @ufsGray;
      cursor: default;
    }

    span {
      display: block;
    }

    .ufs-select-item {
      .overflow-ellipsis;

      &.placeholder {
        color: @placeholder-color;
      }
    }

    .ufs-select-icon {
      position: absolute;
      right: 10px;
      top: 11px;
      width: 16px;
      height: 8px;
      background: url('../images/arrow_up.png') center center no-repeat;
      background-size: cover;
      transform: rotate(180deg);
    }

    &.ufs-select-icon-toggle {
      .ufs-select-icon {
        transform: rotate(0deg);
      }
    }
  }

  .ufs-select-items {
    position: absolute;
    top: 30px;
    left: -1px;
    z-index: 100;
    width: 100%;
    max-height: 210px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid @ufsBarGray;

    &.direction-up {
      top: auto;
      bottom: 30px;
    }

    .item {
      cursor: pointer;
      padding: 5px 10px;
      color: @ufsFontGray;
      .overflow-ellipsis;

      &:hover {
        color: @white;
        background: @ufsOrange;
      }
    }
  }

  .ufs-error-tip {
    display: none;
    position: absolute;
    top: 30px;
    left: -1px;
    z-index: 99;
    width: 100%;
    color: @error-red;
    font-size: 12px;
    line-height: 14px;
    padding: 5px 0;
  }
}


@media (max-width: @webBoundary) {
  .ufs-select-container {
    font-size: 14px;
    line-height: @line-height-mobile;
    box-sizing: border-box;

    &.large {
      width: 100%;
    }

    &.middle {
      width: 140px;
    }

    &.small {
      width: 90px;
    }

    .ufs-select {
      height: @line-height-mobile;

      .ufs-select-icon {
        right: 10px;
        top: 10px;
      }
    }

    .ufs-select-items {
      top: 28px;

      &.direction-up {
        top: auto;
        bottom: 28px;
      }
    }
  }
}
</style>

<script>
export default {
  replace: true,
  props: {
    items: {
      type: Array,
      required: true
    },
    valueField: {
      type: String,
      required: false,
      default: 'value'
    },
    textField: {
      type: String,
      required: false,
      default: 'text'
    },
    placeholder: String,
    value: {
      type: [String, Number],
      twoWay: true
    },
    size: {
      type: String,
      required: false,
      default: 'large' // 'middle', 'small'
    },
    isInline: {
      type: Boolean,
      required: false,
      default: false
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    changeHandler: Function
  },
  data () {
    return {
      currentLabel: '',
      directionUp: false,
      showItems: false,
      invalid: false
    }
  },
  methods: {
    handleDirection (event) {
      var leftBottomHeight = window.innerHeight - event.clientY - this.$el.clientHeight
      if (leftBottomHeight > 210 || leftBottomHeight > this.$el.getElementsByTagName('li').length * 30) {
        this.directionUp = false
      } else {
        this.directionUp = true
      }
    },

    toggleItemsHandler (event, toShow) {
      if (!this.disabled) {
        if (typeof toShow !== 'boolean') {
          toShow = !this.showItems
        } else if (this.showItems === toShow) {
          return false
        }

        if (toShow) {
          this.invalid = false
          this.handleDirection(event)
          this.$dispatch('ufsSelectDropdownShow')
        } else {
          this.validHandler()
        }

        this.showItems = toShow
      }
    },

    selectItemHandler (index) {
      if (!this.disabled) {
        var selectItem = this.items[index]
        this.currentLabel = selectItem[this.textField]
        this.value = selectItem[this.valueField]
        if (this.changeHandler) {
          this.changeHandler(this.value)
        } else {
          this.$emit('on-change', this.value)
        }

        this.showItems = false
      }
    },

    initCurrentLabel () {
      if ((this.value || this.value === 0) && this.items.length) {
        for (let item of this.items) {
          if (item[this.valueField] === this.value) {
            this.currentLabel = item[this.textField]
            break
          }
        }
      } else {
        this.currentLabel = this.placeholder || ''
      }
    },

    validHandler () {
      this.invalid = this.required && (!this.value && this.value !== 0)
    }
  },
  watch: {
    value (val, oldVal) {
      this.initCurrentLabel()
      if (val || val === 0) {
        this.validHandler()
      }
    },

    items (val, oldVal) {
      this.initCurrentLabel()
    }
  },
  ready () {
    this.initCurrentLabel()
    this.$on('submit', () => {
      this.validHandler()
    })

    // used in UC web in order to avoid multiple dropdown
    // show at the same time
    this.$on('ufsSelectHideOthers', () => {
      if (this.showItems) {
        this.toggleItemsHandler({}, false)
      }
    })

    // TODO: find a better way to bind event on parent
    //       now it will bind multiple broadcast functions
    //       onto parent, but actually here needs only one
    const parent = this.$parent
    parent.$on('ufsSelectDropdownShow', () => {
      parent.$broadcast('ufsSelectHideOthers')
    })
  }
}
</script>
