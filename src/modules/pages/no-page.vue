<template>
  <div id="ufs-no-page">
    <p class="icon-msg">遇到了点小问题，请先看看其他内容吧</p>
    <ufs-btn text="去首页逛逛" :click-handler="goUFSHome" :is-inline="false"></ufs-btn>
  </div>
</template>

<style lang="less">
@import '../styles/variables.less';

#ufs-no-page {
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
  #ufs-no-page {
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
    goUFSHome () {
      window.location.href = CONSTANT.websiteHost
    }
  },
  components: {
    UfsBtn
  }
}
</script>
