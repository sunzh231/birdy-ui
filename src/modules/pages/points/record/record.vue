<template>
  <div id="ufs-points-record">
    <div class="points-info">
      <div class="rules">
        <a class="points-rules" v-link="{ name: '积分规则' }">了解积分规则</a>
      </div>

      <div class="remain-points">
        <span class="remain-points-text">可用积分:</span>
        <span class="remain-points-number">{{ availablePoints }}</span>
      </div>

      <div class="overdue-points">
        <div class="number-line">
          <span class="overdue-points-text">即将过期:</span>
          <span class="overdue-points-number">{{ pointsToBeExpired }}</span>
        </div>
        <div class="date-line">
          <span class="overdue-points-date"><span>{{ expirationDate }}</span>过期</span>
        </div>
      </div>
    </div>

    <div class="record-filter clearfix">
      <div class="filter-buttons">
        <ufs-btn class="all"
          :text="'全部明细'"
          :btn-size="'small'"
          :btn-style="allRecordActivated"
          @click="getRecords(0)">
        </ufs-btn>

        <ufs-btn class="acquisition"
          :text="'积分获取'"
          :btn-size="'small'"
          :btn-style="acquisitionActivated"
          @click="getRecords(1)">
        </ufs-btn>

        <ufs-btn class="consumption"
          :text="'积分消费'"
          :btn-size="'small'"
          :btn-style="consumptionActivated"
          @click="getRecords(2)">
        </ufs-btn>
      </div>

      <div class="filter-date">
        <ufs-select-range
          :msg="filterMessages"
          :start-value.sync="recordsParams.startDate"
          :end-value.sync="recordsParams.endDate"
          :callback="getRecordsBetween"
          :type="'calendar'">
        </ufs-select-range>
      </div>
    </div>

    <div class="records">
      <!-- table for pc page -->
      <table class="records-table striped" v-show="tableList.length > 0">
        <thead>
          <tr>
            <th class="point">积分</th>
            <th class="point-type">积分类型</th>
            <th class="description">描述</th>
            <th class="date">日期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="line in tableList">
            <td>{{ line.score | formatScore }}</td>
            <td>{{ line.type }}</td>
            <td><ufs-clamp :text="line.description"></ufs-clamp></td>
            <td>{{ line.createdTime }}</td>
          </tr>
        </tbody>
      </table>

      <ufs-pagination
        class="records-table-pagination"
        :total-pages="totalPages"
        :change-handler="getList"
        :current-page.sync="recordsParams.page">
      </ufs-pagination>

      <div class="empty-message show-in-web" v-show="!$loadingRouteData && tableList.length === 0">
        没有发现积分明细
      </div>

      <!-- table/list for mobile page -->
      <table class="records-mobile-table" v-show="totalTableList.length > 0">
        <tbody>
          <tr v-for="line in totalTableList">
            <td class="points-type"><span class="type">{{ line.type }}</span><span class="date">{{ line.createdTime }}</span></td>
            <td class="points-change">{{ line.score | formatScore }}</td>
          </tr>
        </tbody>
      </table>

      <div class="empty-message show-in-mobile" v-show="!$loadingRouteData && totalTableList.length === 0">
        没有发现积分明细
      </div>

    </div>
  </div>
</template>

<style lang="less">
@import "./record.less";
</style>

<script>
import UfsBtn from '../../../components/UfsBtn'
import UfsPagination from '../../../components/UfsPagination'
import UfsSelectRange from '../../../components/UfsSelectRange'
import UfsClamp from '../../../components/UfsClamp'
import {loadMore} from '../../../../../../static/h5/utils/interaction'

const CONSTANT = {
  RESOURCE: {
    SCORE: 'ufscmcmall/member/score',
    EXPIRED_SCORE: 'ufscmcmall/member/will-expired-score',
    SCORE_HISTORY: 'ufscmcmall/member/score-history'
  },
  MOBILE: {
    LIST_LINE_HEIGHT: 48,
    HEADER_HEIGHT: 51,
    SCORE_HEIGHT: 106,
    BUTTONS_HEIGHT: 48
  }
}

const getAvailablePoints = function (vm) {
  const availablePoints = vm.$resource(CONSTANT.RESOURCE.SCORE)

  return availablePoints.get().then((response) => {
    return response
  })
}

const getPointsToBeExpired = function (vm) {
  const pointsToBeExpired = vm.$resource(CONSTANT.RESOURCE.EXPIRED_SCORE)

  return pointsToBeExpired.get().then((response) => {
    return response
  })
}

const getPointsRecord = function (vm) {
  const pointsRecord = vm.$resource(CONSTANT.RESOURCE.SCORE_HISTORY)

  return pointsRecord.get(vm.recordsParams).then((response) => {
    return response
  })
}

export default {
  data () {
    return { // variables that will rendered in the page
      currentPage: 1,
      totalPages: 0, // store the max page number used for pagination
      availablePoints: 0,
      pointsToBeExpired: 0,
      expirationDate: '0000-00-00',
      tableList: [],
      totalTableList: [],
      recordsParams: {
        type: 0,
        startDate: null,
        endDate: null,
        page: 1,
        'per-page': 15
      },
      filterMessages: {
        label: '时间',
        confirm: '查询'
      }
    }
  },
  route: {
    data (transition) {
      return Promise.all([
        getAvailablePoints(this),
        getPointsToBeExpired(this),
        getPointsRecord(this)
      ]).then((result) => {
        const [availablePoints, pointsToBeExpired, pointsRecord] = result
        return {
          availablePoints: availablePoints.data.score,
          pointsToBeExpired: pointsToBeExpired.data.score,
          expirationDate: pointsToBeExpired.data.expiredAt,
          totalPages: pointsRecord.data._meta.pageCount,
          tableList: pointsRecord.data.items,
          totalTableList: pointsRecord.data.items
        }
      })
    }
  },
  methods: {
    getList (isScroll) {
      const pointsRecord = this.$resource(CONSTANT.RESOURCE.SCORE_HISTORY)
      // mobile scroll and avoid pagination callback event
      if (isScroll && typeof isScroll === 'boolean') {
        this.recordsParams.page = this.currentPage + 1
      }
      this.tableList = []
      pointsRecord.get(this.recordsParams).then((response) => {
        const {_meta: meta, items: items} = response.data
        this.currentPage = meta.currentPage
        this.totalPages = meta.pageCount
        this.tableList = items
        this.totalTableList = this.totalTableList.concat(items)
      })
    },
    getRecords (type) { // used for type filter
      if (type === this.recordsParams.type) {
        return
      }

      this.recordsParams.type = type
      this.recordsParams.page = 1
      this.currentPage = 1
      this.totalTableList = []
      this.getList()
    },
    getRecordsBetween () { // used for date filter
      this.recordsParams.page = 1
      this.currentPage = 1
      this.totalTableList = []
      this.getList()
    }
  },
  computed: {
    allRecordActivated () {
      if (this.recordsParams.type === 0) {
        return 'bg-orange'
      } else {
        return 'bg-white'
      }
    },
    acquisitionActivated () {
      if (this.recordsParams.type === 1) {
        return 'bg-orange'
      } else {
        return 'bg-white'
      }
    },
    consumptionActivated () {
      if (this.recordsParams.type === 2) {
        return 'bg-orange'
      } else {
        return 'bg-white'
      }
    },
    mobileDevice: {
      cache: false,
      get () {
        return document.body.clientWidth <= 960
      }
    }
  },
  filters: {
    formatScore (score) {
      if (score >= 0) {
        return `+${score}`
      } else {
        return `-${Math.abs(score)}`
      }
    }
  },
  components: {
    UfsBtn, UfsPagination, UfsSelectRange, UfsClamp
  },
  ready () {
    loadMore(() => { // this event is binded to window.onscroll
      if (this.mobileDevice && this.currentPage < this.totalPages) {
        this.getList(true)
      }
    })
  },
  destroyed () {
    window.onscroll = null // unbind scroll event
  }
}
</script>
