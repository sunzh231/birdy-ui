import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import routerConfig from './routers'
import App from './App'
import view from './utils/view'

Vue.use(VueRouter)
Vue.use(VueResource)

// http settings
let seqNum = 0
Vue.http.options.root = '/api'
Vue.http.interceptors.push({
  request (request) {
    if ('ActiveXObject' in window) {
      request.url += `${request.url.indexOf('?') > -1 ? '&' : '?'}ts=${new Date().getTime()}`
    }

    let isHomePage = window.location.hash.indexOf('/home') >= 0
    if (isHomePage && seqNum === 0) {
      document.getElementById('loading').style.display = 'block'
    }
    seqNum++

    return request
  },
  response (response) {
    seqNum--
    let isHomePage = window.location.hash.indexOf('/home') >= 0
    if (isHomePage && seqNum === 0) {
      document.getElementById('loading').style.display = 'none'
    }

    // handle api error
    switch (response.status) {
      case 401:
        const redirectUrl = encodeURIComponent(window.location.href)
        const domain = `${window.location.protocol}//${window.location.hostname}`
        const uri = '/webapp/ufscmcmall/site/portal'
        window.location.href = `${domain}${uri}?uri=${redirectUrl}`
        break
    }

    return response
  }
})

// router settings
let router = new VueRouter({
  saveScrollPosition: true
}).map(routerConfig)

router.redirect({
  '/': '/home',
  '/gift': '/gift/list',
  '/gift/detail': '/gift/list'
})
router.beforeEach((transition) => {
  if (!transition.to.noNeedAuth) {
    Vue.http.get('/webapp/ufscmcmall/site/check-auth').then((response) => {
      if (response.data.status === 'ok') {
        transition.next()
      } else {
        const domain = `${window.location.protocol}//${window.location.hostname}`
        const uri = '/webapp/ufscmcmall/site/portal'
        window.location.href = `${domain}${uri}`
      }
    })
  } else {
    transition.next()
  }
})
router.afterEach((transition) => {
  // scroll to top after route changes
  view.backToTop()

  // add google analytics
  if (window.ga) {
    const UDM = window.UDM
    const fields = {
      ...UDM.setCustomDimension,
      ...transition.to.googleAnalytics
    }
    const dimensionMap = {
      channel: 1,
      localbrand: 2,
      globalbrand: 3,
      category: 4,
      country: 5,
      sitetype: 6
    }
    for (const key in dimensionMap) {
      fields[`dimension${dimensionMap[key]}`] = UDM[key]
    }
    const trackingIDs = UDM.gaa.split(',')
    for (const [index, trackingID] of Object.entries(trackingIDs)) {
      const trackerName = `clientTracker${index}`
      window.ga('create', trackingID, UDM.dom || 'auto', trackerName)
      window.ga(`${trackerName}.send`, 'pageview', fields)
    }
  }
})
router.start(App, '#app')
