module.exports = {
  '/login': {
    name: 'login',
    component (resolve) {
      require(['./modules/Login'], resolve)
    }
  },
  '/main': {
    component (resolve) {
      require(['./modules/Main'], resolve)
    },
    subRoutes: {
      '/dashboard': {
        name: 'dashboard',
        component (resolve) {
          require(['./modules/dashboard/Dashboard'], resolve)
        }
      },
      '/user': {
        name: 'user',
        component (resolve) {
          require(['./modules/user/User'], resolve)
        }
      }
    }
  }
}
