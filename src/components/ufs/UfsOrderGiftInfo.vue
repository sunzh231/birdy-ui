<template>
  <div class="ufs-order-gift-info">
    <ul v-for="item in gifts">
      <li class="order-gift">
        <img :src="item.picture"/>
        <span>{{ item.productName }}</span>
      </li>
      <ul class="order-points">
        <li>
          <label>
            单个积分<label class="mobile-label">:</label>
          </label>
          <span>{{ item.score }}</span>
        </li>
        <li>
          <label>
            数量<label class="mobile-label">:</label>
          </label>
          <span>{{ item.count }}</span>
        </li>
        <li>
          <label>
            合计积分<label class="mobile-label">:</label>
          </label>
          <span>{{ item.score * item.count }}</span>
        </li>
      </ul>
    </ul>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

@order-gift-img-pc-size: 144px;
@order-gift-img-mobile-size: 72px;

.ufs-order-gift-info {
  ul {
    li, img {
      float: left;
    }

    .order-gift {
      text-align: left;
      margin-bottom: 16px;

      span {
        display: inline-block;
        vertical-align: middle;
        padding-left: 16px;
        line-height: normal;
      }
    }

    .order-points {
      li {
        border-left: @ufsBarGray solid 1px;

        &:first-child {
          border-left: none;
        }
      }
    }
  }
}

@media (min-width: @webBoundary) {
  .ufs-order-gift-info {
    .order-gift {
      width: 50%;
      line-height: @order-gift-img-pc-size;
      height: @order-gift-img-pc-size;

      img {
        width: @order-gift-img-pc-size;
        height: @order-gift-img-pc-size;
      }

      span {
        width: 55%;
      }
    }
    .order-points {
      float: right;
      margin-top: 50px;

      li {
        height: 36px;
        line-height: 20px;
        text-align: right;
        margin-left: 32px;
        padding-left: 32px;

        .mobile-label {
          display: none;
        }

        &:last-child {
          text-align: right;
        }

        span {
          display: block;
        }
      }
    }
  }
}

@media (max-width: @webBoundary) {
  .ufs-order-gift-info {
    .order-gift {
      width: 100%;
      height: @order-gift-img-mobile-size;
      line-height: @order-gift-img-mobile-size;

      img {
        width: @order-gift-img-mobile-size;
        height: @order-gift-img-mobile-size;
      }

      span {
        font-size: 12px;
        width: 68%;
      }
    }

    .order-points {
      clear: both;
      width: 100%;
      border-top: @ufsBarGray solid 1px;
      padding-top: 8px;
      font-size: 10px;

      li {
        width: 33%;
        height: 32px;
        line-height: 32px;

        span {
          margin-left: 6px;
        }
      }
    }
  }
}
</style>

<script>
export default {
  props: {
    gifts: {
      type: Array,
      required: true,
      default: []
    }
  }
}
</script>
