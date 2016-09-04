<template>
  <div class="ufs-gifts">
    <div class="list-wrap">
      <div class="list-item" v-for="item in list" v-link="{ name: '礼品详情', params: { id: item.id }}">
        <i class="gift-tag" v-if="item.isChoice"></i>
        <img :src="item.picUrl" />
        <div class="content">
          <div class="content-wrap">
            <ufs-clamp class="name"
              :clamp="clampNumber"
              :text="item.name">
            </ufs-clamp>
            <div class="score">兑换积分： {{ item.score }}</div>
            <div class="convert">{{ item.convert }}人兑换</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';
@import '../../../../static/h5/styles/mixins.less';
@import '../styles/mixin.less';

@gift-item-size: 240px;
@gift-item-size-mobile: 80px;

@ufs-black: #231815;
@ufs-grey: #231f20;
@ufsGiftListTagSize: 50px;
@ufsGiftListTagSizeMobile: 24px;

.ufs-gifts {
  box-sizing: border-box;
  text-align: left;

  .list-item {
    display: inline-block;
    width: @gift-item-size;
    padding-bottom: 36px;
    cursor: pointer;

    &:nth-child(3n+0) {
      margin-left: 9px;
    }

    &:nth-child(3n+1) {
      margin-right: 9px;
    }

    &:nth-child(3n+2) {
      margin-left: 5px;
      margin-right: 5px;
    }

    position: relative;

    .gift-tag {
      position: absolute;
      left: -5px;
      top: 0;
      .ufs-icon('../images/icon_summer_selection.png', @ufsGiftListTagSize, @ufsGiftListTagSize);
    }

    img {
      margin-bottom: 24px;
      width: @gift-item-size;
      height: @gift-item-size;
    }

    .content {
      font-size: 16px;
    }

    .name {
      color: @ufs-black;
      margin-bottom: 30px;
    }

    .score {
      float: left;
      color: @ufsOrange;
    }

    .convert {
      font-size: 12px;
      float: right;
      margin-top: 2px;
      color: @ufsFontGray;
    }
  }
}

@media (max-width: @webBoundary) {
  .ufs-gifts {
    .list-item {
      .flex();
      width: 100%;
      height: @gift-item-size-mobile;
      border: 1px solid @ufsDooseGrey;
      border-radius: 2px;
      padding: 0;
      margin: 0 0 8px 0 !important;

      &:last-child {
        margin: 0px !important;
      }

      .gift-tag {
        left: -3px;
        .ufs-icon('../images/icon_summer_selection.png', @ufsGiftListTagSizeMobile, @ufsGiftListTagSizeMobile);
      }

      img {
        height: @gift-item-size-mobile;
        width: @gift-item-size-mobile;
      }

      .content {
        .flex-item(1);
      }

      .content-wrap {
        box-sizing: border-box;
        position: relative;
        height: @gift-item-size-mobile;
        margin-left: 16px;
        padding: 8px 8px 8px 0;
        vertical-align: top;
        font-size: 12px;
      }

      .name {
        color: @ufs-grey;
        margin-bottom: 8px;
      }

      .score {
        float: inherit;
        position: absolute;
        left: 0;
        bottom: 24px;
      }

      .convert {
        position: absolute;
        bottom: 8px;
        right: 8px;
      }
    }
  }
}
</style>

<script>
import UfsClamp from './UfsClamp'

export default {
  replace: true,
  props: {
    list: {
      type: Array,
      required: true,
      twoWay: true
    }
  },
  data () {
    return {
      clampNumber: 2
    }
  },
  components: {
    UfsClamp
  }
}
</script>
