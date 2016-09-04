<template>
  <div id="ufs-popup-recharge-success">
    <ufs-modal :show.sync="show">
      <div slot="content">
        <div class="recharge-success-wrap">
          <img class="recharge-success-icon" src="../../images/recharge_success.png" />
          <div class="recharge-success-title">手机充值成功</div>
          <div class="recharge-success-info">
            <div class="recharge-success-info-item clearfix">
              <label class="recharge-success-info-label">充值金额</label>
              <span class="recharge-success-info-value">{{ amount }}</span>
            </div>
            <div class="recharge-success-info-item clearfix">
              <label class="recharge-success-info-label">充值号码</label>
              <span class="recharge-success-info-value" v-text="phoneNumber"></span>
            </div>
            <div class="recharge-success-info-item">预计1小时内到账</div>
          </div>
          <div class="recharge-success-operations">
            <ufs-btn
              text="查看订单"
              btn-style="bg-orange"
              :is-inline="false"
              :click-handler="goToOrderHistory">
            </ufs-btn>
            <ufs-btn
              text="返回会员中心"
              btn-style="bg-white"
              :is-inline="false"
              :click-handler="backToHome">
            </ufs-btn>
          </div>
        </div>
      </div>
    <ufs-modal>
  </div>
</template>

<script>
import UfsModal from '../../components/UfsModal'
import UfsBtn from '../../components/UfsBtn'
import UfsInput from '../../components/UfsInput'

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    },
    amount: {
      type: String,
      require: true
    },
    phoneNumber: {
      type: String,
      required: true
    }
  },
  methods: {
    backToHome () {
      this.show = false
    },
    goToOrderHistory () {
      this.show = false
      this.$router.go({ path: '/order/history' })
    }
  },
  components: {
    UfsModal,
    UfsBtn,
    UfsInput
  }
}
</script>

<style lang="less">
@import '../../styles/variables.less';

@recharge-success-base-color: #5d5e5e;
@recharge-success-background-color: @white;
@recharge-success-info-value-background-color: #eee;

#ufs-popup-recharge-success {
  .recharge-success {
    &-wrap {
      padding: 30px 58px;
      background-color: @recharge-success-background-color;
    }

    &-icon {
      margin: 0 auto 16px;
    }

    &-title {
      font-size: 21px;
      color: @recharge-success-base-color;
      margin-bottom: 20px;
    }

    &-info {
      vertical-align: middle;
      text-align: left;
      color: @recharge-success-base-color;
      font-size: 12px;

      &-item {
        margin-bottom: 18px;
      }

      &-label {
        font-size: 12px;
        margin-right: 22px;
        color: @recharge-success-base-color;
        vertical-align: middle;
        float: left;
        margin-top: 4px;
      }

      &-value {
        padding: 5px 10px;
        background-color: @recharge-success-info-value-background-color;
        color: @recharge-success-base-color;
        vertical-align: middle;
        float: left;
        width: 200px;
      }
    }

    &-operations {
      & > div {
        margin-bottom: 14px;
      }
    }
  }

  @media (max-width: @webBoundary) {
    .recharge-success {
      &-wrap {
        padding: 30px 10px;
      }

      &-info {
        font-size: 14px;

        &-label {
          font-size: 14px;
        }

        &-value {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
