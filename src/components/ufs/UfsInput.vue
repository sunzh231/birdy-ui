<template>
  <div class="ufs-input-container"
    :class="[{'required': required, 'invalid': isInvalid, 'inline': isInline}]">
    <label v-if="label" class="ufs-input-label" :for="id">{{ label }}</label>
    <input v-if="!disabled" v-model="value" class="ufs-input"
      :id="id"
      :class="[inputSize]"
      :placeholder="placeholder"
      :type="type"
      :maxlength="maxLength"
      @blur="handler"
      @focus="focusHandler"
      @input="inputHandler"/>
    <span v-else class="ufs-input disabled" :class="[inputSize]">{{ value }}</span>
    <label class="ufs-error-tip">{{ invalidTip }}</label>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

@error-red: #da2c27;
@error-background-yellow: #FFF3CD;
@focus-border-gray: gray;

.ufs-input-container {
  display: block;
  text-align: left;
  margin-bottom: 10px;

  &.required {
    .ufs-input-label:after {
      content: ' *';
      font-size: 14px;
    }
  }

  &.invalid {
    .ufs-input {
      border-color: @error-red;
      background-color: @error-background-yellow;
    }

    .ufs-error-tip {
      display: block;
    }
  }

  &.inline {
    display: inline-block;
    vertical-align: top;
  }

  label, input, span {
    display: block;
    font-size: 16px;
    line-height: 20px;
    padding: 5px 0;
    color: @ufsFontBlack;
  }

  .ufs-input-label {
  }

  .ufs-input {
    outline: 0;
    margin: 0;
    padding: 5px 10px;
    box-shadow: none;
    border: 1px solid @ufsGray;
    border-radius: 0;
    appearance: none;

    &:focus {
      border-color: @focus-border-gray;
      box-shadow: 0 0 1px @focus-border-gray inset, 0 0 5px @focus-border-gray;
    }

    &.disabled {
      background: @ufsGray;
    }

    &.large {
      width: 328px;
    }

    &.middle {
      width: 198px;
    }

    &.small {
      width: 88px;
    }
  }

  .ufs-error-tip {
    display: none;
    color: @error-red;
    font-size: 12px;
    line-height: 14px;
  }
}


@media (max-width: @webBoundary) {
  .ufs-input-container {
    label, input, span {
      font-size: 14px;
      line-height: 18px;
      padding: 6px 0;
    }

    .ufs-input-label {
    }

    .ufs-input {
      box-sizing: border-box;

      &.large {
        width: 100%;
      }

      &.middle {
        width: 150px;
      }

      &.small {
        width: 90px;
      }
    }
  }
}
</style>

<script>
export default {
  replace: true,
  props: {
    label: {
      type: String,
      required: false
    },
    value: {
      type: [String, Number],
      twoWay: true
    },
    id: String,
    type: {
      type: String,
      required: false,
      default: 'text' // 'number', 'mobile', 'email'
    },
    min: Number,
    max: Number,
    minLength: Number,
    maxLength: Number,
    placeholder: String,
    inputSize: {
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
    validateHandler: Function, // return error tip if invalid
    inputHandler: {
      type: Function,
      required: false,
      default () {}
    }
  },
  data () {
    return {
      invalidTip: '',
      isInvalid: false
    }
  },
  methods: {
    requiredHandler () {
      const requiredTip = '请填写此字段'
      if (!this.value) {
        this.isInvalid = true
        this.invalidTip = requiredTip
      } else {
        this.isInvalid = false
        this.invalidTip = ''
      }
    },

    textHandler () {
      const textTip = '请输入{length}位字符'
      var minLength = this.minLength || 0
      if (minLength < 0) {
        minLength = 0
      }
      var maxLength = this.maxLength || 0
      if (maxLength < 0) {
        maxLength = 0
      }
      var invalidMinLength = minLength && this.value.length < minLength
      var invalidMaxLength = maxLength && this.value.length > maxLength
      if (minLength && maxLength && (invalidMinLength || invalidMaxLength)) {
        this.isInvalid = true
        this.invalidTip = textTip.replace('{length}', minLength + '~' + maxLength)
      } else if (invalidMinLength) {
        this.isInvalid = true
        this.invalidTip = textTip.replace('{length}', '至少' + minLength)
      } else if (invalidMaxLength) {
        this.isInvalid = true
        this.invalidTip = textTip.replace('{length}', '最多' + maxLength)
      } else {
        this.isInvalid = false
        this.invalidTip = ''
      }
    },

    numberHandler () {
      const numberTip = '请输入{range}的数字'
      var hasMin = (this.min || this.min === 0)
      var hasMax = (this.max || this.max === 0)
      var invalidMin = hasMin && this.value < this.min
      var invalidMax = hasMax && this.value > this.max
      if (hasMin && hasMax && (invalidMin || invalidMax)) {
        this.isInvalid = true
        this.invalidTip = numberTip.replace('{range}', this.min + '~' + this.max + '范围内')
      } else if (invalidMin) {
        this.isInvalid = true
        this.invalidTip = numberTip.replace('{range}', '大于等于' + this.min)
      } else if (invalidMax) {
        this.isInvalid = true
        this.invalidTip = numberTip.replace('{range}', '小于等于' + this.max)
      } else {
        this.isInvalid = false
        this.invalidTip = ''
      }
    },

    mobileHandler () {
      const mobileTip = '格式错误，请填写11位手机号码'
      const mobileRegex = /^1[34578][0-9]{9}$/
      if (!mobileRegex.test(this.value)) {
        this.isInvalid = true
        this.invalidTip = mobileTip
      } else {
        this.isInvalid = false
        this.invalidTip = ''
      }
    },

    emailHandler () {
      const emailTip = '邮箱格式错误'
      const emailRegex = /^[A-Za-z0-9\._-]+@[A-Za-z0-9_-]+([\.][A-Za-z0-9-]+)+$/
      if (!emailRegex.test(this.value)) {
        this.isInvalid = true
        this.invalidTip = emailTip
      } else {
        this.isInvalid = false
        this.invalidTip = ''
      }
    },

    handler () {
      if (!this.disabled) {
        this.value = typeof this.value === 'string' ? this.value.trim() : this.value
        if (this.required) {
          this.requiredHandler()
        }
        if (!this.required || !this.isInvalid) {
          if (typeof this.validateHandler === 'function') {
            this.invalidTip = this.validateHandler(this.value)
            if (this.invalidTip) {
              this.isInvalid = true
            } else {
              this.isInvalid = false
            }
          } else if (this.type === 'text') {
            this.textHandler()
          } else if (this.type === 'number') {
            this.numberHandler()
          } else if (this.type === 'mobile') {
            this.mobileHandler()
          } else if (this.type === 'email') {
            this.emailHandler()
          }
        }
      }
    },

    focusHandler () {
      this.isInvalid = false
    }
  },
  ready () {
    this.$on('submit', () => {
      this.handler()
    })
  }
}
</script>
