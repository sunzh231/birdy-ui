<template>
  <div id="ufs-popup-address-editor">
    <ufs-modal :show.sync="show">
      <div slot="content">
        <div class="address-editor-container"
          :class="[
            shippingName ? 'edit' : 'add'
          ]">
          <p class="title">{{ shippingName ? '编辑' : '增加' }}地址</p>
          <p class="title-tip">（带 * 为必填项）</p>
          <ufs-input
            :value.sync="shippingName"
            label="收货人"
            :required="true"
            input-size="large"></ufs-input>

          <p class="address-label">收货地址</p>
          <div class="address-container">
            <ufs-select
              :value.sync="shippingProvince"
              :items="optionsProvince"
              :required="true"
              placeholder="所在地区"
              size="middle"
              :is-inline="true"
              :change-handler="changeProvince">
            </ufs-select><ufs-select
              :value.sync="shippingCity"
              :items="optionsCity"
              :required="true"
              placeholder="所在城市"
              size="middle"
              :is-inline="true"
              :change-handler="changeCity">
            </ufs-select>
          </div>
          <div class="address-container">
            <ufs-select
              :value.sync="shippingCounty"
              :items="optionsCounty"
              :required="true"
              placeholder="区 / 县"
              size="middle"
              :is-inline="true"
              :change-handler="changeCountry">
            </ufs-select><ufs-select
              v-show="optionsTown.length"
              :value.sync="shippingTown"
              :items="optionsTown"
              placeholder="所属街道"
              size="middle"
              :is-inline="true">
            </ufs-select>
            <ufs-input
              :value.sync="shippingAddress"
              placeholder="详细地址"
              :required="true"
              input-size="large"></ufs-input>
          </div>

          <ufs-input
            :value.sync="shippingPhone"
            label="手机号码"
            type="mobile"
            :required="true"
            input-size="large"></ufs-input>
          <ufs-input
            :value.sync="shippingPostcode"
            label="邮编"
            :required="true"
            :validate-handler="shippingPostcodeValidator"
            input-size="large"></ufs-input>

          <div class="btn-container">
            <ufs-tip
              :text="tip.text"
              :show.sync="tip.show"
              :event="tip.event"></ufs-tip>
            <ufs-btn
              text="保存并使用该地址"
              :click-handler="saveAddressInfo"
              btn-size="middle"
              :is-inline="true"
              :disabled="saveFlag"></ufs-btn>
          </div>
        </div>
      </div>
    </ufs-modal>
  </div>

</template>

<style lang="less">
@import '../../styles/variables.less';

#ufs-popup-address-editor {
  .modal {
    .modal-dialog {
      margin: 0 auto;
      max-width: 750px;
    }
  }

  .address-editor-container {
    background: #FFF;
    width: 500px;
    padding: 55px 125px;
    color: @ufsFontBlack;
    font-size: 16px;
    line-height: 20px;

    p {
      margin: 0;
    }

    .title {
      font-size: 21px;
    }

    .title-tip {
      font-size: 14px;
      color: #9e9e9f;
      margin: 7px auto 20px;
    }

    .ufs-input-container {
      .ufs-input {
        width: 478px;
      }
    }

    .address-label {
      text-align: left;
      padding: 5px 0;
      &:after {
        content: ' *';
        font-size: 14px;
      }
    }

    .address-container {
      text-align: left;
      margin-left: -10px;

      .ufs-select-container {
        margin-left: 10px;
        width: 243px;
      }

      .ufs-input-container {
        margin-left: 10px;
      }
    }

    .btn-container {
      margin-top: 54px;
    }
  }
}

@media (max-width: @webBoundary) {
  #ufs-popup-address-editor {
    .address-editor-container {
      box-sizing: border-box;
      width: 100%;
      padding: 36px 15px;
      font-size: 14px;
      line-height: 18px;

      .title {
        line-height: normal;
      }

      .title-tip {
        font-size: 12px;
        margin: 10px auto 10px;
      }

      .ufs-input-container {
        .ufs-input.large {
          width: 100%;
        }
      }

      .address-container {
        margin-left: -2%;

        .ufs-select-container {
          margin-left: 2%;
          width: 48%;
        }
        .ufs-input-container {
          margin-left: 2%;
        }
      }

      .btn-container {
        margin-top: 24px;
        padding: 0;
      }
    }
  }
}
</style>

<script>
import UfsModal from '../../components/UfsModal'
import UfsBtn from '../../components/UfsBtn'
import UfsInput from '../../components/UfsInput'
import UfsSelect from '../../components/UfsSelect'
import UfsTip from '../../components/UfsTip'

import CONSTANT from '../../constant'

const extraInfoFieldArr = ['Name', 'Phone', 'Postcode', 'Address']
const addressFieldArr = ['Province', 'City', 'County', 'Town']

export default {
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false
    },
    addressInfo: {
      type: Object,
      required: false,
      default: () => {
        return {
        }
      }
    }
  },
  data () {
    return {
      provinceCityMap: {},
      cityCountryMap: {},
      countryTownMap: {},
      fieldDict: {},
      optionsProvince: [],
      optionsCity: [],
      optionsCounty: [],
      optionsTown: [],
      shippingName: null,
      shippingPhone: null,
      shippingPostcode: null,
      shippingAddress: null,
      shippingProvince: null,
      shippingCity: null,
      shippingCounty: null,
      shippingTown: null,
      saveFlag: false,
      tip: {
        show: false,
        text: '',
        event: null
      }
    }
  },
  methods: {
    shippingPostcodeValidator (value) {
      const shippingPostcodeRegex = /^\d{6}$/
      return shippingPostcodeRegex.test(value) ? '' : '格式错误，请填写6位邮政编码'
    },

    shippingPhoneValidator (value) {
      const shippingPhoneRegex = new RegExp(CONSTANT.phoneReg)
      return shippingPhoneRegex.test(value) ? '' : '格式错误，请填写11位手机号码'
    },

    formatAddressExtraInfo () {
      for (let field of extraInfoFieldArr) {
        this[`shipping${field}`] = this.addressInfo[`shipping${field}`] || null
      }
    },

    formatJDAddress () {
      for (let field of addressFieldArr) {
        this[`shipping${field}`] = this.addressInfo[`shipping${field}`] ? this.addressInfo[`shipping${field}`].id : null
      }
    },

    formatOptions (result) {
      var optionList = []
      for (let key in result) {
        let id = result[key]
        optionList.push({value: id, text: key})
        this.fieldDict[id] = key
      }
      return optionList
    },

    getOptionList (url, paramObj, successCallback, failCallback) {
      const resource = this.$resource(url)
      resource.get(paramObj).then((response) => {
        var data = response.data
        if (data.success) {
          successCallback(data.result)
        } else if (failCallback) {
          failCallback(data)
        }
      })
    },

    getProvinceList () {
      if (this.optionsProvince.length) {
        return
      }

      const url = '/api/ufscmcmall/jd-api/all-province'
      var paramObj = {}
      this.getOptionList(url, paramObj, (result) => {
        this.optionsProvince = this.formatOptions(result)
      })
    },

    getCityList (provinceNum) {
      provinceNum = provinceNum || this.shippingProvince
      if (!provinceNum) {
        return
      }

      var optionsCity = this.provinceCityMap[provinceNum]
      if (optionsCity) {
        this.optionsCity = optionsCity
        return
      }

      const url = '/api/ufscmcmall/jd-api/city-by-province'
      var paramObj = {provinceNum: provinceNum}
      this.getOptionList(url, paramObj, (result) => {
        this.optionsCity = this.formatOptions(result)
        this.provinceCityMap[provinceNum] = this.optionsCity
      })
    },

    getCountryList (cityNum) {
      cityNum = cityNum || this.shippingCity
      if (!cityNum) {
        return
      }

      var optionsCounty = this.cityCountryMap[cityNum]
      if (optionsCounty) {
        this.optionsCounty = optionsCounty
        return
      }

      const url = '/api/ufscmcmall/jd-api/county-by-city'
      var paramObj = {cityNum: cityNum}
      this.getOptionList(url, paramObj, (result) => {
        this.optionsCounty = this.formatOptions(result)
        this.cityCountryMap[cityNum] = this.optionsCounty
      })
    },

    getTownList (countyNum) {
      countyNum = countyNum || this.shippingCounty
      if (!countyNum) {
        return
      }

      var optionsTown = this.countryTownMap[countyNum]
      if (optionsTown) {
        this.optionsTown = optionsTown
        return
      }

      const url = '/api/ufscmcmall/jd-api/towns-by-county'
      var paramObj = {countyNum: countyNum}
      this.getOptionList(url, paramObj, (result) => {
        this.optionsTown = this.formatOptions(result)
        this.countryTownMap[countyNum] = this.optionsTown
      }, (result) => {
        this.optionsTown = []
        this.countryTownMap[countyNum] = []
      })
    },

    emptyFields (level) {
      const fieldsToBeEmpty = addressFieldArr.slice(level)
      for (let field of fieldsToBeEmpty) {
        this[`shipping${field}`] = null
        this[`options${field}`] = []
      }
    },

    changeProvince (val) {
      this.emptyFields(1)
      this.getCityList(val)
    },

    changeCity (val) {
      this.emptyFields(2)
      this.getCountryList(val)
    },

    changeCountry (val) {
      this.emptyFields(3)
      this.getTownList(val)
    },

    getFieldObj (fieldId) {
      if (!fieldId) {
        return null
      }

      var fieldName = this.fieldDict[fieldId]
      if (!fieldName) {
        return null
      }

      return {
        id: fieldId,
        name: fieldName
      }
    },

    saveAddressInfo (event) {
      let addressInfoParam = {}
      for (let field of extraInfoFieldArr) {
        addressInfoParam[`shipping${field}`] = this[`shipping${field}`]
      }
      for (let field of addressFieldArr) {
        addressInfoParam[`shipping${field}`] = this.getFieldObj(this[`shipping${field}`])
      }

      var isValid = true
      for (let key in addressInfoParam) {
        if (key === 'shippingTown') {
          continue
        }
        let val = addressInfoParam[key]
        val = typeof val === 'string' ? val.trim() : val
        if (!val) {
          isValid = false
        }
      }
      if (isValid) {
        isValid = !this.shippingPhoneValidator(addressInfoParam.shippingPhone) && !this.shippingPostcodeValidator(addressInfoParam.shippingPostcode)
      }
      if (!isValid) {
        this.$broadcast('submit')
        return
      }

      this.saveFlag = true
      const saveUrl = '/api/ufscmcmall/goods/update-shippingaddress'
      const resource = this.$resource(saveUrl)
      resource.save(addressInfoParam).then((response) => {
        var data = response.data
        if (data.status && data.status.toLowerCase() === 'ok') {
          this.addressInfo = addressInfoParam
          this.show = false
        } else {
          this.tip = {
            show: true,
            text: data.message || '保存失败，请稍后再试',
            event
          }
        }
        this.saveFlag = false
      }, (response) => {
        this.tip = {
          show: true,
          text: response.data.message || '保存失败，请稍后再试',
          event
        }
        this.saveFlag = false
      })
    },

    removeInvalidClass () {
      const addressEditor = document.getElementById('ufs-popup-address-editor')
      const invalidClass = 'invalid'
      let inputFeilds = addressEditor.getElementsByClassName('ufs-input-container')
      for (let feild of inputFeilds) {
        if (feild.classList.contains(invalidClass)) {
          feild.classList.remove(invalidClass)
        }
      }
      let selectFeilds = addressEditor.getElementsByClassName('ufs-select-container')
      for (let feild of selectFeilds) {
        if (feild.classList.contains(invalidClass)) {
          feild.classList.remove(invalidClass)
        }
      }
    }
  },
  watch: {
    show (val, oldVal) {
      if (val) {
        this.formatAddressExtraInfo()
        this.formatJDAddress()
        this.getProvinceList()
        this.getCityList()
        this.getCountryList()
        this.getTownList()
      } else {
        this.removeInvalidClass()
      }
    }
  },
  components: {
    UfsModal, UfsBtn, UfsInput, UfsSelect, UfsTip
  }
}
</script>
