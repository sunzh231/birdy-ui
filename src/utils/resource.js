let params = {}

// get the dmp-info, force means sending request to get the newest info
const lookupMe = (vm, force = false) => {
  const promise = new Promise((resolve, reject) => {
    if (params.dmpInfo && !force) {
      resolve(params.dmpInfo)
    } else {
      const dmpResource = vm.$resource('/api/ufscmcmall/member/dmp-info')
      dmpResource.get().then((response) => {
        params.dmpInfo = response.data
        resolve(params.dmpInfo)
      }) // TODO: maybe need to handle error here in the future
    }
  })

  return promise
}

const refreshMe = (newInfo) => {
  Object.assign(params.dmpInfo, newInfo)
  params.dmpInfo.isGQ = true
}

module.exports = {
  lookupMe,
  refreshMe
}
