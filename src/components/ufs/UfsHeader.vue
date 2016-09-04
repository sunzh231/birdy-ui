<template>
  <div class="ufs-header">
    <div class="container">
      <a class="logo-container" href="{{ homeUrl }}">
        <img class="logo" src="./images/logo.jpg">
      </a><ul class="menu">
        <li v-for="item in menus">
          <a href="{{ item.link }}" @click="changeMenu($index)" :class="{ 'active': item.active }">{{ item.name }}</a>
        </li>
      </ul>
      <div v-if="!isLogin" class="login">
        <i class="icon-user-default"></i>
        <span class="user">
          <a href="/login.html">登录</a>
        </span>
      </div>
      <div class="search">
        <button type="button" class="search-btn" @click="handleSearch"></button>
        <input
          type="text"
          v-model="keyword"
          class="search-input"
          placeholder="食材/菜谱/厨艺/产品"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';
@import '../../../../static/h5/styles/mixins.less';

@header-height: 70px;
@header-height-pad: 55px;
@header-height-phone: 45px;

@header-search-height: 45px;
@header-search-height-phone: 34px;

@header-search-input-color: #555;

.ufs-header {
  width: 100%;
  height: @header-height;
  line-height: @header-height - 3;
  background: @white;
  position: fixed;
  border-bottom: 3px solid @ufsGray;
  z-index: 99;

  .container {
    width: @webBoundary;
    height: 100%;
    margin: 0 auto;
    font-size: 18px;
    text-align: left;

    .logo-container {
      display: inline-block;
      width:16.6666%;

      .logo {
        vertical-align: top;
        width: auto;
        height: 100%;
      }
    }

    .menu {
      .clearfix();
      padding: 0;
      margin: 0;
      vertical-align: top;
      display: inline-block;

      li {
        display: inline-block;
        width: 100px;
        float: left;

        a {
          display: inline-block;
          margin-left: 20px;
          color: #777;
          box-sizing: border-box;
          float: left;

          &.active {
            border-bottom: 3px solid @ufsOrange;
            color: @ufsOrange;
          }
        }
      }
    }

    .login {
      vertical-align: top;
      display: inline-block;
      margin-left: 70px;

      .icon-user-default {
        display: inline-block;
        vertical-align: middle;
        width: 25px;
        height: 25px;
        background: url("./images/icon-user.png") center center no-repeat;
        background-size: cover;
      }

      .user {
        vertical-align: middle;

        a {
          color: @ufsOrange;
        }
      }
    }

    .search {
      display: inline-block;
      float: right;
      margin-top: @header-height / 2 - @header-search-height / 2 - 3px;
      .clearfix();

      .search-input {
        float: right;
        color: @header-search-input-color;
        outline: 0;
        display: inline-block;
        width: 166px;
        line-height: 29px;
        height: 29px;
        padding: 7px 12px 5px;
        font-size: 14px;
        border: 2px solid @ufsOrange;
        border-right: 0;
        border-radius: 0;
        appearance: none;
        margin: 0;
      }

      .search-btn {
        float: right;
        outline: 0;
        border: 0;
        display: inline-block;
        height: @header-search-height;
        width: @header-search-height;
        cursor: pointer;
        background: url("./images/icon-search.jpg") center center no-repeat;
        background-size: cover;
      }
    }
  }
}

@media (max-width: @webBoundary) {
  .ufs-header {
    height: @header-height-pad;
    line-height: @header-height-pad;
    padding-bottom: 3px;

    .container {
      width: 100%;

      .menu, .login {
        display: none;
      }

      .logo-container {
        display: inline;

        .logo {
          margin-left: 25px;
        }
      }

      .search {
        margin-right: 25px;
        margin-top: @header-height-pad / 2 - @header-search-height / 2;

        .search-input {
          width: 214px;
        }
      }
    }
  }
}

@media (max-width: @padBoundary) {
  .ufs-header {
    height: @header-height-phone;
    line-height: @header-height-phone;

    .container {

      .logo-container {
        .logo {
          margin-left: 15px;
        }
      }

      .search {
        margin-right: 15px;
        width: 60%;
        margin-top: @header-height-phone / 2 - @header-search-height-phone / 2;

        .search-input {
          width: 68%;
          line-height: 18px;
          height: 18px;
        }

        .search-btn {
          height: @header-search-height-phone;
          width: @header-search-height-phone;
        }
      }
    }
  }
}
</style>

<script>
import CONSTANT from '../constant'

export default {
  props: {
    isLogin: {
      type: Boolean,
      required: true
    },
    menus: {
      type: Array,
      required: true
    },
    currentMenu: {
      type: Number,
      required: false,
      default: -1
    }
  },
  data () {
    return {
      keyword: '',
      homeUrl: CONSTANT.websiteHost
    }
  },
  methods: {
    changeMenu (idx) {
      this.currentMenu = idx
    },
    handleSearch () {
      let keyword = this.keyword.trim()
      if (!keyword) {
        this.keyword = ''
        return
      }

      window.location.href = `${CONSTANT.websiteHost}/search.html?keyword=${encodeURIComponent(keyword)}`
    }
  }
}
</script>
