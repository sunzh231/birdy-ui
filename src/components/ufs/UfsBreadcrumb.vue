<template>
  <div class="ufs-breadcrumb">
    <ul>
      <li v-for="(index, item) in breadcrumbs">
        <span v-if="$index >= 1" class="arrow-icon"></span><a v-if="item.link" :href="getLink(item)" class="breadcrum" @click="changeBreadcrumbs(index, item, $event)">{{ item.name }}</a><span v-else class="breadcrum">{{ item.name }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

@breadcrumb-height: 30px;
@breadcrumb-height-small: 20px;

.ufs-breadcrumb {
  width: 100%;
  text-align: left;

  ul {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      display: inline-block;
      height: @breadcrumb-height;
      line-height: @breadcrumb-height;

      .arrow-icon {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 30px;
        background: url('./images/icon-angle-right.png') center center no-repeat;
        background-size: cover;
        margin: 0 20px;
      }
      .breadcrum {
        display: inline-block;
        vertical-align: middle;
        color: @ufsOrange;
        font-size: 24px;
      }
    }
  }

  &.large-orange {
  }

  &.small-black {
    ul {
      li {
        height: @breadcrumb-height-small;
        line-height: @breadcrumb-height-small;

        .arrow-icon {
          width: 10px;
          height: 16px;
          background: url('./images/icon-angle-right.png') center center no-repeat;
          background-size: cover;
          margin: 0 8px;

          /* used to convert background image to gray, maybe not support IE. if style 'small-black' is needed, should remove this part and change the background image */
          -webkit-filter: grayscale(100%);
          -moz-filter: grayscale(100%);
          -ms-filter: grayscale(100%);
          -o-filter: grayscale(100%);
          filter: grayscale(100%);
          filter: gray;
        }
        .breadcrum {
          color: #231f20;
          font-size: 16px;
        }
      }
    }
  }
}

@media (min-width: @webBoundary) {
  .ufs-breadcrumb {
  }
}

@media (max-width: @webBoundary) {
  .ufs-breadcrumb {
    display: none;
  }
}
</style>

<script>
export default {
  props: {
    breadcrumbs: {
      type: Array,
      required: true
    },
    style: {
      type: String,
      required: false,
      default: 'large-orange' // 'small-black'
    }
  },
  data () {
    return {
    }
  },
  methods: {
    changeBreadcrumbs (idx, item, event) {
      if (event.ctrlKey) {
        // Do not change current state
      } else {
        this.breadcrumbs.splice(idx + 1, this.breadcrumbs.length - idx - 1)
      }
    },
    getLink (item) { // provide the href attribute for <a> to support "open in new window" selection in right click menu
      if (item.url) {
        return item.url
      } else {
        return window.location.hash.replace(this.$route.path, item.link)
      }
    }
  }
}
</script>
