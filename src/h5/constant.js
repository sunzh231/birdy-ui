let websiteHost, securityHost, onPackUrl
const isProductionEnv = () => {
  return isDomain() || isSecurityDomain()
}

const isDomain = () => {
  const domain = 'http://china.unileverfoodsolutions.com.cn'
  return window.location.href.indexOf(domain) > -1
}

const isSecurityDomain = () => {
  const domain = 'https://secure.unileverfoodsolutions.com.cn'
  return window.location.href.indexOf(domain) > -1
}

if (isProductionEnv()) { // production enviromemt
  websiteHost = 'http://china.unileverfoodsolutions.com.cn'
  securityHost = 'https://secure.unileverfoodsolutions.com.cn'
  onPackUrl = 'http://c2.topchef.net.cn/unileverexpiry/Ticket/TicketIndex'
} else { // stage enviromemt
  websiteHost = 'http://stage.publish.unileverfoodsolutions.com.cn'
  securityHost = 'http://stage.publish.unileverfoodsolutions.com.cn'
  onPackUrl = 'http://cadmin2.topchef.net.cn/project.php?r=onpack2/site/index'
}

module.exports = {
  websiteHost: websiteHost,
  securityHost: securityHost,
  orderState: [
    '发货中',
    '订单完成',
    '订单拒收'
  ],
  rechargeState: [
    '充值中',
    '充值成功',
    '充值失败'
  ],
  headerMenuHref: {
    home: `${websiteHost}`,
    recipes: `${websiteHost}/recipes.html`,
    skills: `${websiteHost}/skills.html`,
    my: `${websiteHost}/my/my-favorite.html`
  },
  ufsProfileUrl: `${securityHost}/my/my-profile.html`,
  ufsFeedbackUrl: `${websiteHost}/my/feedback.html`,
  onPackUrl: onPackUrl,
  phoneReg: '^1[34578][0-9]{9}$'
}
