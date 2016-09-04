const backToTop = (acceleration = 0.2, time = 16) => {
  let x1 = 0
  let y1 = 0
  let x2 = 0
  let y2 = 0
  let x3 = 0
  let y3 = 0

  // fix IE11 can't scroll to top
  // http://stackoverflow.com/questions/21268450/body-scrolltop-is-deprecated-in-strict-mode-please-use-documentelement-scrollt
  if (document.documentElement) {
    x1 = document.documentElement.scrollLeft || 0
    y1 = document.documentElement.scrollTop || 0
  }
  if (document.body) {
    x2 = document.body.scrollLeft || 0
    y2 = document.body.scrollTop || 0
  }
  x3 = window.scrollX || 0
  y3 = window.scrollY || 0

  const x = Math.max(x1, Math.max(x2, x3))
  const y = Math.max(y1, Math.max(y2, y3))

  const speed = 1 + acceleration
  window.scrollTo(Math.floor(x / speed), Math.floor(y / speed))

  if (x > 0 || y > 0) {
    window.setTimeout(() => backToTop(acceleration, time), time)
  }
}

module.exports = {
  backToTop
}
