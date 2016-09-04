<template>
  <div class="ufs-side-bar">
    <ul>
      <li class="side-bar-item" v-for="(index, item) in routes">
        <a class="side-bar-title" :class="{ 'active': isSelected(index, -1) }" :href="getLink(item)" @click="changeRoute(index, item, $event)">
          {{ item.name }}
        </a>
        <div :class="{ 'item-seleted': isSelected(index, -1) }"></div>
        <ul v-if="item.subRoutes && item.subRoutes.length > 0" v-show="isGroupSelected(index)">
          <li class="sub-side-bar-item" v-for="(subIndex, subItem) in item.subRoutes">
            <a :class="{ 'active': isSelected(index, subIndex) }" v-link="subItem.link" @click="changeSubRoute(subIndex, $event)">{{ subItem.name }}</a>
            <div :class="{ 'item-seleted': isSelected(index, subIndex) }"></div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

.ufs-side-bar {
  width: 151px;
  border: @ufsBarGray solid 1px;
  padding: 0 16px;

  ul {
    li a {
      color: @ufsFontGray;
      font-size: 16px;
      display: inline-block;
      cursor: pointer;
    }
  }

  .item-seleted {
    width: 15px;
    height: 15px;
    background: url('images/icon-angle-right.png') no-repeat;
    background-size: contain;
    display: inline-block;
    position: absolute;
    right: 16px;
  }

  .side-bar-item {
    position: relative;
    padding: 20px 0px;
    border-bottom: @ufsBarGray solid 2px;

    .item-seleted {
      top: 20px;
    }

    .side-bar-title {
      &.active {
        color: @ufsOrange;
      }
    }

    ul {
      padding-top: 6px;
      margin-top: 20px;
      border-top: @ufsBarGray solid 2px;

      .sub-side-bar-item {
        position: relative;
        margin-top: 12px;

        a.active {
          color: @ufsOrange;
        }

        .item-seleted {
          top: 1px;
        }
      }
    }

    &:first-child {
      .side-bar-title {
        color: @ufsFontBlack;
        &.active {
          color: @ufsOrange;
        }
      }
    }

    &:last-child {
      border-bottom: none;
    }
  }
}

@media (min-width: @webBoundary) {
  .ufs-side-bar {
  }
}

@media (max-width: @webBoundary) {
  .ufs-side-bar {
    display: none;
  }
}
</style>

<script>
export default {
  props: {
    routes: {
      type: Array,
      required: true
    },
    currentRoute: {
      type: Object,
      default: function () {
        return {
          index: 0,
          subIndex: -1
        }
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    changeRoute (idx, item, event) {
      if (event.ctrlKey) {
        // Do not change current state
      } else {
        this.currentRoute.subIndex = -1
        this.currentRoute.index = idx
      }
    },
    changeSubRoute (idx, event) {
      if (event.ctrlKey) {
        // Do not change current state
      } else {
        this.currentRoute.subIndex = idx
      }
    },
    isSelected (groupIdx, idx) {
      const selected = this.currentRoute.index === groupIdx && this.currentRoute.subIndex === idx
      return selected
    },
    isGroupSelected (groupIdx) {
      const selected = this.currentRoute.index === groupIdx
      return selected
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
