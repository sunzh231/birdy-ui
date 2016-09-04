<template>
  <div id="ufs-order-history">
    <div class="history-filters clearfix">

      <div class="history-type-filter">
        <ufs-btn
          class="show-all-records"
          :text="'全部记录'"
          :btn-style="showAllRecords"
          :btn-size="'small'"
          @click="getType()">
        </ufs-btn>

        <ufs-btn
          class="show-recharge-records"
          :text="'手机充值'"
          :btn-style="showRechargeRecords"
          :btn-size="'small'"
          @click="getType(2)">
        </ufs-btn>

        <ufs-btn
          class="show-gift-records"
          :text="'积分兑礼'"
          :btn-style="showGiftRecords"
          :btn-size="'small'"
          @click="getType(1)">
        </ufs-btn>
      </div>

      <div class="history-date-filter">
        <ufs-select-range
          :msg="dateFilterMessages"
          :type="'calendar'"
          :start-value.sync="recordsParams.startTime"
          :end-value.sync="recordsParams.endTime"
          :callback="getRecordsBetween">
        </ufs-select-range>
      </div>
    </div>

    <div class="record-list">
      <div class="record-item" v-for="order in orders">
        <div class="image-date-wrapper">
          <img class="image" :src="order.goods[0].picture"/>
          <div class="date">{{ order.createdAt }}</div>
        </div>
        <div class="item-info">
          <ufs-clamp
            class="name"
            :text="getItemDescription(order)">
          </ufs-clamp>
          <div class="status" :class="{ 'orange': order.thirdpart === 2 }">
            {{ typeMap[order.thirdpart][order.state] }}
          </div>
          <ufs-btn
            v-show="order.thirdpart === 1"
            class="detail"
            :text="'兑换详情'"
            :btn-size="'small'"
            :btn-type="'link'"
            :link="order.id | formatOrderId">
          </ufs-btn>
        </div>
      </div>
    </div>

    <ufs-pagination
      class="records-pagination"
      :total-pages="totalPages"
      :change-handler="getOrders"
      :current-page.sync="recordsParams.page">
    </ufs-pagination>

    <div class="empty-message" v-show="!$loadingRouteData && orders.length == 0">
      找不到符合条件的兑换记录
    </div>
  </div>
</template>

<style lang="less">
@import "./history.less";
</style>

<script>
import UfsBtn from '../../../components/UfsBtn'
import UfsSelectRange from '../../../components/UfsSelectRange'
import UfsPagination from '../../../components/UfsPagination'
import {loadMore, debounce} from '../../../../../../static/h5/utils/interaction'
import UfsClamp from '../../../components/UfsClamp'
import CONSTANT_GLOBAL from '../../../constant'

const CONSTANT = {
  ...CONSTANT_GLOBAL,
  ORDER_LIST: 'ufscmcmall/order/index',
  WEB_BOUNDARY: 960,
  RECORD_TYPE: {
    RECHARGE: 2,
    JD: 1
  }
}

const getOrderList = function (vm) {
  return vm.$resource(CONSTANT.ORDER_LIST).get(vm.recordsParams).then((response) => {
    return response
  })
}

export default {
  data () {
    return {
      currentPage: 1,
      totalPages: 0, // store the max page number used for pagination
      dateFilterMessages: {
        label: '时间',
        confirm: '查询'
      },
      recordsParams: {
        startTime: '',
        endTime: '',
        type: null,
        page: 1,
        'per-page': 10,
        forMember: true // if set to false, the api will return ALL member's records
      },                // I think there will be a security issue.
      webOrders: [], // store the orders shown in web page and shown in mobile page respectively
      totalOrders: [], // because it will make the logic much easier.
      orders: [],
      typeMap: [
        [], // placeholder, typeMap[0] means nothing
        CONSTANT.orderState,
        CONSTANT.rechargeState
      ]
    }
  },
  route: {
    data () {
      return Promise.all([
        getOrderList(this)
      ]).then((result) => {
        const [orderList] = result
        return {
          webOrders: orderList.data.items,
          totalOrders: orderList.data.items,
          totalPages: orderList.data._meta.pageCount
        }
      })
    }
  },
  methods: {
    setOrders () {
      if (this.mobileDevice) {
        this.orders = this.totalOrders
      } else {
        this.orders = this.webOrders
      }
    },
    getOrders (isScroll) {
      // mobile scroll and avoid pagination callback event
      if (isScroll && typeof isScroll === 'boolean') {
        this.recordsParams.page = this.currentPage + 1
      } else {
        this.orders = []
      }
      this.$resource(CONSTANT.ORDER_LIST).get(this.recordsParams).then((response) => {
        const {_meta: meta, items} = response.data
        this.webOrders = items
        this.totalOrders = this.totalOrders.concat(items)
        this.totalPages = meta.pageCount
        this.currentPage = meta.currentPage
        this.setOrders()
      })
    },
    getType (type) {
      if (type === this.recordsParams.type) {
        return
      }

      this.recordsParams.type = type
      this.recordsParams.page = this.currentPage = 1
      this.totalOrders = []
      this.getOrders()
    },
    getRecordsBetween () {
      this.recordsParams.page = this.currentPage = 1
      this.totalOrders = []
      this.getOrders()
    },
    getItemDescription (order) {
      if (order.thirdpart === 1) { // gift swap order
        return order.goods[0].productName
      } else if (order.thirdpart === 2) { // phone recharge order
        return order.goods[0].description
      } // put other thirdpart type here
    }
  },
  computed: {
    showAllRecords () {
      if (!this.recordsParams.type) {
        return 'bg-orange'
      } else {
        return 'bg-white'
      }
    },
    showRechargeRecords () {
      if (this.recordsParams.type === CONSTANT.RECORD_TYPE.RECHARGE) {
        return 'bg-orange'
      } else {
        return 'bg-white'
      }
    },
    showGiftRecords () {
      if (this.recordsParams.type === CONSTANT.RECORD_TYPE.JD) {
        return 'bg-orange'
      } else {
        return 'bg-white'
      }
    },
    mobileDevice: {
      cache: false,
      get () {
        return document.body.clientWidth <= CONSTANT.WEB_BOUNDARY
      }
    }
  },
  watch: {
    // set the proper orders after the getting data via api
    '$loadingRouteData': function () {
      this.setOrders()
    }
  },
  filters: {
    formatOrderId (id) {
      return {
        name: '记录详情',
        params: {
          orderId: id
        }
      }
    },
    formatClamp (text) {
      return {
        clamp: 2,
        text: text
      }
    }
  },
  components: {
    UfsBtn, UfsSelectRange, UfsPagination, UfsClamp
  },
  ready () {
    loadMore(() => { // this event is binded to window.onscroll
      if (this.mobileDevice && this.currentPage < this.totalPages) {
        this.getOrders(true)
      }
    })

    window.onresize = debounce(() => {
      this.setOrders()
    }, 100)
  },
  destroyed () {
    window.onscroll = null // unbind scroll event
    window.onresize = null // unbind resize event
  }
}
</script>
