<template>
  <div id="ufs-gift-list">
    <div class="filter-wrap">
      <ufs-btn-group
        :list.sync="btns"
        :callback="btnsHandler">
      </ufs-btn-group>
      <ufs-select-range
        :msg="selectRangeMsg"
        :callback="selectRangeHandler">
      </ufs-select-range>
      <div class="sorts-checkbox">
        <section class="sorts">
          <div class="sort" v-for="item in sortBtns" track-by="$index" @click="sortHandler($index)">
            <span v-text="item.textWeb"></span>
            <i class="icon" :class="[item.sort]" ></i>
          </div>
        </section>
        <span class="checkbox-wrap fr">
          <ufs-checkbox :value.sync="onlyAvailable"></ufs-checkbox>
          <span class="content">仅显示我能兑换的商品</span>
        </span>
      </div>
    </div>
    <div class="filter-mobile-wrap clearfix">
      <section class="filters">
        <div class="filter" v-for="item in btnsMobile" @click="filterHandler($index)">
          <div class="icon desc text-overflow" v-show="!item.filterText" v-text="item.text"></div>
          <div class="icon desc text-overflow" v-show="item.filterText" v-text="item.filterText"></div>
        </div>
      </section>
      <div>
        <span class="checkbox-wrap fr">
          <ufs-checkbox :value.sync="onlyAvailable">
          </ufs-checkbox>
          <span class="content">仅显示我能兑换的商品</span>
        </span>
      </div>
    </div>
    <!-- gift list web-->
    <div class="web-list">
      <ufs-gift-list :list.sync="list"></ufs-gift-list>
    </div>

    <!-- gift list mobile-->
    <div class="mobile-list">
      <ufs-gift-list :list.sync="listMobile"></ufs-gift-list>
      <ufs-scroll-tip
        :show="listMobile.length >= 9"
        :current-page="currentPage"
        :total-pages="totalPages">
      </ufs-scroll-tip>
    </div>
    <ufs-pagination
      :total-pages="totalPages"
      :current-page.sync="page"
      :change-handler="changePageHandler">
    </ufs-pagination>

    <section class="empty" v-show="list.length === 0 || listMobile.length === 0">
      <div class="icon"></div>
      <div class="tip" v-show="!loading">
        找不到符合条件的礼品<br/>
        换个筛选条件吧～
      </div>
      <div class="tip" v-show="loading">
        加载中
      </div>
    </section>

    <!-- popup -->
    <ufs-popup
      :show.sync="showpopup">

      <div class="popup-body">
        <section v-show="btnsMobile[0].showpopup">
          <label class="popup-title">请选择一个商品分类</label>
          <ufs-btn-group
            :list.sync="btns"
            :btn-size="btnSize"
            :callback="btnsHandler">
          </ufs-btn-group>
        </section>

        <section v-show="btnsMobile[1].showpopup">
          <label class="popup-title">请选择积分范围</label>
          <ufs-select-range
            :msg="selectRangeMsg"
            :callback="selectRangeHandler">
          </ufs-select-range>
        </section>

        <section v-show="btnsMobile[2].showpopup">
          <label class="popup-title">排序方式</label>
          <ufs-btn-group
            :list.sync="sortBtns"
            :btn-size="sortBtnSize"
            :callback="sortMobileHandler">
          </ufs-btn-group>
        </section>
      </div>
    </ufs-popup>
  </div>
</template>

<style lang="less">
@import "./list.less";

</style>
<script>
// Components
import UfsGiftList from '../../../components/UfsGiftList'
import UfsSelectRange from '../../../components/UfsSelectRange'
import UfsPopup from '../../../components/UfsPopup'
import UfsBtnGroup from '../../../components/UfsBtnGroup'
import UfsBtn from '../../../components/UfsBtn'
import UfsCheckbox from '../../../components/UfsCheckbox'
import UfsPagination from '../../../components/UfsPagination'
import UfsScrollTip from '../../../components/UfsScrollTip'

// Util
import {loadMore} from '../../../../../../static/h5/utils/interaction'

const fetchShelfs = (vm) => {
  const resource = vm.$resource('/api/ufscmcmall/shelf/index')
  return resource.get().then((resp) => {
    const data = resp.data
    return {
      list: formatShelfs(data.items)
    }
  })
}

const fetchGifts = (vm, callback, page) => {
  const params = {
    onlyAvailable: vm.onlyAvailable,
    minScore: vm.minScore,
    maxScore: vm.maxScore,
    type: 0,
    page: page || vm.currentPage,
    'per-page': vm.pagesize
  }
  if (Object.keys(vm.orderBy)) params.orderBy = JSON.stringify(vm.orderBy)
  if (vm.shelfId) params.shelfId = vm.shelfId
  const resource = vm.$resource('/api/ufscmcmall/goods/index', params)
  return resource.get().then((resp) => {
    const data = resp.data
    const format = {
      list: formatGifts(data.items),
      totalPages: data._meta.pageCount,
      currentPage: data._meta.currentPage
    }
    if (callback) callback(format)
    return format
  })
}

const formatShelfs = (shelfs) => {
  const shelfsFormat = []
  shelfs.forEach((item) => {
    if (item.isDefault && item.name === 'ufscmcmall_default_shelf') item.name = '默认货架'
    shelfsFormat.push({
      id: item.id,
      text: item.name,
      isDefault: item.isDefault,
      actived: false
    })
  })
  return shelfsFormat
}

const formatGifts = (gifts) => {
  const giftsFormat = []
  gifts.forEach((item) => {
    giftsFormat.push({
      id: item.id,
      picUrl: item.pictures[0],
      name: item.productName,
      score: item.score,
      convert: item.usedCount,
      isChoice: item.isChoice
    })
  })
  return giftsFormat
}

const updateGifts = (vm, updateMobile = true, page) => {
  vm.loading = true
  fetchGifts(vm, (result) => {
    vm.list = result.list
    vm.totalPages = result.totalPages
    vm.page = result.currentPage
    if (updateMobile) {
      vm.listMobile = result.list
    }
    vm.loading = false
  }, page)
}

const appendGifts = (vm) => {
  vm.loading = true
  fetchGifts(vm, (result) => {
    vm.listMobile = vm.listMobile.concat(result.list)
    vm.totalPages = result.totalPages
    vm.loading = false
  })
}

const isMobile = () => {
  const webBoundary = 960
  const currentWidth = document.body.clientWidth
  return currentWidth <= webBoundary
}

export default {
  data () {
    return {
      list: [],
      listMobile: [],
      selectRangeMsg: {
        label: '积分',
        confirm: '确定',
        point: '分'
      },
      btns: [],
      btnSize: 'middle',
      sortBtns: [
        {
          textWeb: '积分',
          text: '积分 从高到低',
          sort: 'desc',
          name: 'score',
          actived: false
        },
        {
          textWeb: '积分',
          text: '积分 从低到高',
          sort: 'asc',
          name: 'score',
          actived: false
        },
        {
          textWeb: '兑换量',
          text: '兑换量 从多到少',
          sort: 'desc',
          name: 'usedCount',
          actived: false
        },
        {
          textWeb: '上架',
          text: '上架时间 从近到远',
          sort: 'desc',
          name: 'onSaleTime',
          actived: false
        }
      ],
      sortBtnSize: 'large',
      btnsMobile: [
        {
          text: '商品分类',
          showpopup: false,
          filterText: ''
        },
        {
          text: '积分范围',
          showpopup: false,
          filterText: ''
        },
        {
          text: '排序',
          showpopup: false,
          filterText: ''
        }
      ],
      showpopup: false,
      onlyAvailable: false,
      totalPages: 0,
      currentPage: 1,
      page: 1,
      pagesize: 9,
      orderBy: {},
      loading: true
    }
  },
  route: {
    data (transition) {
      return Promise.all([
        fetchGifts(this),
        fetchShelfs(this)
      ])
      .then((result) => {
        this.loading = false
        if (result[0] && result[1]) {
          const [gift, shelf] = result
          return {
            list: gift.list,
            listMobile: gift.list,
            currentPage: gift.currentPage,
            totalPages: gift.totalPages,
            btns: shelf.list
          }
        }
      })
    }
  },
  methods: {
    changePageHandler (pageNum) {
      updateGifts(this, false, pageNum)
      // scroll to top after change page
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    selectRangeHandler (startValue, endValue, desc) {
      this.minScore = startValue
      this.maxScore = endValue
      this.currentPage = 1
      updateGifts(this)
      this.btnsMobile[1].filterText = desc
      this.showpopup = false
    },
    btnsHandler (index) {
      this.shelfId = this.btns[index].id
      this.currentPage = 1
      updateGifts(this)
      this.btnsMobile[0].filterText = this.btns[index].text
      this.showpopup = false
    },
    sortHandler (index) {
      if (this.sortBtns[index].actived) return
      this.sortBtns.forEach((item) => {
        item.actived = false
      })
      this.sortBtns[index].actived = true
      this.orderBy = {}
      this.orderBy[this.sortBtns[index].name] = this.sortBtns[index].sort
      this.currentPage = 1
      updateGifts(this)
    },
    sortMobileHandler (index) {
      this.orderBy = {}
      this.orderBy[this.sortBtns[index].name] = this.sortBtns[index].sort
      this.currentPage = 1
      updateGifts(this)
      this.btnsMobile[2].filterText = this.sortBtns[index].text
      this.showpopup = false
    },
    filterHandler (index) {
      this.btnsMobile.forEach((item) => {
        item.showpopup = false
      })
      this.btnsMobile[index].showpopup = true
      this.showpopup = true
    }
  },
  watch: {
    onlyAvailable () {
      this.currentPage = 1
      updateGifts(this)
    }
  },
  ready () {
    loadMore(() => {
      if (isMobile() && this.currentPage < this.totalPages && !this.showpopup) {
        this.currentPage++
        appendGifts(this)
      }
    })
  },
  components: {
    UfsGiftList, UfsSelectRange, UfsPopup, UfsBtnGroup, UfsCheckbox, UfsPagination, UfsScrollTip
  }
}
</script>
