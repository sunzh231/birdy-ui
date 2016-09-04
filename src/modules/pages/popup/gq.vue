<template>
  <div id="ufs-popup-gq">
    <ufs-modal :show.sync="show">
      <div slot="content">
        <div class="ufs-popup-gq-content">
          <form>
            <!-- title -->
            <div class="ufs-popup-gq-title">
              <img src="../../images/information.png" />
              <span class="text-wrapper">
                <span class="accomplish-gq">完善信息</span><span class="swap-goods">才能兑换好礼哟～</span>
              </span>
            </div>

            <!-- name -->
            <div class="form-group">
              <ufs-input
                id="name"
                label="真实姓名"
                :value.sync="name"
                :max-length="50"
                required>
              </ufs-input>
            </div>

            <!-- occupation -->
            <div class="form-group">
              <label class="ufs-popup-gq-label" for="occupations">您的职业</label>
              <ufs-select
                :value.sync="occupation"
                :items="occupations">
              </ufs-select>
            </div>

            <!-- rest name -->
            <div class="form-group">
              <ufs-input
                type="text"
                id="restName"
                :value.sync="restName"
                label="餐厅名称"
                :max-length="100"
                required>
              </ufs-input>
            </div>

            <!-- rest type -->
            <div class="form-group">
              <label class="ufs-popup-gq-label" for="restTypes">餐厅业务类型</label>
              <ufs-select
                :value.sync="restType"
                :items="restTypes">
              </ufs-select>
            </div>

            <!-- rest address -->
            <div class="form-group">
              <label class="ufs-popup-gq-label">餐厅地址</label>
              <div class="province-city-county-wrap">
                <div class="half-row first-column">
                  <ufs-select
                    :value.sync="province"
                    :items="provinces"
                    :placeholder="'所在地区'"
                    @on-change="changeProvince">
                  </ufs-select>
                </div>
                <div class="half-row second-column">
                  <ufs-select
                    :value.sync="city"
                    :items="cities"
                    :placeholder="'所在城市'"
                    @on-change="changeCity">
                  </ufs-select>
                </div>
                <div class="half-row first-column">
                  <ufs-select
                    :value.sync="county"
                    :items="counties"
                    :placeholder="'区/县'">
                  </ufs-select>
                </div>
              </div>
              <ufs-input :value.sync="address" placeholder="详细地址" required></ufs-input>
            </div>

            <!-- rest agv spending -->
            <div class="form-group">
              <ufs-input
                id="restAgvSpending"
                class="last"
                label="您所在餐厅的人均消费(元)"
                :value.sync="restAgvSpending"
                :input-handler="averageSpendRestriction"
                required>
              </ufs-input>
            </div>
            <div class="form-group privacy">
              <ufs-checkbox class="checkbox" :value.sync="readPrivacy"></ufs-checkbox>
              <span class="privacy-approval">我已阅读并同意<a class="privacy-link" href="http://www.unileverprivacypolicy.com/simplified_chinese/policy.aspx">《联合利华隐私政策》</a><br class="shown-in-mobile"/>和<a class="privacy-link" v-link="{ path: '/points/rules' }">《联合利华饮食策划积分规则》</a></span>
            </div>
            <div class="form-group operations">
              <ufs-btn
                text="下一步"
                :disabled="!canSubmit"
                :is-inline="false"
                :click-handler="submitGQ">
              </ufs-btn>
            </div>
          </form>
        </div>
      </div>
    </ufs-modal>
  </div>
</template>

<style lang="less">
@import '../../../../../static/h5/styles/mixins.less';
@import '../../styles/variables.less';

@ufs-popup-gq-title-color: #5d5e5e;
@ufs-popup-gq-label-color: #5e5e5e;
@ufs-popup-gq-privacy-color: #9e9e9f;

@ufs-gq-selector-font-color: #d0d2d3;

#ufs-popup-gq {
  .ufs-popup-gq-content {
    background-color: @white;
    padding: 65px 128px;
    max-height: 350px;
    width: 494px;
    overflow: auto;
  }

  .modal-dialog {
    max-width: 700px;
  }

  .ufs-select-container {
    width: 100%;
    margin-bottom: 8px;

    .ufs-select {
      .ufs-select-icon {
        right: 8px;
      }

      .ufs-select-item.placeholder {
        font-size: 14px;
        color: @ufs-gq-selector-font-color;
      }
    }
  }

  .ufs-popup-gq-label {
    display: block;
    text-align: left;
    color: @ufs-popup-gq-label-color;
    padding: 0 0 8px;
    font-size: 14px;
    line-height: 1;
  }

  .ufs-input-container { // reset the style of UfsInput
    margin-bottom: 16px;

    &.last {
      margin-bottom: 12px;
    }

    .ufs-input-label {
      line-height: 1;
      padding: 0 0 8px;
      color: @ufs-popup-gq-label-color;
      font-size: 14px;

      &:after {
        content: ''
      }
    }

    .ufs-input {
      &.large {
        box-sizing: border-box;
        width: 100%;

        &::placeholder {
          font-size: 14px;
          color: @ufs-gq-selector-font-color !important;
        }
      }
    }
  }

  .ufs-popup-gq-title {
    margin-bottom: 20px;
    font-size: 21px;
    color: @ufs-popup-gq-title-color;
    line-height: 1;

    img {
      margin-right: 14px;
      vertical-align: middle;
      width: 41px;
      height: 40px;
    }
  }

  .province-city-county-wrap {
    .clearfix;

    .half-row {
      float: left;
      width: 50%;
      box-sizing: border-box;
    }

    .first-column {
      padding-right: 4px;
    }

    .second-column {
      padding-left: 4px;
    }
  }

  .privacy {
    color: @ufs-popup-gq-privacy-color;
    font-size: 12px;
    margin-bottom: 30px;
    text-align: left;

    .checkbox {
      margin-left: -2px; // there is 2px blank of checkbox icon, set margin-left: -2px for left align
      margin-top: -2px; // for the vertical-align: middle
    }

    .privacy-link {
      color: inherit;
    }
  }

  .operations {
    .ufs-button-container {
      button {
        margin: 0 auto;
      }
    }
  }

  .shown-in-mobile {
    display: none;
  }
}

@media (max-width: @webBoundary) {
  #ufs-popup-gq {
    .ufs-popup-gq-label {
      font-size: 12px;
    }

    .ufs-select-container {
      .ufs-select {
        .ufs-select-item.placeholder {
          font-size: 12px;
        }
      }
    }

    .ufs-popup-gq-title {
      margin-bottom: 34px;
      text-align: left;

      .text-wrapper {
        display: inline-block;
        vertical-align: middle;
      }

      .swap-goods {
        display: block;
        font-size: 16px;
        margin-top: 10px;
      }

      img {
        margin-right: 20px;
        width: 82px;
        height: 80px;
      }
    }

    .ufs-popup-gq-content {
      padding: 40px 15px 112px;
      max-height: none;
      width: auto;
    }

    .ufs-input-container {
      margin-bottom: 8px;

      &.last {
        margin-bottom: 16px;
      }

      .ufs-input-label {
        font-size: 12px;
      }

      .ufs-input {
        &.large {
          &::placeholder {
            font-size: 12px;
          }
        }
      }
    }

    .privacy {
      margin-bottom: 34px;
      position: relative;

      .checkbox {
        position: absolute;
        left: 0;
        top: 0;
      }

      .privacy-approval {
        padding-left: 26px;
        display: inline-block;
      }
    }

    .shown-in-mobile {
      display: block;
    }
  }
}
</style>

<script>
import UfsModal from '../../components/UfsModal'
import UfsInput from '../../components/UfsInput'
import UfsCheckbox from '../../components/UfsCheckbox'
import UfsBtn from '../../components/UfsBtn'
import UfsSelect from '../../components/UfsSelect'
import {refreshMe} from '../../utils/resource'

const formatSelectData = (data, keyName, valueName) => {
  const options = []
  for (const item of data) {
    options.push({
      value: item[keyName],
      text: item[valueName]
    })
  }
  return options
}

// fill in the gq with known info
const fillInGq = (vm) => {
  const gqInfo = vm.gqInfo
  vm.name = gqInfo.name || null
  vm.occupation = gqInfo.occupation || null
  vm.restName = gqInfo.rstName || null
  vm.restAgvSpending = gqInfo.rstAgvSpending || null
  vm.address = gqInfo.address || null

  if (gqInfo.occupation) {
    vm.occupation = Number.parseInt(gqInfo.occupation) || null
  }

  if (gqInfo.rstBusinessType) {
    vm.restType = Number.parseInt(gqInfo.rstBusinessType) || null
  }

  if (gqInfo.province) {
    vm.province = Number.parseInt(gqInfo.province) || null
  }

  if (gqInfo.province && gqInfo.city) {
    vm.getCities(gqInfo.province, () => {
      vm.city = Number.parseInt(gqInfo.city) || null

      if (gqInfo.county) { // avoid clearing the county info
        vm.getCounties(gqInfo.city, () => {
          vm.county = Number.parseInt(gqInfo.county) || null
        })
      }
    })
  }
}

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
      twoWay: true,
      required: true
    },
    gqInfo: {
      type: Object,
      default () {
        return {}
      },
      required: false
    },
    provinces: {
      type: Array,
      default () {
        return []
      },
      required: false
    }
  },
  data () {
    return {
      occupations: [],
      restTypes: [],
      cities: [],
      counties: [],
      name: null,
      occupation: null,
      restName: null,
      restType: null,
      province: null,
      city: null,
      county: null,
      address: null,
      restAgvSpending: null,
      readPrivacy: false
    }
  },
  computed: {
    canSubmit () {
      return this.name && this.occupation && this.restName && this.restType &&
        this.province && this.city && this.county && this.address &&
        this.restAgvSpending && this.readPrivacy
    }
  },
  methods: {
    getOccupations () {
      if (this.occupations.length) {
        return
      }

      const occupationsResource = this.$resource('/api/ufscmcmall/dmp/occupations')
      occupationsResource.get().then((response) => {
        this.occupations = formatSelectData(response.data.items, 'dmpId', 'occupationType')
      })
    },
    getRestTypes () {
      if (this.restTypes.length) {
        return
      }

      const restTypeResource = this.$resource('/api/ufscmcmall/dmp/rest-type')
      restTypeResource.get().then((response) => {
        this.restTypes = formatSelectData(response.data.items, 'dmpId', 'restaurantBusinessType')
      })
    },
    getProvinces () {
      if (this.provinces.length) {
        return
      }

      const provinceResource = this.$resource('/api/ufscmcmall/dmp/province')
      provinceResource.get().then((response) => {
        this.provinces = formatSelectData(response.data.items, 'dmpId', 'address')
      })
    },
    getCities (provinceId, callBack) {
      const cityResource = this.$resource('/api/ufscmcmall/dmp/city')
      cityResource.get({ province: provinceId }).then((response) => {
        this.cities = formatSelectData(response.data.items, 'dmpId', 'address')
        if (typeof callBack === 'function') {
          callBack(response.data)
        }
      })
    },
    getCounties (cityId, callBack) {
      const countyResource = this.$resource('/api/ufscmcmall/dmp/county')
      countyResource.get({ city: cityId }).then((response) => {
        this.counties = formatSelectData(response.data.items, 'dmpId', 'address')
        if (typeof callBack === 'function') {
          callBack(response.data)
        }
      })
    },
    changeProvince (provinceId) {
      this.getCities(provinceId)
    },
    changeCity (cityId) {
      this.getCounties(cityId)
    },
    clearCity () {
      this.city = null
    },
    clearCounty () {
      this.county = null
    },
    submitGQ () {
      const fieldsMap = {
        name: 'name',
        occupation: 'occupation',
        restName: 'rest_name',
        restType: 'rest_type',
        province: 'province',
        city: 'city',
        county: 'county',
        address: 'address',
        restAgvSpending: 'rest_agv_spending'
      }

      const params = {}
      for (const [dataKey, apiKey] of Object.entries(fieldsMap)) {
        params[apiKey] = this[dataKey]
      }

      const gqResource = this.$resource('/api/ufscmcmall/dmp/upload-gq')
      gqResource.save(params).then((response) => {
        refreshMe(params)
        this.show = false
        this.$emit('on-finish')
      })
    },
    averageSpendRestriction () {
      if (this.restAgvSpending) {
        // remove the non-numerical characters
        this.restAgvSpending = this.restAgvSpending.replace(/[^0-9]+/g, '')

        // remove the zeros, like 0012, 0, 00 . etc.
        this.restAgvSpending = this.restAgvSpending.replace(/^[0]+/g, '')
        // HACK: for IE and firefox, in those two browsers,
        // the code above will change the value of this.restAgvSpending,
        // but will not change the content of input,
        // so i need to trigger vue to refresh view for twice, to make sure
        // the content in input is correct
        // TODO: And here is a backup choice, that is to use keyup event here.
        this.$nextTick(() => {
          this.restAgvSpending = `${this.restAgvSpending} `
          this.$nextTick(() => {
            this.restAgvSpending = String.trim(this.restAgvSpending)
          })
        })
      }
    }
  },
  watch: {
    // the onChange of UfsSelect happens after the value has changed, so
    // I can only put the cleanning code here, otherwise, the city and
    // county will be removed after you select BeiJing for twice.
    province () {
      this.clearCity()
      this.clearCounty()
    },
    city () {
      this.clearCounty()
    },
    gqInfo () {
      fillInGq(this)
    },
    show (val) {
      if (val) {
        this.getOccupations()
        this.getRestTypes()
        this.getProvinces()
      }
    }
  },
  components: {
    UfsModal,
    UfsInput,
    UfsCheckbox,
    UfsBtn,
    UfsSelect
  }
}
</script>
