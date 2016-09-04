<template>
  <div id="ufs-order-confirm">
    <address-editor :show.sync="editAddressPopupShow" :address-info.sync="addressInfo"></address-editor>
    <ufs-order-template :template="template" :gifts="gifts">
      <div slot="header">
        <div class="header-img"></div>
        <span class="header-title">{{ header }}</span>
      </div>
      <div slot="receiptAddress" class="receipt-address">
        <div class="radio-selected"></div>
        <div class="receipt-address-info">
          <span>{{ receiptAddress.name }}</span>
          <span class="receipt-tel">{{ receiptAddress.tel }}</span>
          <span>{{ receiptAddress.address }}</span>
        </div>
        <ufs-btn
          :text="editAddressBtn.text"
          :is-inline="editAddressBtn.isInline"
          :btn-size="editAddressBtn.btnSize"
          :click-handler="editAddressPopup">
        </ufs-btn>
      </div>
    </ufs-order-template>
    <div class="template-submit">
      <div class="tip-control">
        <ufs-btn
          :text="confirmBtn.text"
          :btn-size="confirmBtn.btnSize"
          :click-handler="confirmExchangeHandler"
          :disabled="disableSubmit">
        </ufs-btn>
        <ufs-tip
          :text="msgTip.message"
          :show.sync="msgTip.isShow">
        </ufs-tip>
        <span>
          <label>合计积分</label>
          <div class="total-points">{{ totalPoints }}</div>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import "./confirm.less";
</style>

<script>
import UfsOrderTemplate from '../../../components/UfsOrderTemplate'
import addressEditor from '../../popup/addressEditor'
import UfsBtn from '../../../components/UfsBtn'
import UfsTip from '../../../components/UfsTip'

const CONSTANT = {
  msgTip: {
    completeAddress: '收货地址不完整，请先编辑地址',
    serverError: '服务器繁忙，请稍后再试'
  }
}

const getGiftInfo = function (vm) {
  const giftId = vm.query.giftId
  const resource = vm.$resource(`ufscmcmall/goods/info/${giftId}`)
  return resource.get().then((response) => {
    return response
  })
}

const getShippingAddress = function (vm) {
  const resource = vm.$resource('ufscmcmall/goods/shippingaddress')
  return resource.get().then((response) => {
    return response
  })
}

export default {
  data () {
    return {
      header: '请确认您的订单',
      editAddressBtn: {
        text: '编辑地址',
        isInline: false,
        btnSize: 'small'
      },
      confirmBtn: {
        text: '确认兑换',
        btnSize: 'small'
      },
      msgTip: {
        isShow: false,
        message: ''
      },
      template: [
        {
          title: '收货地址',
          type: 'receiptAddress'
        },
        {
          title: '商品信息',
          type: 'giftInfo'
        }
      ],
      addressInfo: {},
      receiptAddress: {},
      gifts: [],
      editAddressPopupShow: false,
      disableSubmit: false // prevent multiple clicks to send multiple requests
    }
  },
  computed: {
    totalPoints () {
      let consumption = 0
      const iter = this.gifts[Symbol.iterator]()
      for (let gift of iter) {
        consumption += gift.score * gift.count
      }

      return consumption
    },
    receiptAddress () {
      return this.formatAddress(this.addressInfo)
    }
  },
  methods: {
    confirmExchangeHandler () {
      if (this.validateShippingAddress()) {
        this.disableSubmit = true
        const resource = this.$resource('ufscmcmall/order/create')
        const params = {
          goodsId: this.query.giftId,
          count: this.query.number,
          thirdpart: 1
        }

        resource.save(params).then((response) => {
          this.$router.go({
            path: '/order/success',
            query: {
              orderId: response.data.orderId
            }
          })
          this.disableSubmit = false
        }, (response) => {
          this.msgTip = {
            isShow: true,
            message: response.data.message || CONSTANT.msgTip.serverError
          }
          this.disableSubmit = false
        })
      }
    },
    validateShippingAddress () {
      const shippingAddress = this.addressInfo
      if (this.addressInfo.shippingName && this.addressInfo.shippingPhone && this.addressInfo.shippingProvince && this.addressInfo.shippingCity && this.addressInfo.shippingCounty && this.addressInfo.shippingAddress && this.addressInfo.shippingPostcode) {
        return true
      } else {
        this.msgTip = {
          isShow: true,
          message: CONSTANT.msgTip.completeAddress
        }

        return false
      }
    },
    editAddressPopup () {
      this.editAddressPopupShow = true
    },
    formatAddress (address) {
      const shippingAddress = `${address.shippingProvince ? address.shippingProvince.name : ''}${address.shippingCity ? address.shippingCity.name : ''}${address.shippingCounty ? address.shippingCounty.name : ''}${address.shippingTown ? address.shippingTown.name : ''}${address.shippingAddress || ''}`

      return {
        name: address.shippingName,
        tel: address.shippingPhone,
        address: shippingAddress
      }
    }
  },
  route: {
    data (transition) {
      this.query = transition.to.query

      return Promise.all([
        getGiftInfo(this),
        getShippingAddress(this)
      ]).then((result) => {
        let [giftInfo, shippingAddress] = result
        if (giftInfo && shippingAddress) {
          let gift = giftInfo.data
          Object.assign(gift, {
            picture: gift.pictures[0],
            count: this.query.number
          })
          this.gifts = [gift]
          this.addressInfo = shippingAddress.data
        }
      })
    }
  },
  components: {
    UfsOrderTemplate, addressEditor, UfsBtn, UfsTip
  }
}
</script>
