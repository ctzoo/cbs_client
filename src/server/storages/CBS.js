const level = require('level')
const crypto = require('crypto')

const db = level('./storage_cbs')
const CONFIG_KEY = 's_config'
const RUN_NO_KEY = 's_run_no'
const getRefKey = refNo => 'r_' + refNo

function atomCall(fn) {
  let p = Promise.resolve()
  return (...args) => {
    p = p.then(() => fn(...args))
    return p
  }
}

function _getRunNo() {
  return db
    .get(RUN_NO_KEY)
    .then(no => db.put(RUN_NO_KEY, parseInt(no) + 1).then(() => no.toString().padStart(7, '0')))
    .catch(err => {
      if (err.notFound) {
        return db.put(RUN_NO_KEY, 1).then(() => '0000000')
      } else {
        throw err
      }
    })
}

const getRunNo = atomCall(_getRunNo)

function getConfig() {
  return db
    .get(CONFIG_KEY)
    .then(configStr => JSON.parse(configStr))
    .catch(err => {
      if (err.notFound) {
        return null
      } else {
        throw err
      }
    })
}

function setConfig(config) {
  return db.put(CONFIG_KEY, JSON.stringify(config))
}

/**
 * @param info {name, hash, req, res}
 * @returns {*}
 */
function saveCbsEnquiryInfo(info) {
  info.hash = crypto.createHash('md5').update(info.req).digest('hex')
  return db.put(getRefKey(info.name), JSON.stringify(info))
}

/**
 *
 * @param name 参考号
 * @param data 计算hash的数据
 * @returns {*}
 */
function getCbsEnquiryInfo(name, data) {
  return db.get(getRefKey(name))
    .then(infoStr => JSON.parse(infoStr))
    .then(info => {
      const hash = crypto.createHash('md5').update(data).digest('hex')
      if (hash === info.hash)
        return info
      else
        return {
          res: {
            isErr: true,
            res: `The Enquiry Reference [${name}] is not consistent with the content of the query`
          }
        }
    })
    .catch(err => {
      if (err.notFound) {
        return null
      } else {
        throw err
      }
    })
}

module.exports = {
  getConfig,
  setConfig,
  getFetchSetting() {
    return getConfig()
      .then(config => {
        // console.log(config)
        // console.log(config === null)
        if (config === null) {
          throw new Error('no cbs config')
        } else {
          return config
        }
      })
      .then(config => getRunNo().then(rn => ({
        ...config,
        runNo: rn
      })))
  },
  saveCbsEnquiryInfo,
  getCbsEnquiryInfo
}