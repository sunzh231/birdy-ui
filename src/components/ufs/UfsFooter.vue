<template>
  <div class="ufs-footer" v-if="isShowFooter" v-el:dialog>
    <!-- Footer for website -->
    <div class="ufs-footer-bottom">
      <div class="footer-left">
        <p>
          2016 版权所有: 本网站信息属于联合利华饮食策划
          <br>
          沪ICP备10027436号
          <span class="beian">
            <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010502000349">
              <span class="beian-icon"></span>
              <span>沪公网安备 31010502000349号</span>
            </a>
          </span>
        </p>
      </div>
      <div class="footer-right text-right">
        <p class="xs-pull-left md-pull-right">
          服务热线: 400-988-1088<br>
          <a v-link="{ path: '/map.html'}">网站地图</a> | <a v-link="{ path: '/policy.html'}">法律声明</a> |
          <a href="http://www.unileverprivacypolicy.com/simplified_chinese/policy.aspx">隐私权声明</a>
        </p>
      </div>
    </div>

    <!-- Footer for ipad or mobile -->
    <div class="ufs-footer-fixed" :class="{'ufs-home-style': isHomePage}">
      <ul class="ufs-footer-items">
          <li class="pull-left">
            <a class="item-back-link" @click="historyBack">
              <i class="icon-angle-left icon-xs-normal"></i>
            </a>
          </li>
          <li class="pull-left">
            <a @click="showOrHideMenu">
              <i class="icon icon-xs-normal icon-list"></i>
            </a>
            <div v-show="isShowMenu" class="menu-items-wrap">
                <ul class="menu-items active">
                  <li v-for="menu in menus">
                    <a href="{{ menu.link }}" class="box-center">
                      <i class="icon icon-xs-small icon-box" :class="menu.class"></i>
                      <span>{{ menu.title }}</span>
                    </a>
                  </li>
                </ul>
            </div>
          </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../styles/mixin.less';
@import '../styles/variables.less';

@footer-text-gray-color: #777;
@footer-mobile-link-color: #F15C22;
@footer-text-font-size: 14px;
@footer-mobile-link-font-size: 12px;

.ufs-footer {
  width: 100%;
  background: @white;
  font-size: @footer-text-font-size;

  .pull-left {
    float: left!important;
  }

  .ufs-footer-bottom {
    margin-right: auto;
    margin-left: auto;
    line-height: 20px;
    width: @webBoundary;

    .footer-left,
    .footer-right {
      width: 50%;
      float: left;
    }

    .footer-left {
      text-align: left;
    }

    .text-right {
      text-align: right;
    }

    p {
      margin: 0 0 10px;
      color: @footer-text-gray-color;
    }

    a {
      color: gray;
    }
  }

  .ufs-footer-fixed {
    position: fixed;
    z-index: 5;
    bottom: 0;
    left: 0;
    width: 100%;
    min-height: 45px;

    .footer-icon(@url) {
      position: relative;
      display: block;
      margin-left: auto;
      margin-right: auto;
      transition: transform 400ms;
      -webkit-transition: transform 400ms;
      background-image: url(@url);
      background-position: 50%;
      background-repeat: no-repeat;
      background-size: 100%;
    }

    .menu-icon(@url) {
      transition: transform 400ms;
      -webkit-transition: transform 400ms;
      background-image: url(@url);
      background-position: 50%;
      background-repeat: no-repeat;
      background-size: 100%;
    }

    .icon-xs-normal {
      .size(25px, 25px);
    }

    .icon-xs-small {
      .size(18px, 18px);
    }

    .ufs-footer-items {
      width: 100%;
      z-index: 10;
      background-color: @white;
      padding-left: 0;
      list-style: none;

      > li {
        .size(45px, 45px);
        display: table;
        border-right: 2px solid @ufsGray;
        text-align: center;
        position: relative;

        > a {
          display: table-cell;
          vertical-align: middle;
          font-size: @footer-mobile-link-font-size;
          color: @footer-text-gray-color;
          line-height: 1.2em;
          padding: 5px 5px 0;
        }
      }
    }

    .menu-items-wrap {
      position: absolute;
      z-index: 5;
      left: 0;
      bottom: 100%;
      background-color: @white;

      .menu-items {
        padding: 0;
        list-style-type: none;

        > li {
          padding: 7.5px;
          border-bottom: 1px solid @ufsGray;
          width: 75px;

          > a {
            color: @footer-mobile-link-color;
          }
        }
      }
    }

    .icon-box {
      .box();
      position: relative;
      margin: 0 5px;
    }

    .icon-home {
      .menu-icon("./images/icon-home-active.png");
    }

    .icon-menu {
      .menu-icon("./images/icon-menu-active.png");
    }

    .icon-dictionary {
      .menu-icon("./images/icon-dictionary-active.png");
    }

    .icon-me {
      .menu-icon("./images/icon-me-active.png");
    }

    .icon-angle-left {
      .footer-icon("./images/icon-angle-left.png");
    }

    .icon-list {
      .footer-icon("./images/icon-list.png");
    }

    &.ufs-home-style {
      box-shadow: 0 20px 50px @black;

      .ufs-footer-items {
        > li {
          width: 100%;

          &:first-child {
            display: none;
          }

          > a {
            display: none;
          }

          .menu-items-wrap {
            display: block !important;
            position: initial;
            z-index: initial;
            left: initial;
            bottom: initial;

            ul li {
              float: left;
              box-sizing: border-box;
              width: 25%;
              padding: 0;
              border: none;

              a {
                display: block;
                padding: 6.5px 0;
                font-size: @footer-mobile-link-font-size;
                color: @footer-text-gray-color;

                i {
                  display: block;
                  margin: 0 auto;

                  &.icon-home {
                    .menu-icon("./images/icon-home.png");
                  }

                  &.icon-menu {
                    .menu-icon("./images/icon-menu.png");
                  }

                  &.icon-dictionary {
                    .menu-icon("./images/icon-dictionary.png");
                  }
                }

                span {
                  display: block;
                  margin: 0 auto;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media (min-width: @webBoundary) {
  .ufs-footer {
    border-top: 3px solid @ufsGray;
    padding-top: 15px;
    z-index: 50;
    height: 50px;

    .ufs-footer-fixed {
      display: none;
    }

    .beian-icon {
      .size(20px, 20px);
      display: inline-block;
      background-image: url('./images/beian.png');
      background-repeat: no-repeat;
      background-size: 100%;
      margin-left: 3.75px;
      vertical-align: middle;
      position: relative;
      top: -3px;
    }
  }
}

@media (max-width: @webBoundary) {
  .ufs-footer {
    position: fixed;
    bottom: 0;
    height: @footerHeightPhone;
    box-shadow: 0 -2px 4px rgba(88,88,88,.1);

    .ufs-footer-bottom {
      display: none;
    }
  }
}
</style>

<script>
import CONSTANT from '../constant'

export default {
  props: {
    isShowFooter: {
      type: Boolean,
      default: true
    },
    isHomePage: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isShowMenu: false,
      menus: [
        { class: 'icon-home', title: '首页', link: CONSTANT.headerMenuHref.home },
        { class: 'icon-menu', title: '菜谱', link: CONSTANT.headerMenuHref.recipes },
        { class: 'icon-dictionary', title: '厨艺', link: CONSTANT.headerMenuHref.skills },
        { class: 'icon-me', title: '我的', link: CONSTANT.headerMenuHref.my }
      ]
    }
  },
  methods: {
    historyBack () {
      this.isShowMenu = false
      window.history.back()
    },
    showOrHideMenu () {
      this.isShowMenu = !this.isShowMenu
    },
    hideMenu () {
      this.isShowMenu = false
    }
  },
  ready () {
    // does not support IE 7 8 so does not care attachEvent
    window.addEventListener('scroll', this.hideMenu)
  },
  destroyed () {
    window.removeEventListener('scroll', this.hideMenu)
  }
}
</script>
