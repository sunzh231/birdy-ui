<template>
  <div class="ufs-select-range">
    <label>{{ msg.label }}:</label>
    <div class="input-wrap">
      <ufs-tip
        :text="tipMessage"
        :show.sync="startTipShow"
        position="left">
      </ufs-tip>
      <input v-if="type === 'input'" class="start" v-model="startValue"/>
      <span class="point">{{ msg.point }}</span>
      <div>
        <ufs-calendar
          v-if="type === 'calendar'"
          :readonly="readonly"
          :value.sync="startValue">
        </ufs-calendar>
      </div>
    </div>
    <span class="to">至</span>
    <div class="input-wrap">
      <ufs-tip
        :text="tipMessage"
        :show.sync="endTipShow">
      </ufs-tip>
      <input v-if="type === 'input'" class="end" v-model="endValue"/>
      <span class="point">{{ msg.point }}</span>
      <div>
        <ufs-calendar
          v-if="type === 'calendar'"
          :readonly="readonly"
          :value.sync="endValue">
        </ufs-calendar>
      </div>
    </div>
    <div class="confirm-wrap">
      <button class="confirm" v-text="msg.confirm" @click="submit"></button>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';
@import '../../../../static/h5/styles/mixins.less';

@ufs-grey: #231f20;

.ufs-select-range {
  .flex();
  font-size: 16px;
  height: 35px;
  line-height: 35px;

  label, .input-wrap, input, .to, .confirm-wrap, button {
    vertical-align: top;
    text-align: center;
  }

  label {
    color: @ufs-grey;
    margin-right: 4px;
  }

  input {
    box-sizing: border-box;
    display: inline-block;
    outline: 0;
    margin: 0;
    border-radius: 0;
    appearance: none;
    width: 73px;
    height: 35px;
    padding: 0px 3px;
    box-shadow: none;
    border: 1px solid @ufsDooseGrey;
    color: @ufsFontGray;
    font-size: 15px;

    &:focus {
      border-color: @ufsOrange;
      box-shadow: 0 0 1px rgba(255, 90, 0, 0.85) inset, 0 0 5px rgba(255, 90, 0, 0.45);
    }
  }

  .input-wrap {
    display: inline-block;
    position: relative;
  }

  .ufs-tip {
    width: 200px;
    height: 20px;
    line-height: 20px;
  }

  .to {
    color: @ufsFontGray;
    margin-left: 4px;
    margin-right: 4px;
  }

  .point {
    color: @ufsFontGray;
  }

  .confirm-wrap {
    font-size: 14px;
    margin-left: 8px;
  }

  .confirm {
    width: 100%;
    height: 35px;
    padding-left: 15px;
    padding-right: 15px;
    background-color: @ufsOrange;
    color: @white;
    cursor: pointer;
  }
}

@media (max-width: @webBoundary) {
  .ufs-select-range {
    display: inherit;
    font-size: 12px;
    height: auto;
    width: 208px;
    margin: 10px auto 0 auto;

    label {
      display: none;
    }

    input {
      height: 35px;
    }

    .ufs-tip {
      margin-bottom: 28px;
    }

    .input-wrap {
      &:first-child {
        float: left;
      }

      &:last-child {
        float: right;
      }
    }

    .confirm-wrap {
      width: 100%;
      margin: 0;
    }

    .confirm {
      margin-top: 14px;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
}
</style>

<script>
import UfsCalendar from './UfsCalendar'
import UfsTip from './UfsTip'

const isString = function (str) {
  return typeof (str) === 'string'
}

const trim = function (str) {
  return str && isString(str) ? str.replace(/(^\s*)|(\s*$)/g, '') : str
}

const formatResult = function (startValue, endValue) {
  return (startValue || endValue) ? `${startValue || 0} - ${endValue || ''}` : ''
}

export default {
  props: {
    msg: {
      type: Object,
      required: true
    },
    startValue: {
      required: false,
      twoWay: true
    },
    endValue: {
      required: false,
      twoWay: true
    },
    type: {
      type: String, // calendar
      required: false,
      default: 'input'
    },
    callback: {
      type: Function,
      required: false
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tipMessage: '你设置的过滤条件不对，换个试试看',
      startTipShow: false,
      endTipShow: false
    }
  },
  methods: {
    submit () {
      const numberReg = /^(([1-9]\d*)|0)(\.\d{0,2})?$/
      if (this.type !== 'calendar') {
        const positions = ['start', 'end']
        for (const position of positions) {
          this[`${position}Value`] = trim(this[`${position}Value`])
          const value = this[`${position}Value`]
          if (value) {
            if (!numberReg.test(value)) {
              this[`${position}TipShow`] = true
              return
            }
            this[`${position}Value`] = parseFloat(value)
          }
        }
      }

      if ((this.startValue || this.startValue === 0) && (this.endValue || this.endValue === 0)) {
        if (this.type === 'calendar') {
          if (new Date(this.startValue).getTime() > new Date(this.endValue).getTime()) {
            this.endTipShow = true
            return
          }
        } else if (this.startValue > this.endValue) {
          this.endTipShow = true
          return
        }
      }

      if (this.callback) this.callback(this.startValue, this.endValue, formatResult(this.startValue, this.endValue))
    }
  },
  components: {
    UfsCalendar, UfsTip
  }
}
</script>
