<template>
  <div class="ufscmcmall-progress-bar">
    <div class="icon icon-top" :style="iconPosition"></div>
    <div class="bar">
      <div class="rate" :style="rateWidth"></div>
    </div>
    <div class="progress progress-1"><span>600</span></div>
    <div class="progress progress-2"><span>1200</span></div>
    <div class="progress progress-3"><span>1800</span></div>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';
@import '../styles/mixin.less';

.ufscmcmall-progress-bar {
  width: 398px;
  height: 50px;

  .icon {
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }

  .icon-top {
    border-top: 8px solid @ufsOrange;
  }

  .icon-bottom {
    border-bottom: 8px solid @ufsBarGray;
  }

  .item-position (@rate:0%) {
    position: relative;
    left: @rate;
  }

  .bar {
    width: 398px;
    height: 8px;
    background-color: @ufsBarGray;
    margin: 2px 4px;
  }

  .rate {
    height: 8px;
    background-color: @ufsOrange;
  }

  .progress {
    .icon;
    .icon-bottom;
    .pull-left;
  }

  .progress-phase(@n, @i: 1) when (@i =< @n) {
    .progress-@{i} {
      // TODO: Adjust span margin
      .item-position(25% * @i);
    }
  }
  .progress-phase(3);

  span {
    font-size: 12px;
    color: @ufsFontGray;
    position: relative;
    top: 12px;
  }
}
</style>

<script>
export default {
  props: {
    rate: Number,
    required: true
  },
  data () {
    return {
      iconPosition: {
        left: this.rate + '%',
        position: 'relative'
      },
      rateWidth: {
        width: this.rate + '%'
      }
    }
  }
}
</script>
