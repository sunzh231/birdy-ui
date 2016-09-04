<template>
  <div id="ufs-order-success">
    <p class="icon-msg">下单成功啦</p>
    <p class="info">
      <span>订单号: {{ orderId }}</span>
      <span>我们将尽快为您打包发货</span>
    </p>
    <ufs-btn text="继续积分兑礼" btn-type="link" link="/gift/list" :is-inline="false"></ufs-btn>
    <ufs-btn text="查看订单详情" btn-style="bg-white" btn-type="link" :link="orderDetailLink" :is-inline="false"></ufs-btn>
  </div>
</template>

<style lang="less">
@import "./success.less";

</style>

<script>
import UfsBtn from '../../../components/UfsBtn'

export default {
  data () {
    return {
      orderId: '',
      orderDetailLink: ''
    }
  },
  route: {
    data (transition) {
      this.orderId = transition.to.query.orderId
      this.orderDetailLink = `/order/detail/${this.orderId}`
    }
  },
  components: {
    UfsBtn
  }
}
</script>
