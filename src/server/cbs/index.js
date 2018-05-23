const gh = require('./generator-html')
const gt = require('./generator-txt')
const validate = require('./inputValidation')
const xlsx = require('node-xlsx').default
const pkg = require('./pkg')
const unpkg = require('./unpkg')

const { ERROR, VALIDATE_COMPLETED, BEGIN_PROC_WORKSHEET, ONE_RECORD_COMPLETED, WORKSHEET_COMPLETED } = require('../../consts')

const inputFieldNames = [
  'accountType',
  'amount',
  'enquiryReference',
  'enquiryType',
  'productType',
  'idType',
  'idNumber',
  'customerName',
  'dateOfBirth',
  'gender',
  'maritalStatus',
  'applicantType',
  'addressType',
  'addressFormat',
  'postalCode',
]
const makeReqData = xlsxRow => inputFieldNames.reduce((s, e, i) => ((s[e] = xlsxRow[i]), s), {})
module.exports = async function(reqData /* request byte data */, ad /* action dispach */, send) {
  const worksheets = xlsx.parse(reqData)
  const err = validate(worksheets)

  if (err) {
    ad(ERROR, err)
    return
  }

  ad(VALIDATE_COMPLETED)

  const pkgs = pkg(worksheets)

  const ret = { htmls: [] }
  let allResData = []

  for (let j = 0; j < pkgs.length; j++) {
    ad(BEGIN_PROC_WORKSHEET, { name: pkgs[j][0], count: pkgs[j][1].length })
    for (let i = 0; i < pkgs[j][1].length; i++) {
      const res = await send(pkgs[j][1][i])
      const reqData = makeReqData(worksheets[j].data[i])
      const resData = unpkg(res)
      allResData = allResData.concat(resData)
      const htmls = gh(reqData, resData)
      ret.htmls = ret.htmls.concat(htmls)
      ad(ONE_RECORD_COMPLETED, { name: pkgs[j][0], count: pkgs[j][1].length, completedCount: i + 1 })
    }
    ad(WORKSHEET_COMPLETED, { name: pkgs[j][0] })
  }

  ret.txts = gt(allResData)

  return ret
}
