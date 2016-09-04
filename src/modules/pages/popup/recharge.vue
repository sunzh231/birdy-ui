<template>
  <div id="ufs-popup-recharge">
    <ufs-modal :show.sync="show">
      <div slot="content">
        <div class="phone-recharge">
          <img class="recharge-icon" src="../../images/recharge.png">
          <p class="recharge-title">手机充值</p>
          <div class="recharge-money-selector">
            <span class="recharge-form-title pull-left">充值金额</span>
            <div class="recharge-options">
              <div
                class="recharge-option-wrap"
                v-for="(index, rechargeOption) in handledRechargeOptions">
                <a :class="['recharge-option', {
                    'recharge-option-selected': rechargeOption.selected,
                    'recharge-option-disabled': rechargeOption.disabled
                  }]"
                  @click="handleRechargeOption(phoneRecharge, index)">
                  <span v-text="rechargeOption.productName"></span>
                </a>
              </div>
            </div>
          </div>
          <div class="input-number">
            <span class="recharge-form-title pull-left">充值号码</span>
            <ufs-input
              :value.sync="phoneNumber"
              type="mobile"
              input-size="middle"
              :max-length="11"
              :is-inline="true">
            </ufs-input>
          </div>
          <div>
            <ufs-tip
              :text="tip.text"
              :show.sync="tip.show"
              :event="tip.event">
            </ufs-tip>
            <ufs-btn
              class="recharge-btn"
              :text="spendScore"
              :is-inline="false"
              :disabled="!canRecharge || inSubmit"
              :click-handler="handleSumbitRecharge">
            </ufs-btn>
          </div>
        </div>
      </div>
    </ufs-modal>
  </div>
</template>

<style lang="less">
@import '../../styles/variables.less';
@import '../../../../../static/h5/styles/mixins.less';

@modal-border-color: #939598;
@charge-disable-color: @ufsBarGray;
@charge-font-color: #5d5e5e;
@charge-btn-height: 32px;
@charge-option-disabled-color: #e6e7e8;

#ufs-popup-recharge {
  .phone-recharge {
    width: 290px;
    padding: 30px 58px;
    background: @white;
    height: 400px;
  }

  .modal {
    .modal-dialog {
      max-width: 400px;
    }
  }

  .recharge-icon {
    margin-top: 15px;
  }

  .recharge-title {
    font-size: 21px;
    color: @charge-font-color;
  }

  .recharge-form-title {
    display: inline-block;
    color: @charge-font-color;
    font-size: 12px;
    text-align: left;
    line-height: @charge-btn-height;
  }

  .recharge-money-selector {
    .recharge-options {
      .clearfix();
      margin-left: 70px;
      width: 220px;

      .recharge-option-wrap {
        display: inline-block;
        float: left;
        width: 50%;
        box-sizing: border-box;
        margin-bottom: 8px;

        &:nth-child(2n) {
          padding-left: 4px;
        }

        &:nth-child(2n+1) {
          padding-right: 4px;
        }
      }

      .recharge-option {
        line-height: 16px;
        font-size: 16px;
        width: 100%;
        border: 1px solid @ufsGray;
        color: @ufsOrange;
        padding: 7px 0;
        display: inline-block;

        &-selected {
          background-color: @ufsOrange;
          color: @white;
        }

        &-disabled {
          color:@charge-option-disabled-color;
          pointer-events: none;
        }
      }
    }
  }

  .input-number {
    margin-top: 14px;
    height: @charge-btn-height;

    .ufs-input-container {
      display: block;
      width: 220px;
      margin-left: 70px;

      input {
        width: 100%;
        box-sizing: border-box;
      }
    }
  }

  .recharge-btn {
    margin-top: 30px;
  }
}

@media (max-width: @webBoundary) {
  #ufs-popup-recharge {
    .phone-recharge {
      padding: 10px 13px;
      margin: 0 auto;
    }

    .recharge-icon {
      margin-top: 32px;
    }
  }
}
</style>

<script>
import UfsModal from '../../components/UfsModal'
import UfsBtn from '../../components/UfsBtn'
import UfsInput from '../../components/UfsInput'
import UfsTip from '../../components/UfsTip'
import CONSTANT from '../../constant'

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
      twoWay: true,
      required: true
    },
    rechargeOptions: {
      type: Array,
      default: [],
      required: true
    },
    avaliableScore: {
      type: Number,
      default: 0,
      required: true
    },
    phoneNumber: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      handledRechargeOptions: [],
      inSubmit: false,
      tip: {
        show: false,
        event: null,
        text: ''
      }
    }
  },
  ready () {
    this.getRechargePhone()
  },
  computed: {
    spendScore () {
      const selectedRechargeOption = this.handledRechargeOptions.filter((rechargeOption) => {
        return rechargeOption.selected
      })[0]
      return selectedRechargeOption ? `花${selectedRechargeOption.score}积分充值` : '充值'
    },
    canRecharge () {
      const hasSelectedOption = this.handledRechargeOptions.filter((rechargeOption) => {
        return rechargeOption.selected
      }).length
      const phoneReg = new RegExp(CONSTANT.phoneReg)
      const hasValidPhoneNumber = this.phoneNumber && phoneReg.test(this.phoneNumber)
      return hasSelectedOption && hasValidPhoneNumber
    }
  },
  methods: {
    getRechargePhone () {
      const phoneRegex = new RegExp(CONSTANT.phoneReg)
      if (!phoneRegex.test(this.phoneNumber)) {
        const rechargePhoneResource = this.$resource('/api/ufscmcmall/goods/rechargephone')
        rechargePhoneResource.get().then((response) => {
          if (response.data) {
            this.phoneNumber = response.data.rechargePhone
          }
        })
      }
    },
    initRechargeOptions (rechargeOptions, avaliableScore) {
      let parentSelectedIndex = -1
      let availableIndex = -1
      for (const index in this.rechargeOptions) {
        const rechargeOption = this.rechargeOptions[index]
        this.handledRechargeOptions.$set(index, {
          ...this.rechargeOptions[index],
          disabled: rechargeOption.score > avaliableScore
        })
        if (rechargeOption.selected) {
          parentSelectedIndex = index
        }
        if (rechargeOption.score <= avaliableScore) {
          // Select 2 yuan if score is not enough.
          availableIndex = 0
        }
      }
      if (parentSelectedIndex > -1) {
        const parentSelectedNeedScore = this.handledRechargeOptions[parentSelectedIndex].score
        if (parentSelectedIndex > -1 && parentSelectedNeedScore > avaliableScore) {
          if (availableIndex > -1) {
            this.handledRechargeOptions.$set(availableIndex, {
              ...this.handledRechargeOptions[availableIndex],
              selected: true
            })
          }
          this.handledRechargeOptions.$set(parentSelectedIndex, {
            ...this.handledRechargeOptions[parentSelectedIndex],
            selected: false
          })
        }
      }
    },
    handleRechargeOption (rechargeOption, selectedIndex) {
      for (let index in this.handledRechargeOptions) {
        index = parseInt(index, 10)
        this.handledRechargeOptions.$set(index, {
          ...this.handledRechargeOptions[index],
          selected: selectedIndex === index
        })
      }
    },
    handleSumbitRecharge (event) {
      const selectedRechargeOption = this.handledRechargeOptions.filter((rechargeOption) => {
        return rechargeOption.selected
      })[0]

      const orderResource = this.$resource('ufscmcmall/order/create')
      const params = {
        goodsId: selectedRechargeOption.id,
        thirdpart: 2,
        rechargePhone: this.phoneNumber
      }

      this.inSubmit = true
      orderResource.save(params).then((response) => {
        this.inSubmit = false
        this.$emit('on-submit', {
          phoneNumber: params.rechargePhone,
          productName: selectedRechargeOption.productName
        })
      }, (response) => {
        this.inSubmit = false
        this.tip = {
          show: true,
          text: '提交订单失败，请稍后再试',
          event
        }
      })
    }
  },
  watch: {
    rechargeOptions (newOptions) {
      this.initRechargeOptions(newOptions, this.avaliableScore)
    },
    avaliableScore (newScore) {
      this.initRechargeOptions(this.handledRechargeOptions, newScore)
    }
  },
  components: {
    UfsModal,
    UfsBtn,
    UfsInput,
    UfsTip
  }
}
</script>
