<template>
  <div id="ufs-home">
    <div class="member-info-wrap">
      <div class="member-avatar">
        <a href="{{ profileUrl }}">
          <img class="member-avatar-icon" :src="member.avatar" />
        </a>
      </div>
      <div class="member-info">
        <div>
          <span class="member-name">{{ member.name }}</span>
          <span class="member-label hide">LV1 会员</span>
          <a class="member-privilege hide" v-link="{ path: '#' }">5个会员特权</a>
        </div>
        <div class="point-progress-bar">
        </div>
        <div class="mobile-point-info">
          <a v-link="{ path: 'points/record' }" class="member-point-button">
            <span class="point-header">
              可用积分
            </span>
            <span>
              {{ avaliableScore }}
            </span>
          </a>
          <a v-link="{ path: 'points/record' }" class="member-point-button">
            <span class="point-header">
              本月即将过期
            </span>
            <span>
              {{ willExpiredScore }}
            </span>
          </a>
        </div>
      </div>
      <div class="point-info">
        <div class="point-total">
          <span class="point-header">可用积分</span>
          <a v-link="{ path: 'points/record' }" class="member-point-button">{{ avaliableScore }}</a>
        </div>
        <div class="point-will-expire">
          <span class="point-header">本月即将过期</span>
          <span class="expire-date">{{ scoreWillExpiredDate }}过期</span>
          <a v-link="{ path: 'points/record' }" class="member-point-button">{{ willExpiredScore }}</a>
        </div>
      </div>
    </div>

    <!-- spend points -->
    <div class="point-wrap spend-point-wrap">
      <div class="point-item-header">
        <div class="pull-left">
          <span class="icon-circle"></span>
          <span class="point-header-title">花积分</span>
        </div>
        <div class="point-operation pull-right">
          <a v-link="{ path: 'order/history' }">
            <span class="spend-point-record">兑换记录</span>
            <span class="icon-right"></span>
          </a>
        </div>
        <div class="header-connect-line clearfix"></div>
      </div>
      <div class="point-item-content phone-recharge-wrap">
        <div class="item-description">
          <span class="phone-recharge-icon point-use-icon"></span>
        </div>
        <div class="point-detail-wrap">
          <div class="point-detail-header">选择你想充值的价格：</div>
          <div class="point-detail clearfix">
            <a :class="['phone-recharge-item', 'pull-left', {
              'phone-recharge-item-selected': phoneRecharge.selected
              }]"
              v-for="(index, phoneRecharge) in phoneRecharges" @click="handleRechargeOption(phoneRecharge, index)">
              <span class="charge-amount">{{ phoneRecharge.productName }}</span>
              <span class="charge-spend">{{ phoneRecharge.score }}积分</span>
            </a>
          </div>
          <!-- phone recharge popup -->
          <recharge
            :show.sync="recharge.modal"
            :recharge-options="phoneRecharges"
            :avaliable-score="avaliableScore"
            @on-submit="handleSumbitRecharge">
          </recharge>
          <recharge-success
            :show.sync="recharge.successModal"
            :phone-number="recharge.phoneNumber"
            :amount="recharge.productName">
          </recharge-success>
          <gq :show.sync="pops.gq" :gq-info="member" @on-finish="finishGQHandler"></gq>
        </div>
      </div>
      <div class="connect-line"></div>
      <div class="point-item-content gift-content">
        <div class="item-description pull-left">
          <span class="gift-icon point-use-icon"></span>
        </div>
        <div class="point-detail-wrap">
          <a v-for="bestSellerGift in bestSellerGifts" v-link="{ path: 'gift/detail/' + bestSellerGift.id }" class="gift-wrap" >
            <ufs-best-seller-gift :best-seller-gift="bestSellerGift"></ufs-best-seller-gift>
          </a>
        </div>
        <div class="view-all clearfix">
          <ufs-btn
            :btn-type="showMoreBtn.type"
            :text="showMoreBtn.text"
            :is-inline="showMoreBtn.isInline"
            :link="showMoreBtn.link">
          </ufs-btn>
        </div>
      </div>
    </div>

    <!-- get points -->
    <div class="point-wrap get-point-wrap">
      <div class="point-item-header">
        <div class="pull-left">
          <span class="icon-circle"></span>
          <span class="point-header-title">赚积分</span>
        </div>
        <div class="point-operation pull-right">
          <a v-link="{ path: 'points/rules' }">
            <span class="spend-point-record">积分规则</span>
            <span class="icon-right"></span>
          </a>
        </div>
        <div class="header-connect-line clearfix"></div>
      </div>
      <div class="point-item-content get-score-wrap">
        <div class="get-point-wrap">
          <div class="get-point-way" v-for="getScoreWay in getScoreWays" v-if="$index < 3" @click="handleGetPointWay(getScoreWay)">
            <span class="get-point-way-icon" :class="[getScoreWay.iconClass]"></span>
            <span class="get-point-title">{{ getScoreWay.method }}</span>
            <span class="get-point-detail">{{ getScoreWay.methodTitle }}</span>
            <a class="get-point-btn">马上行动</a>
          </div>
        </div>
        <!-- invite friend popup -->
        <invite :show.sync="pops.invite"></invite>
        <div v-if="getScoreWays.length > 3" class="seperate-line clearfix"></div>
        <div v-if="getScoreWays.length > 3" class="view-all clearfix">
          <a v-link="{ path: '/home' }">
            <span>查看全部</span>
            <span class="icon-right"></span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UfsProgressBar from '../../components/UfsProgressBar'
import UfsBestSellerGift from '../../components/UfsBestSellerGift'
import UfsBtn from '../../components/UfsBtn'
import recharge from '../popup/recharge'
import rechargeSuccess from '../popup/rechargeSuccess'
import invite from '../popup/invite'
import CONSTANT from '../../constant'
import gq from '../popup/gq'
import {lookupMe} from '../../utils/resource'

export default {
  props: {},
  data () {
    return {
      member: {
        name: '',
        avatar: '/images/ufscmcmall/default-user-avatar.png'
      },
      avaliableScore: 0,
      willExpiredScore: 0,
      scoreWillExpiredDate: '--',
      scoreRate: 0,
      bestSellerGifts: [],
      phoneRecharges: [],
      getScoreWays: [
        {
          iconClass: 'get-point-two-icon',
          methodTitle: '输入产品兑奖码抽奖',
          detailPageUrl: CONSTANT.onPackUrl,
          method: '方法1'
        },
        {
          iconClass: 'get-point-three-icon',
          methodTitle: '邀请好友，有利共享',
          isPopup: true,
          popType: 'invite',
          method: '方法2'
        }
      ],
      recharge: {
        modal: false,
        successModal: false,
        phoneNumber: '',
        productName: ''
      },
      pops: {
        gq: false,
        invite: false
      },
      showMoreBtn: {
        type: 'link',
        text: '查看更多礼品',
        isInline: false,
        link: { path: 'gift/list' }
      },
      profileUrl: CONSTANT.ufsProfileUrl
    }
  },
  route: {
    data: function () {
      this.getMemberInfo()
      this.getAvailableScore()
      this.getWillExpiredScore()
      this.getPhoneRecharges()
      this.getBestSellerGifts()
    }
  },
  methods: {
    getMemberInfo () {
      lookupMe(this).then((dmpInfo) => {
        ((e) => {
          const data = e
          if (!data.name) {
            data.name = '师傅'
          }

          if (!data.avatar) {
            data.avatar = this.member.avatar
          } else if (!/^(https{0,1}:){0,1}\/\//.test(data.avatar)) {
            data.avatar = CONSTANT.securityHost + data.avatar
          } else {
            // to do nothing
          }
          this.member = data

          if (!this.member.isProfileCompleted) {
            let tasks = this.getScoreWays.concat()
            let item = {
              iconClass: 'get-point-one-icon',
              methodTitle: '完善资料 +50积分',
              detailPageUrl: `${CONSTANT.websiteHost}/my/my-profile.html`
            }
            tasks.splice(0, 0, item)
            for (let i = 0, j = 1, len = tasks.length; i < len; i++, j++) {
              tasks[i].method = '方法' + j
            }
            this.getScoreWays = tasks
          }
          this.recharge.phoneNumber = e.phone
        })(dmpInfo)
      })
    },
    getAvailableScore () {
      const resource = this.$resource('/api/ufscmcmall/member/score')
      resource.get().then((resp) => {
        this.avaliableScore = resp.data.score
      })
    },
    getWillExpiredScore () {
      const resource = this.$resource('/api/ufscmcmall/member/will-expired-score')
      resource.get().then((resp) => {
        this.willExpiredScore = resp.data.score
        this.scoreWillExpiredDate = resp.data.expiredAt
      })
    },
    getPhoneRecharges () {
      const resource = this.$resource('/api/ufscmcmall/goods/phone-charge')
      resource.get().then((resp) => {
        this.phoneRecharges = resp.data.items
      })
    },
    getBestSellerGifts () {
      const params = {'per-page': 4}
      const resource = this.$resource('/api/ufscmcmall/goods/hot-goods', params)
      resource.get().then((resp) => {
        let items = resp.data.items
        for (let item of items) {
          this.bestSellerGifts.push({
            id: item.id,
            name: item.productName,
            url: item.pictures[0],
            score: item.score,
            isChoice: item.isChoice
          })
        }
      })
    },
    handleRechargeOption (phoneRecharge, selectedIndex) {
      for (let index in this.phoneRecharges) {
        index = parseInt(index, 10)
        this.phoneRecharges.$set(index, {
          ...this.phoneRecharges[index],
          selected: selectedIndex === index
        })
      }
      if (!this.member.isGQ) {
        this.pops.gq = true
      } else {
        this.recharge.modal = true
      }
    },
    handleSumbitRecharge (result) {
      this.recharge.modal = false
      this.recharge.successModal = true
      this.recharge.phoneNumber = result.phoneNumber
      this.recharge.productName = result.productName
    },
    handleGetPointWay (way) {
      if (way.isPopup) {
        this.pops[way.popType] = true
      } else {
        window.location.href = way.detailPageUrl
      }
    },
    finishGQHandler () {
      this.member.isGQ = true
    }
  },
  components: {
    UfsProgressBar,
    UfsBtn,
    UfsBestSellerGift,
    recharge,
    rechargeSuccess,
    invite,
    gq
  }
}
</script>
