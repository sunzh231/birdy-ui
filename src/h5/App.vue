<template>
  <div id="ufs-member-center">
    <ufs-header :is-login="isLogin" :menus="menus" :current-menu="currentMenu">
    </ufs-header>
    <div class="container">
      <ufs-breadcrumb v-if="!showMainViewOnly" class="breadcrumb" :breadcrumbs="breadcrumbs"></ufs-breadcrumb>
      <ufs-side-bar v-if="!showMainViewOnly" :style="{ float: 'left' }" :routes="routes" :current-route="currentRoute"></ufs-side-bar>
      <div class="main" :style="showMainViewOnly ? '' : { float: 'left' }">
        <router-view></router-view>
      </div>
    </div>
    <ufs-footer :is-show-footer="isShowFooter" :is-home-page="isHomePage"></ufs-footer>
    <ufs-back-to-top></ufs-back-to-top>
    <div id="loading">
      <div class="loading-icon"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import './styles/variables.less';

#ufs-member-center {
  text-align: center;

  .container {
    margin-top: @headerHeight;
    margin-bottom: 45px;
    display: inline-block;
    max-width: @webBoundary;
    width: 100%;

    .breadcrumb {
      padding: 30px 0;
    }

    .main {
      display: inline-block;
      width: 750px;
      margin-left: 25px;
    }
  }
}

@media (min-width: @webBoundary) {
  #ufs-member-center {
    .container {
      .main {
        min-height: 700px;
      }
    }
  }
}

@media (max-width: @webBoundary) {
  #ufs-member-center {
    .container {
      margin-top: @headerHeightPad;
      margin-bottom: 45px;

      .main {
        min-height: 400px;
        width: 100%;
        margin: 0;
      }
    }
  }
}

@media (max-width: @padBoundary) {
  #ufs-member-center {
    .container {
      margin-top: @headerHeightPhone;
      margin-bottom: @footerHeightPhone;

      .main {
        width: 100%;
        margin: 0;
      }
    }
  }
}

#loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: 0 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, .168627);
  display: none;

  .loading-icon {
    -webkit-animation: rotate 1s linear infinite;
    -o-animation: rotate 1s linear infinite;
    animation: rotate 1s linear infinite;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 30px;
    margin: -20px 0 0 -20px;
    border-width: 5px;
    border-style: solid;
    border-color: @ufsOrange @ufsOrange @white @white;
    opacity: .9;
    border-radius: 20px;
  }
}

@keyframes rotate {
  0% {
      transform: rotate(0);
  }
  100% {
      transform: rotate(360deg);
  }
}
</style>

<script>
import './styles/reset.less'
import './pages/home/home.less'

import routerConfig from './routers'
import UfsHeader from './components/UfsHeader'
import UfsFooter from './components/UfsFooter'
import UfsBreadcrumb from './components/UfsBreadcrumb'
import UfsSideBar from './components/UfsSideBar'
import UfsBackToTop from './components/UfsBackToTop'
import CONSTANT from './constant'

export default {
  data () {
    return {
      isLogin: true,
      menus: [
        {name: '首页', link: CONSTANT.headerMenuHref.home},
        {name: '菜谱', link: CONSTANT.headerMenuHref.recipes},
        {name: '厨艺', link: CONSTANT.headerMenuHref.skills},
        {name: '我的', link: CONSTANT.headerMenuHref.my, active: true}
      ],
      currentMenu: -1,
      breadcrumbs: [],
      currentRoute: {
        index: 0,
        subIndex: -1
      },
      showMainViewOnly: false,
      isShowFooter: true,
      isHomePage: true
    }
  },
  components: {
    UfsHeader, UfsFooter, UfsBreadcrumb, UfsSideBar, UfsBackToTop
  },
  methods: {
    updateSideBarAndBreadcrumbs (currentPath) {
      // remove query part
      currentPath = currentPath.replace(/\?\S*/, '')
      const validPathes = Object.keys(routerConfig)
      for (const subRouteKey of validPathes) {
        // https://github.com/mongodb/js-bson/blob/master/lib/bson/objectid.js
        const exp = new RegExp(`^${subRouteKey.replace(/:(\S)+/, '[0-9a-fA-F]{24}')}\\/{0,1}$`) // handle path with mongoId and path ends with or without '/'
        if (exp.test(currentPath)) {
          currentPath = subRouteKey
          break
        }
      }
      if (validPathes.indexOf(currentPath) < 0) {
        this.$router.go({ path: '/404' })
        return
      }

      if (currentPath === '/home') {
        this.isHomePage = true
      } else {
        this.isHomePage = false
      }

      const currentPathConfig = routerConfig[currentPath]
      if (currentPathConfig.hideOthers) {
        this.showMainViewOnly = true
        return
      } else {
        this.showMainViewOnly = false
      }

      let parentPath = currentPathConfig.parent
      if (parentPath === undefined) {
        this.currentRoute = {
          // Select first route when display 404 page
          index: currentPathConfig.groupIndex ? currentPathConfig.groupIndex : 0,
          subIndex: -1
        }
      } else {
        const parentPathConfig = routerConfig[parentPath]
        this.currentRoute = {
          index: parentPathConfig.groupIndex,
          subIndex: currentPathConfig.index
        }
      }

      const breadcrumbs = [{
        name: '首页',
        link: '/',
        // TODO: Replace the url with the real url of production environment
        url: CONSTANT.headerMenuHref.home
      }, {
        name: '我的',
        link: '/',
        url: CONSTANT.headerMenuHref.my
      }]
      const currentRouteConfig = this.routes[this.currentRoute.index]
      breadcrumbs.push({
        name: currentRouteConfig.name,
        link: currentRouteConfig.link
      })
      if (this.currentRoute.subIndex >= 0) {
        const subRoute = currentRouteConfig.subRoutes[this.currentRoute.subIndex]
        breadcrumbs.push(subRoute)
      }
      this.breadcrumbs = breadcrumbs
    }
  },
  init () {
    const routes = []
    const routesMap = {}
    for (const path of Object.keys(routerConfig)) {
      const pathConfig = routerConfig[path]
      if (!pathConfig.visiable) {
        continue
      }
      if (pathConfig.parent !== undefined) {
        routesMap[pathConfig.parent].subRoutes.push({
          name: pathConfig.name,
          link: path
        })
      } else {
        routesMap[path] = {
          name: pathConfig.name,
          // Profile, Feedback pages need to jump to official website
          url: pathConfig.url,
          link: path,
          subRoutes: []
        }
      }
    }
    for (const firstLevelPath of Object.keys(routesMap)) {
      routes.push({
        name: routesMap[firstLevelPath].name,
        link: firstLevelPath,
        url: routesMap[firstLevelPath].url,
        subRoutes: routesMap[firstLevelPath].subRoutes
      })
    }
    this.routes = routes
  },
  ready () {
    this.$on('modal-show', () => {
      this.isShowFooter = false
    })
    this.$on('modal-hide', () => {
      this.isShowFooter = true
    })
    let currentPath = window.location.hash.match('[^#!].*')[0]
    this.updateSideBarAndBreadcrumbs(currentPath.toString())
    this.$watch('$route.path', (value) => {
      this.updateSideBarAndBreadcrumbs(value)
    })
  }
}
</script>
