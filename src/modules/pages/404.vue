<template>
  <div id="ufs-404">
    <p class="icon-msg">抱歉，这个页面不存在了</p>
  </div>
</template>

<style lang="less">
@import '../styles/variables.less';

#ufs-404 {
  color: @ufsFontGray;
  margin: 100px auto;

  .icon-msg {
    padding: 85px 48px 0;
    background: url('../images/icon-error.png') center top no-repeat;
    background-size: 80px 80px;
    font-size: 14px;
    line-height: 18px;
  }
}
</style>
