<template>
  <div id="ufs-gift-detail">
    <!-- gift meta info -->
    <div class="detail-meta-wrapper clearfix">
      <i class="gift-tag" v-if="giftInfo.isChoice"></i>
      <img class="product-picture" :src="giftInfo.pictures[0]" />
      <div class="detail-meta">
        <div class="product-name" v-text="giftInfo.productName"></div>
        <div class="product-exchange clearfix">
          <div class="score">兑换积分: {{ giftInfo.score }}</div>
          <div class="used-count">{{ giftInfo.usedCount }}人兑换</div>
        </div>
        <div class="delivery-address">
          <span class="meta-label">送货至</span>
          <ufs-select
            :value.sync="provinceKey"
            :items="provinces"
            size="small"
            :is-inline="true"
            @on-change="changeProvince">
          </ufs-select>
          <span :class="['gift-status', {'out-of-stock': giftStatusTip.isMarkRed}]" v-show="giftStatusTip.isShow">
            {{ giftStatusTip.message }}
          </span>
        </div>
        <div class="count">
          <div class="meta-label">数量</div>
          <ufs-counter :min="1" :value.sync="number" @on-change="changeCount"></ufs-counter>
        </div>
        <div class="exchange-btn">
          <ufs-tip
            :text="userOperationTip.message"
            :show.sync="userOperationTip.isShow">
          </ufs-tip>
          <ufs-btn
            text="立即兑换"
            btn-type="button"
            btn-style="bg-orange"
            btn-size="small"
            :disabled="!canExchange || disableExchangeButton"
            :click-handler="exchangeGift">
          </ufs-btn>
        </div>
      </div>
    </div>
    <gq :show.sync="showGQ" :gq-info="gqInfo" :provinces="provinces" @on-finish="finishGQHandler"></gq>

    <!-- gift sku -->
    <div class="product-sku">产品编号: {{ giftInfo.thirdpartSku }}</div>

    <!-- gift description -->
    <ufs-collapse title="产品详情">
      <div class="product-detail">
        {{{ giftInfo.description }}}
      </div>
    </ufs-collapse>
  </div>
</template>

<script>
import UfsCounter from '../../../components/UfsCounter'
import UfsCollapse from '../../../components/UfsCollapse'
import UfsBtn from '../../../components/UfsBtn'
import UfsTip from '../../../components/UfsTip'
import UfsSelect from '../../../components/UfsSelect'
import gq from '../../popup/gq'
import {debounce} from '../../../../../../static/h5/utils/interaction'
import {lookupMe} from '../../../utils/resource'

const CONSTANT = {
  giftStatusTip: {
    outOfStock: '无货',
    inStock: '有货，免运费'
  },
  userOperationTip: {
    insufficientScore: '您的积分不足，看看其他商品吧',
    selectMore: '选太多啦，积分不够了~'
  }
}

const formatJDProvince = (data) => {
  const result = []
  for (let item of data) {
    result.push({value: item.jdId, text: item.address})
  }
  return result
}

// add more cases here
const escapeList = {
  '<br>': /&lt;br&gt;/ig
}

const escape2Html = (str) => {
  for (const target in escapeList) {
    const reg = escapeList[target]
    str = str.replace(reg, target)
  }

  return str
}

const updateContent = () => {
  if (document.body.clientWidth <= 960) {
    const length = contentCases.length
    for (let i = 0; i < length; i = i + 1) {
      const step = contentCases[i]
      step.set()
    }
  } else {
    const length = contentCases.length
    for (let i = length - 1; i >= 0; i = i - 1) {
      const step = contentCases[i]
      step.restore()
    }
  }
}

const contentCases = [
  { // the case that resize table and images in mobile pages
    styleStorage: {},
    set: function () {
      const wrapper = document.getElementsByClassName('product-detail')[0]
      const tables = wrapper.getElementsByTagName('table')
      const tableCells = wrapper.getElementsByTagName('td')
      const images = wrapper.getElementsByTagName('img')
      const divs = wrapper.getElementsByTagName('div')

      setStyles(this, tables, `
        width: 100%;
        height: auto;
      `, 'table')

      setStyles(this, images, `
        height: auto;
      `, 'image')

      setStyles(this, divs, `
        box-sizing: border-box;
        width: 100%;
      `, 'div')

      setStyles(this, tableCells, `
        display: block;
        height: auto;
        width: 100%;
      `, 'td')
    },
    restore: function () {
      const wrapper = document.getElementsByClassName('product-detail')[0]
      const tables = wrapper.getElementsByTagName('table')
      const tableCells = wrapper.getElementsByTagName('td')
      const images = wrapper.getElementsByTagName('img')
      const divs = wrapper.getElementsByClassName('div')

      restoreStyles(this, tables, 'table')

      restoreStyles(this, images, 'image')

      restoreStyles(this, divs, 'div')

      restoreStyles(this, tableCells, 'td')
    }
  }
]

const setStyles = (self, elems, style, storageNameSpace) => {
  const length = elems.length
  for (let i = 0; i < length; i = i + 1) {
    const elem = elems[i]
    setStyle(self, elem, style, storageNameSpace + i)
  }
}

const setStyle = (self, elem, style, storageNameSpace) => {
  self.styleStorage = self.styleStorage || {}
  const namespace = storageNameSpace || ''

  // stash the web page style. this will be used when restore
  self.styleStorage[namespace] = elem.attributes.style ? elem.attributes.style.value : ''

  elem.setAttribute('style', style)
}

const restoreStyles = (self, elems, storageNameSpace) => {
  const length = elems.length
  for (let i = 0; i < length; i = i + 1) {
    const elem = elems[i]
    restoreStyle(self, elem, storageNameSpace + i)
  }
}

const restoreStyle = (self, elem, storageNameSpace) => {
  self.styleStorage = self.styleStorage || {}
  const namespace = storageNameSpace || ''

  // restore when self.styleStorage[namespace] has value, including ''
  if (self.styleStorage[namespace] !== undefined) {
    elem.setAttribute('style', self.styleStorage[namespace])
  }
}

let states = {}

export default {
  data () {
    return {
      provinceKey: '',
      provinces: [],
      giftInfo: {
        pictures: []
      },
      giftStatusTip: {
        isShow: false,
        isMarkRed: false,
        message: ''
      },
      memberScore: null,
      number: 1,
      userOperationTip: {
        isShow: false,
        message: ''
      },
      hasStock: false,
      showGQ: false,
      gqInfo: {},
      disableExchangeButton: false
    }
  },
  computed: {
    canExchange () {
      let result = false
      if (typeof this.giftInfo.score !== 'undefined' && this.memberScore !== null) {
        if (this.memberScore >= this.giftInfo.score * this.number && this.hasStock) {
          result = true
        }
      }
      return result
    }
  },
  methods: {
    checkScore () {
      if (typeof this.giftInfo.score !== 'undefined' && this.memberScore !== null) {
        if (this.memberScore < this.giftInfo.score * this.number) {
          this.userOperationTip.message = this.number > 1 ? CONSTANT.userOperationTip.selectMore : CONSTANT.userOperationTip.insufficientScore
          this.userOperationTip.isShow = true
        }
      }
    },
    checkStock () {
      const provinceKey = parseInt(this.provinceKey)
      const provinceName = (this.provinces.filter((province) => {
        return province.value === provinceKey
      })[0] || {}).text

      if (this.giftInfo.id && this.number && provinceName) {
        const goodsStockResource = this.$resource('/api/ufscmcmall/goods/stock')
        goodsStockResource.get({
          goodsId: this.giftInfo.id,
          goodsNum: this.number,
          area: provinceName
        }).then((response) => {
          const tipObj = { isShow: true }
          if (response.data.stockStatus === 0) {
            tipObj.isMarkRed = true
            tipObj.message = CONSTANT.giftStatusTip.outOfStock
            this.hasStock = false
          } else {
            tipObj.message = CONSTANT.giftStatusTip.inStock
            this.hasStock = true
          }
          this.giftStatusTip = tipObj
        })
      }
    },
    changeProvince () {
      this.checkStock()
    },
    changeCount () {
      this.checkScore()
      this.checkStock()
    },
    exchangeGift () {
      this.disableExchangeButton = true
      lookupMe(this).then((dmpInfo) => {
        this.disableExchangeButton = false
        this.gqInfo = dmpInfo
        if (this.gqInfo.isGQ) {
          this.$router.go({
            path: '/order/confirm',
            query: {
              giftId: this.giftInfo.id,
              number: this.number
            }
          })
        } else {
          this.showGQ = true
        }
      })
    },
    getGiftInfo (giftId) {
      const goodsResource = this.$resource(`/api/ufscmcmall/goods/info/${giftId}`)
      return goodsResource.get().then((response) => {
        this.giftInfo = response.data
        if (!this.giftInfo || !this.giftInfo.id) {
          this.$router.go({path: '/404'})
          return
        }

        this.giftInfo.description = escape2Html(this.giftInfo.description)
        this.$nextTick(() => { // modify content after the html is rendered by vue
          updateContent()
        })
        Promise.all([
          this.getAllProvinces(),
          this.getShippingAddress(),
          this.getMemberScore()
        ]).then(() => {
          this.checkScore()
          this.checkStock()
        })
      }, (response) => {
        // FIXME: refine
        if (response.status === 400) {
          this.$router.go({path: '/404'})
        }
      })
    },
    getAllProvinces () {
      const provincesResource = this.$resource('/api/ufscmcmall/dmp/province')
      return provincesResource.get().then((response) => {
        const provinces = formatJDProvince(response.data.items)
        this.provinces = provinces
      })
    },
    getShippingAddress () {
      const shippingAddressResource = this.$resource('/api/ufscmcmall/goods/shippingaddress')
      return shippingAddressResource.get().then((response) => {
        this.provinceKey = response.data.shippingProvince.id
      })
    },
    getMemberScore () {
      const memberScoreResource = this.$resource('/api/ufscmcmall/member/score')
      return memberScoreResource.get().then((response) => {
        this.memberScore = response.data.score
      })
    },
    finishGQHandler () {
      this.$router.go({
        path: '/order/confirm',
        query: {
          giftId: this.giftInfo.id,
          number: this.number
        }
      })
    }
  },
  route: {
    data (transition) {
      const giftId = transition.to.params.id
      this.getGiftInfo(giftId)
    }
  },
  ready () {
    states.debouncedUpdate = debounce(updateContent, 100)
    window.addEventListener('resize', states.debouncedUpdate)
  },
  destroyed () {
    window.removeEventListener('resize', states.debouncedUpdate)
  },
  components: {
    UfsCounter,
    UfsCollapse,
    UfsBtn,
    UfsTip,
    UfsSelect,
    gq
  }
}
</script>

<style lang="less">
@import "./detail.less";
</style>
