<template>
  <div class="ufs-best-seller-gift">
    <div class="best-seller-gift-image">
      <i class="gift-tag" v-if="bestSellerGift.isChoice"></i>
      <img :src="bestSellerGift.url">
    </div>
    <div class="best-seller-gift-score">
      {{ bestSellerGift.score }}积分
    </div>
    <ufs-clamp
      class="best-seller-gift-name"
      :clamp="2"
      :text="bestSellerGift.name">
    </ufs-clamp>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';
@import '../styles/mixin.less';

@ufsBestSellerGiftImgSize: 135px;
@ufsBestSellerGiftDistance: 16px;
@ufsBestSellerGiftImgSmallSize: 60px;
@ufsBestSellerGiftSmallDistance: 8px;
@ufsBestSellerGiftTagSize: 42px;
@ufsBestSellerGiftTagSizeMobile: 30%;

.ufs-best-seller-gift {
  width: @ufsBestSellerGiftImgSize;
  height: 214px;
  padding-right: @ufsBestSellerGiftDistance;
  display: inline-block;
  text-align: left;
  font-size: 0px;

  .best-seller-gift-image {
    position: relative;

    .gift-tag {
      position: absolute;
      left: -3.5%;
      top: 0;
      .ufs-icon('../images/icon_summer_selection.png', @ufsBestSellerGiftTagSize, @ufsBestSellerGiftTagSize);
    }

    img {
      width: 100%;
      height: 100%;
      padding-bottom: @ufsBestSellerGiftDistance;
    }
  }

  .best-seller-gift-score {
    color: @ufsOrange;
    font-size: 16px;
  }

  .best-seller-gift-name {
    color: @ufsFontGray;
    font-size: 14px;
    word-break: break-all;
  }
}

@media (max-width: @webBoundary) {
  .ufs-best-seller-gift {
    width: @ufsBestSellerGiftImgSmallSize;
    height: 108px;
    padding-right: @ufsBestSellerGiftSmallDistance;

    .best-seller-gift-image {
      .gift-tag {
        .ufs-icon('../images/icon_summer_selection.png', @ufsBestSellerGiftTagSizeMobile, @ufsBestSellerGiftTagSizeMobile);
      }

      img {
        width: 100%;
        height: 100%;
        padding-bottom: @ufsBestSellerGiftSmallDistance;
      }
    }

    .best-seller-gift-score,
    .best-seller-gift-name {
      font-size: 10px;
    }
  }
}
</style>

<script>
import UfsClamp from './UfsClamp'
export default {
  props: ['bestSellerGift'],
  components: {
    UfsClamp
  }
}
</script>
