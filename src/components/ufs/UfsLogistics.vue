<template>
  <div class="ufs-logistics-container">
    <p class="ufs-logistics-label">物流信息</p>
    <ul class="ufs-logistics-wrapper">
      <li class="logistics-log" v-for="log in logistics.orderTrack">
        <i class="log-list-style"></i>
        <p class="log-time-line">{{ log.msgTime }}</p>
        <p class="log-info-text">{{ log.content }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

@font-gray: #bcbec0;
@font-black: #5e5e5e;

.ufs-logistics-container {
  max-width: 680px;
  margin: 10px;
  text-align: left;
  font-size: 16px;
  line-height: 20px;
  color: @ufsFontBlack;

  p {
    margin: 0;
  }

  .ufs-logistics-label {
    width: 90%;
    border: 2px solid @ufsBarGray;
    border-left: none;
    border-right: none;
    padding: 5px 0;
  }

  .ufs-logistics-wrapper {
    max-height: 700px;
    overflow-y: auto;
    padding-top: 20px;

    .logistics-log {
      position: relative;
      color: @font-gray;
      padding: 0 0 30px 25px;
      margin: 0 10px;
      border-left: 2px solid @ufsOrange;

      .log-list-style {
        position: absolute;
        left: -7px;
        top: 0px;
        display: inline-block;
        border: 6px solid @ufsOrange;
        border-radius: 50%;
      }

      .log-time-line {
        float: left;
        margin: -2px 0 4px 0;
        width: 100%;
      }

      &:first-child {
        color: @font-black;
      }
    }
  }
}

@media (max-width: @webBoundary) {
  .ufs-logistics-container {
    font-size: 12px;
    line-height: 16px;

    .ufs-logistics-label {
      width: auto;
      margin: 0 5px;
    }

    .ufs-logistics-wrapper {
      max-height: 100%;
      padding-top: 16px;

      .logistics-log {
        padding: 0 0 16px 20px;
        border-left: 1px solid @ufsOrange;

        .log-list-style {
          left: -3.5px;
          top: 0px;
          border: 3px solid @ufsOrange;
        }

        .log-time-line {
          margin: -4px 0 2px 0;
        }
      }
    }
  }
}
</style>

<script>
export default {
  replace: true,
  props: {
    logistics: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
  },
  watch: {
  },
  ready () {
  }
}
</script>
