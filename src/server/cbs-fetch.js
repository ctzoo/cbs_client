const fetch = require('axios').default

const clientId = 'testclientid'
const userId = 'testuserid'
let runNo = 0
const cbsUrl = 'http://localhost:3001/cbs'

module.exports = async function cbsFetch(data) {
  const cbsReq = data
    .replace('{clientId}', clientId)
    .replace('{userId}', userId)
    .replace('{runNo}', runNo++)

  const res = await fetch(cbsUrl, {
    method: 'GET',
    data: cbsReq,
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
    },
  })
  return res.data
}
