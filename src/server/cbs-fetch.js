const fetch = require('axios').default
const logger = require('./logger')('cbs-fetch')

module.exports = function cbsFetch(data) {
  logger.info('begin send:\n%o', data)
  return fetch('http://localhost:8080/cbs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data,
    responseType: 'json',
  }).then(res => {
    logger.info('revice:\n%o', res.data)
    return res.status === 200 ? res.data : { isErr: true, items: res.data }
  }).catch(err => {
    logger.error('revice:\n%o', err.response ? err.response.data : err.message)
    return ({ isErr: true, items: err.response ? err.response.data : err.message })
  })
}