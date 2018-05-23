const level = require('level')

const db = level('./storage_cbs')
const CONFIG_KEY = 's_config'
const RUN_NO_KEY = 's_run_no'

// const stream = db.createReadStream()
// stream.on('data', data => console.log(data))
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
      // console.log(err)
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
      .then(config => getRunNo().then(rn => ({ ...config, runNo: rn })))
  },
}
