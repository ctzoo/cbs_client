const fetch = require('axios').default
const { getFetchSetting } = require('./storages/CBS')
const logger = require('./logger')('cbs-fetch')

module.exports = async function cbsFetch(data) {
  const { clientId, userId, runNo, cbsUrl, username, password } = await getFetchSetting()
  const cbsReq = data
    .replace('{clientId}', clientId)
    .replace('{userId}', userId)
    .replace('{runNo}', runNo)

  logger.info('begin send:\n%o', cbsReq)
  const res = await fetch(cbsUrl, {
    method: 'POST',
    data: cbsReq,
    auth: {
      username,
      password,
    },
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  })
  logger.info('revice:\n%o', res.data)
  return res.data
}
