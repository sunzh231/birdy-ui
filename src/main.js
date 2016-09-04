import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import VueTap from 'vue-tap'
import VueI18n from 'vue-i18n'
import routerConfig from './routers'

// import RestService from './service/RestService'

import App from './App.vue'

Vue.use(Router)
Vue.use(Resource)
Vue.use(VueTap)
Vue.use(VueI18n, {
  lang: 'zh_cn',
  locales: require('./locales')
})

var router = new Router({
  hashbang: false,
  history: false,
  saveScrollPosition: true
}).map(routerConfig)

router.beforeEach(function (transition) {
  if (transition.to.path) {
    // handlewechat.init(new Vue()) // init wechat jssdk config
    transition.next()
  }
})

router.redirect({
  '/': '/main/dashboard'
})

router.start(App, '#app')
