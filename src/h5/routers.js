import CONSTANT from './constant'

module.exports = {
  '/home': {
    name: '会员中心',
    // Is visiable in sidebar?
    visiable: true,
    // The order of group in sidebar
    groupIndex: 0,
    googleAnalytics: {
      dimension14: 'memberZone',
      dimension15: 'home'
    },
    component (resolve) {
      require(['./pages/home/home'], resolve)
    }
  },
  '/points/record': {
    name: '积分明细',
    visiable: true,
    parent: '/home',
    // The selected item's order in sidebar group when display current page
    index: 0,
    googleAnalytics: {
      dimension14: 'pointHistory',
      dimension15: 'list'
    },
    component (resolve) {
      require(['./pages/points/record/record'], resolve)
    }
  },
  '/points/rules': {
    name: '积分规则',
    parent: '/home',
    visiable: true,
    index: 1,
    googleAnalytics: {
      dimension14: 'pointRule',
      dimension15: 'detail'
    },
    component (resolve) {
      require(['./pages/points/rules/rules'], resolve)
    }
  },
  '/gift/list': {
    name: '积分兑礼',
    parent: '/home',
    visiable: true,
    index: 2,
    googleAnalytics: {
      dimension14: 'gift',
      dimension15: 'list'
    },
    component (resolve) {
      require(['./pages/gift/list/list'], resolve)
    }
  },
  '/gift/detail/:id': {
    name: '礼品详情',
    parent: '/home',
    index: 2,
    googleAnalytics: {
      dimension14: 'gift',
      dimension15: 'detail'
    },
    component (resolve) {
      require(['./pages/gift/detail/detail'], resolve)
    }
  },
  '/order/history': {
    name: '兑换记录',
    parent: '/home',
    visiable: true,
    index: 3,
    googleAnalytics: {
      dimension14: 'order',
      dimension15: 'history'
    },
    component (resolve) {
      require(['./pages/order/history/history'], resolve)
    }
  },
  '/order/detail/:orderId': {
    name: '记录详情',
    parent: '/home',
    index: 3,
    googleAnalytics: {
      dimension14: 'order',
      dimension15: 'orderDetail'
    },
    component (resolve) {
      require(['./pages/order/detail/detail'], resolve)
    }
  },
  '/order/confirm': {
    name: '订单确认',
    parent: '/home',
    index: 2,
    googleAnalytics: {
      dimension14: 'gift',
      dimension15: 'confirmOrder'
    },
    component (resolve) {
      require(['./pages/order/confirm/confirm'], resolve)
    }
  },
  '/order/success': {
    name: '下单成功',
    parent: '/home',
    index: 2,
    googleAnalytics: {
      dimension14: 'gift',
      dimension15: 'placeOrder'
    },
    component (resolve) {
      require(['./pages/order/success/success'], resolve)
    }
  },
  '/unauthorized': {
    name: 'unauthorized',
    hideOthers: true,
    noNeedAuth: true,
    component (resolve) {
      require(['./pages/unauthorized'], resolve)
    }
  },
  '/no-page': {
    name: 'no-page',
    hideOthers: true,
    noNeedAuth: true,
    component (resolve) {
      require(['./pages/no-page'], resolve)
    }
  },
  '/404': {
    name: '404',
    noNeedAuth: true,
    component (resolve) {
      require(['./pages/404'], resolve)
    }
  },
  '/profile': {
    name: '个人资料',
    visiable: true,
    url: CONSTANT.ufsProfileUrl,
    groupIndex: 1,
    component: {}
  },
  '/feedback': {
    name: '联系与反馈',
    visiable: true,
    url: CONSTANT.ufsFeedbackUrl,
    groupIndex: 3,
    component: {}
  }
}
