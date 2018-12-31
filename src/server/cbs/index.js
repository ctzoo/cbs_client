const gh = require('./generator-html')
const gt = require('./generator-txt')
const gp = require('./generator-pdf')
const validate = require('./inputValidation')
const xlsx = require('node-xlsx').default
const pkg = require('./xlsxParser')

const {
  ERROR,
  VALIDATE_COMPLETED,
  BEGIN_PROC_WORKSHEET,
  ONE_RECORD_COMPLETED,
  WORKSHEET_COMPLETED,
  BOC_DTS_COMPLETED,
  ERROR_REPORT_COMPLETED,
} = require('../../consts')

module.exports = async function (reqData /* request byte data */ , ad /* action dispach */ , send) {
  const worksheets = xlsx.parse(reqData)
  const err = validate(worksheets)

  if (err) {
    ad(ERROR, err)
    return
  }

  ad(VALIDATE_COMPLETED)

  const pkgs = pkg(worksheets)

  const ret = {
    htmls: []
  }
  let allResData = []
  const errs = []

  for (let j = 0; j < pkgs.length; j++) {
    ad(BEGIN_PROC_WORKSHEET, {
      name: pkgs[j][0],
      count: pkgs[j][1].length
    })
    for (let i = 0; i < pkgs[j][1].length; i++) {
      const req = pkgs[j][1][i]
      const resData = await send(req.data)
      if (resData.isErr) {
        errs.push({
          req: JSON.stringify(req.data),
          res: JSON.stringify(resData)
        })
      } else {
        allResData = allResData.concat(resData.items)
        const htmls = gh(req.data, resData.items)
        ret.htmls = ret.htmls.concat(htmls)
      }
      ad(ONE_RECORD_COMPLETED, {
        name: pkgs[j][0],
        count: pkgs[j][1].length,
        completedCount: i + 1
      })
    }
    ad(WORKSHEET_COMPLETED, {
      name: pkgs[j][0]
    })
  }

  ret.txts = gt(allResData)
  ad(BOC_DTS_COMPLETED)
  ret.pdfs = await gp(ret.htmls, ad)
  if (errs.length > 0) {
    ret.err = errs.map(err => `req:\n${err.req}\n${''.padStart(80, '-')}\nres:\n${err.res}\n`).join(''.padStart(80, '='))
    ad(ERROR_REPORT_COMPLETED)
  }

  return ret
}