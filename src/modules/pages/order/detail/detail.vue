<template>
  <div id="ufs-order-detail">
    <logistics :logistics="logistics" :show.sync="show"></logistics>
    <ufs-order-template :template="template" :gifts="orderInfo.goods">
      <div slot="header">
        <div class="pc-header">
          <div class="header-img complet-header-img"></div>
          <span class="header-title">{{ orderState[orderInfo.state] }}</span>
          <div class="order-completion-info">
            <label>订单号:</label>
            <span>{{ orderInfo.id }}</span>
          </div>
          <div class="order-completion-info">
            <label>下单时间:</label>
            <span>{{ orderDate }}</span>
          </div>
        </div>
        <div class="mobile-header">
          <div class="header-img complet-header-img"></div>
          <div class="header-info">
            <span class="header-title">{{ orderState[orderInfo.state] }}</span>
            <div class="order-completion-info">
              <label>订单号:</label>
              <span>{{ orderInfo.id }}</span>
            </div>
            <div class="order-completion-info">
              <label>下单时间:</label>
              <span>{{ orderDate }}</span>
            </div>
          </div>
        </div>
      </div>
      <div slot="receiptAddress" class="receipt-address">
        <ul>
          <li>
            <label>收货人:</label>
            <span>{{ orderInfo.shippingName }}</span>
          </li>
          <li>
            <label>收货地址:</label>
            <span>{{ orderInfo.shippingFullAddress }}</span>
          </li>
          <li>
            <label>联系方式:</label>
            <span>{{ orderInfo.shippingPhone }}</span>
          </li>
        </ul>
      </div>
      <div slot="logistics" class="logistics">
        <div class="time-line">
          <div class="time-point"></div>
        </div>
        <div class="logistics-newly-info">
          <span class="logistics-time">{{ logisticsNewly.msgTime }}</span>
          <span class="logistics-text">{{ logisticsNewly.content }}</span>
        </div>
        <ufs-btn
          :text="showLogisticsBtn.text"
          :is-inline="showLogisticsBtn.isInline"
          :btn-size="showLogisticsBtn.btnSize"
          :click-handler="showLogistics">
        </ufs-btn>
      </div>
    </ufs-order-template>
  </div>
</template>

<style lang="less">
@import "./detail.less";
</style>

<script>
import UfsOrderTemplate from '../../../components/UfsOrderTemplate'
import UfsBtn from '../../../components/UfsBtn'
import logistics from '../../popup/logistics'
import CONSTANT from '../../../constant'

export default {
  data () {
    return {
      header: '订单完成',
      orderState: CONSTANT.orderState,
      showLogisticsBtn: {
        text: '查看全部',
        isInline: false,
        btnSize: 'small'
      },
      template: [
        {
          title: '收货地址',
          type: 'receiptAddress'
        },
        {
          title: '物流信息',
          type: 'logistics'
        },
        {
          title: '商品信息',
          type: 'giftInfo'
        }
      ],
      orderInfo: {},
      logistics: {},
      logisticsNewly: {},
      show: false
    }
  },
  computed: {
    orderDate () {
      if (this.orderInfo && this.orderInfo.createdAt) {
        return this.orderInfo.createdAt.slice(0, 10)
      }
      return ''
    }
  },
  methods: {
    getOrderDetail (orderId) {
      const resource = this.$resource(`ufscmcmall/order/order/${orderId}`)
      resource.get().then((response) => {
        this.orderInfo = response.data
        if (!this.orderInfo || !this.orderInfo.id) {
          this.$router.go({path: '/404'})
          return
        }

        this.getNewlyLogistics(orderId)
      }, (response) => {
        // FIXME: refine
        if (response.status === 400) {
          this.$router.go({path: '/404'})
        }
      })
    },
    getNewlyLogistics (orderId) {
      const resource = this.$resource(`ufscmcmall/jd-api/track/${orderId}`)
      resource.get().then((response) => {
        this.logistics = response.data
        const logisticsArray = this.logistics.orderTrack
        this.logisticsNewly = logisticsArray[logisticsArray.length - 1]
      }, (response) => {
        this.logistics = {
          orderTrack: [{
            content: '您提交了订单，请等待系统确认',
            msgTime: this.orderInfo.createdAt,
            operator: '客户'
          }]
        }
        const logisticsArray = this.logistics.orderTrack
        this.logisticsNewly = logisticsArray[logisticsArray.length - 1]
      })
    },
    showLogistics () {
      this.show = true
    }
  },
  route: {
    data (transition) {
      const orderId = transition.to.params.orderId
      this.getOrderDetail(orderId)
    }
  },
  components: {
    UfsOrderTemplate, UfsBtn, logistics
  }
}
</script>
