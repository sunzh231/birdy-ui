<template>
  <div class="ufs-order-template">
    <div class="template-header">
      <slot name="header"></slot>
    </div>
    <div class="template-body">
      <div v-for="item in template">
        <div class="title">{{ item.title }}</div>
        <div class="content">
          <ufs-order-gift-info v-if="item.type === 'giftInfo'" :gifts="gifts" ></ufs-order-gift-info>
          <slot name="receiptAddress" v-if="item.type === 'receiptAddress'"></slot>
          <slot name="logistics" v-if="item.type === 'logistics'"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

@order-template-font-dark-grey: #5E5E5E;

.ufs-order-template {
  .template-body {
    color: @order-template-font-dark-grey;

    .title {
      width: 100%;
      border: @ufsBarGray solid;
      border-width: 2px 0px;
      text-align: left;
      clear: left;
    }

    .content {
      padding-top: 14px;
    }
  }
}

@media (min-width: @webBoundary) {
  .ufs-order-template {
    .template-header {
      margin-bottom: 32px;
    }

    .template-body {
      font-size: 16px;

      .title {
        height: 20px;
        padding: 4px;
      }

      .content {
        padding-bottom: 32px;
      }
    }
  }
}

@media (max-width: @webBoundary) {
  .ufs-order-template {
    padding: 30px 20px;

    .template-header {
      margin-bottom: 24px;
    }

    .template-body {
      font-size: 12px;

      .title {
        height: 17px;
        padding-top: 3px;
      }

      .content {
        padding-bottom: 16px;
      }
    }
  }
}
</style>

<script>
import UfsOrderGiftInfo from './UfsOrderGiftInfo'

export default {
  props: {
    template: {
      type: Array,
      required: true
    },
    gifts: {
      type: Array
    }
  },
  components: {
    UfsOrderGiftInfo
  }
}
</script>
