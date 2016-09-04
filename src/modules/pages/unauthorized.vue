<template>
  <div id="ufs-unauthorized">
    <p class="icon-msg">您还没有绑定手机号码，建议您先绑定手机号码</p>
    <ufs-btn text="查看个人资料" :click-handler="goUFSProfile" :is-inline="false"></ufs-btn>
    <ufs-btn text="去首页逛逛" btn-style="bg-white" :click-handler="goUFSHome" :is-inline="false"></ufs-btn>
  </div>
</template>

<style lang="less">
@import '../styles/variables.less';

#ufs-unauthorized {
  color: @ufsFontGray;
  width: 290px;
  margin: 90px auto 0;

  p {
    margin: 0;
  }

  .icon-msg {
    padding: 85px 48px 0;
    margin-bottom: 24px;
    background: url('../images/icon-error.png') center top no-repeat;
    background-size: 80px 80px;
    font-size: 14px;
    line-height: 18px;
  }

  .ufs-button-container {
    margin-bottom: 12px;
  }
}

@media (max-width: @webBoundary) {
  #ufs-unauthorized {
    width: auto;
    margin: 100px 20px 0;

    .icon-msg {
      margin: 0 auto 20px;
      width: 160px;
      font-size: 12px;
      line-height: 16px;
    }

    .ufs-button-container {
      margin: 0 0 14px;
    }
  }
}

</style>

<script>
import CONSTANT from '../constant'
import UfsBtn from '../components/UfsBtn'

export default {
  methods: {
    goUFSProfile () {
      window.location.href = CONSTANT.ufsProfileUrl
    },

    goUFSHome () {
      window.location.href = CONSTANT.websiteHost
    }
  },
  components: {
    UfsBtn
  }
}
</script>
