<template>
  <div class="ufs-scroll-tip" v-show="show">
    <div v-show="currentPage < totalPages">
      上拉加载更多...
    </div>
    <div v-show="currentPage == totalPages">
      没有更多啦~
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

.ufs-scroll-tip {
  display: none;
}

@media (max-width: @webBoundary) {
  .ufs-scroll-tip {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: @ufsOrange;
    padding: 15px 0;
  }
}
</style>

<script>
export default {
  replace: true,
  props: {
    show: {
      type: Boolean,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  }
}
</script>
