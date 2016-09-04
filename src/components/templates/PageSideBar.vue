<template>
  <div class="side-bar">
    <div class="logo">
      <img />
      <span>Birdy</span>
    </div>
    <div class="user-panel">
      <img />
      <div class="user-info">
        <p>Richard</p>
        <p>Online</p>
      </div>
      <div class="search">
        <input type="text" value="Search"/>
      </div>
    </div>
    <div class="menu">
      <h5>主菜单</h5>
      <ul>
        <li v-for="(index, item) in routes" :class="{ 'active': isSelected(index, -1) }">
          <div class="item-container" @click="changeRoute(index, item, $event)">
            <span class="icon icon-home"></span>
            <!-- <btn :btn-type="link" :btn-link="item.link" :text="item.title"></btn> -->
            <a v-link="item.link" :href="getLink(item)">{{ item.title }}</a>
            <span class="icon icon-left icon-down"></span>
          </div>
          <ul v-if="item.subRoute && item.subRoute.length > 0" v-show="isGroupSelected(index)">
            <li v-for="(subIndex, subItem) in item.subRoute" :class="{ 'active': isSelected(index, -1) }">
              <a v-link="subItem.link" :href="getLink(item)" @click="changeRoute(index, item, $event)">{{ subItem.title }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.side-bar {
  padding-bottom: 9999px;
  margin-bottom: -9999px;
  width: 220px;
  min-height: 100%;
  background: #222d32;
  color: #FFFFFF;

  .logo {
    width: 100%;
    height: 45px;
    line-height: 45px;
    background: #367fa9;

    span {
      font-size: 32px;
    }
  }

  .user-panel {
    height: 100px;
    padding: 10px 20px;

    img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: #FFFFFF;
      float: left;
      margin-bottom: 10px;
    }

    .user-info {
      float: left;
      margin-left: 20px;
      line-height: 24px;
    }

    .search {
      margin-top: 10px;

      input {
        width: 100%;
        height: 30px;
      }
    }
  }

  .menu {
    text-align: left;

    h5 {

    }

    .icon {
      display: inline-block;
      width: 16px;
      height: 16px;
    }

    ul {
      margin-top: 10px;

      li {
        min-height: 40px;
        line-height: 40px;

        .item-container {
          padding: 0 20px;
          cursor: pointer;

          .icon-home {
            background: url('../../assets/images/home_page.png')
          }

          a {
            margin-left: 5px;
          }

          .icon-left {
            background: url('../../assets/images/icon_left.png');
            float: right;
            margin-top: 10px;
          }
        }

        ul li {
          min-height: 30px;
          line-height: 30px;
          padding-left: 45px;
        }

        &.active {
          .item-container {
            border-left: #3c8dbc solid 3px;

            a {
              margin-left: 5px;
            }

            .icon-down {
              background: url('../../assets/images/icon_down.png');
              float: right;
            }
          }
        }
      }
    }
  }
}
</style>

<script>
import Btn from '../units/Btn'

export default {
  props: {
    routes: {
      type: Array,
      required: false,
      default: function () {
        return [
          { title: 'Dashborad', link: '#/home', subRoute: [
            { title: '首页', link: '#/home' },
            { title: '首页', link: '#/home' }
          ]},
          { title: '用户', link: '#/user', subRoute: [
            { title: '首页', link: '#/home' },
            { title: '首页', link: '#/home' }
          ]},
          { title: '首页', link: 'hello' }
        ]
      }
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
  },
  components: {
    Btn
  }
}
</script>
