const nd = require('./name-display')
const path = require('path')
const fs = require('fs')
// const cssBuf = fs.readFileSync(path.join(__dirname, 'bootstrap.min.css'))
const cssBuf = fs.readFileSync(path.join(__dirname, 'style.css'))

const template = container =>
  `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Credit Bureau (Singapore) Pet Ltd</title>
  <style type="text/css">{css-style}</style>
</head>

<body>
  <div class="container">
    <h6 class="h6-marginB">Credit Bureau (Singapore) Pet Ltd</h6>
    <div class="font-italic">A subsidiary of Infocredit Holdings</div>
    ${container}
  </div>
</body>

</html>
`.replace('{css-style}', cssBuf)

const enquiryDate = '17/05/2018'

const getHead = (enquiryNo, enquiryDate, Reference) => `
<table class="table">
<tbody>
  <tr>
    <td>Enquiry No.:${enquiryNo}</td>
    <td>Client Ref.:${Reference}</td>
    <td>Report Date:${enquiryDate}</td>
  </tr>
</tbody>
</table>
`

const getDataProvided = dataProvided => `
<div class="table-half">
  <h6 class="h6-marginB">Data Provided</h6>
  <table cellspacing="0" class="table">
    <tbody>
      <tr>
        <td>Name</td>
        <td>${dataProvided.customerName}</td>
      </tr>
      <tr>
        <td>ID Type</td>
        <td>${dataProvided.idType}</td>
      </tr>
      <tr>
        <td>ID Number</td>
        <td>${dataProvided.idNumber}</td>
      </tr>
      <tr>
        <td>Date of Birth</td>
        <td>${dataProvided.dateOfBirth}</td>
      </tr>
      <tr>
        <td>Postal Code</td>
        <td>${dataProvided.postalCode}</td>
      </tr>
      <tr>
        <td>Enquiry Type</td>
        <td>${dataProvided.enquiryType}</td>
      </tr>
      <tr>
        <td>Product Type</td>
        <td>${dataProvided.productType}</td>
      </tr>
      <tr>
        <td>Applicant Type</td>
        <td>${dataProvided.applicantType}</td>
      </tr>
    </tbody>
  </table>
</div>
`

const kvTempG = (obj, cb, keys) =>
  (keys || Object.keys(obj)).reduce((s, e, i) => {
    return s + (e.startsWith('__') ? '' : cb(nd[e], obj[e], i))
  }, '')
const getSummary = summary => {
  const c = kvTempG(summary, (name, value) => `<tr><td>${name}</td><td class="text-right">${value}</td></tr>`)
  return `<div class="table-half"><h6 class="h6-marginB">Summary</h6><table cellspacing="0" class="table"><tbody>${c}</tbody></table></div>`
}

const getPS = (dataProvided, summary) => `<div>${getDataProvided(dataProvided)}${getSummary(summary)}</div>`
const getPD = personal => {
  const pad = '<tr><td></td><td></td></tr>'
  const p1 = kvTempG(
    personal,
    (n, v) => {
      return `<tr><td>${n}</td><td>${v}</td></tr>`
    },
    ['surname', 'firstName', 'secondName', 'foreNames', 'unformattedName']
  )
  const p2 = kvTempG(
    personal,
    (n, v) => {
      return `<tr><td>${n}</td><td>${v}</td></tr>`
    },
    ['idType', 'idNumber']
  )
  const p3 = kvTempG(
    personal,
    (n, v) => {
      return `<tr><td>${n}</td><td>${v}</td></tr>`
    },
    ['dateOfBirth', 'gender', 'nationality', 'maritalStatus']
  )

  const p4 = personal.addresses
    .map((addr, i) =>
      kvTempG(
        addr,
        (n, v) => {
          return `<tr><td>${n + ' ' + (i + 1)}</td><td>${v}</td></tr>`
        },
        ['postalCode', 'dateLoaded']
      )
    )
    .join(pad)
  const c = `<table cellspacing="0" class="table"><tbody>${[p1, p2, p3, p4].join('<tr><td></td><td></td></tr>')}</tbody></table>`
  return `<div class="table-half placeholder-half"><div><h6 class="h6-marginB">Personal Details</h6>${c}</div></div>`
}

const getAI = ais => `<h6>Additional Identification</h6><table cellspacing="0" class="table table-three">
  <thead><tr><th>${nd.dateLoaded}</th><th>${nd.idType}</th><th>${nd.idNumber}</th></tr></thead>
  <tbody>${ais.map(ai => `<tr><td>${ai.dateLoaded}</td><td>${ai.idType}</td><td>${ai.idNumber}</td></tr>`).join('')}</tbody>
</table>`

const getAn = ans => `<h6>Additional Names</h6>
<div class="table-half placeholder-half"><table class="table">
<thead>
  <tr>
    <th>${nd.dateLoaded}</th>
    <th>${nd.name}</th>
  </tr>
</thead>
<tbody>${ans.map(an => `<tr><td>${an.dateLoaded}</td><td>${an.name}</td></tr>`).join('')}</tbody>
</table></div>`

const getEmp = emps => `<h6>Employment</h6>
<table cellspacing="0" class="table table-three">
<thead>
  <tr>
    <th>${nd.dateLoaded}</th>
    <th>${nd.occupation}</th>
    <th>${nd.employer}</th>
  </tr>
</thead>
<tbody>${emps.map(o => `<tr><td>${o.dateLoaded}</td><td>${o.occupation}</td><td>${o.employer}</td></tr>`).join('')}</tbody>
</table>`

const getTable = (tn, cols, rows, tableclass = 'table') =>
  `<h6>${tn}</h6>${
    rows.length === 0
      ? '<p>Empty</p>'
      : `<table cellspacing="0" class="${tableclass}">
<thead class="borderTB-th"><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
<tbody>${rows.map(r => '<tr>' + r.map(d => `<td>${d}</td>`).join('') + '</tr>').join('')}</tbody>
</table>`
  }`

const getAsH = hises =>
  getTable(
    'Account Status History',
    [nd.productType, nd.grantorBank, nd.accountType, nd.openedDate, nd.closedDate, nd.overdueBalance, nd.cf],
    hises.map(his => [
      his.productType,
      his.grantorBank,
      his.accountType,
      his.openedDate,
      his.closedDate,
      his.overdueBalance,
      his.statusSummary + '<br />' + his.cashAdvance + '<br />' + his.fullPayment,
    ]),
    'table table-six paddingT-td'
  )

const getPe = pes =>
  getTable(
    'Previous Enquiries',
    [nd.date, nd.enquiryType, nd.productType, nd.accountType],
    pes.map(pe => [pe.date, pe.enquiryType, pe.productType, pe.accountType]),
    'table paddingT-td'
  )

const getDr = drs =>
  getTable(
    'Default Records',
    [nd.productType, nd.client, nd.dateLoaded, nd.originalAmt, nd.balance, nd.status, nd.statusDate],
    drs.map(dr => [dr.productType, dr.client, dr.dateLoaded, dr.originalAmt, dr.balance, dr.status, dr.statusDate]),
    'table table-senven paddingT-td'
  )

const getTableHead = fields => `<thead><tr>${fields.map(f => `<th>${nd[f]}</th>`).join('')}</tr></thead>`

const getBp = bps => {
  const fields = ['bankruptcyNumber', 'orderDate', 'petitionDate', 'originalOrderDate', 'gazetteDate']
  const head = getTableHead(fields)
  const row = r => `<tr>${fields.map(f => `<td>${r[f]}</td>`).join('')}</tr><tr><td colspan="${fields.length}">${r.orderNature}</tr></tr>`
  const body = `<tbody>${bps.map(row).join('')}</tbody>`
  return `<h6>Bankruptcy Proceedings</h6><table cellspacing="0" class="table table-five paddingT-td">${head + body}</table>`
}

const getDrs = rs =>
  getTable(
    'DRS Records',
    [nd.drsCaseNumber, nd.status, nd.commencementDate, nd.completionDate, nd.failureDate],
    rs.map(r => [r.drsCaseNumber, r.status, r.commencementDate, r.completionDate, r.failureDate]),
    'table table-five paiingT-td paging-max'
  )

const kvFormat1 = (vars, classes = 'Aline') =>
  vars
    .map(kv => {
      return kv.name == '' ? '' : `<div class="${classes}"><div>${kv.name}</div><div>${kv.value}</div></div>`
    })
    .join('')
const getBs = rs =>
  rs.source &&
  `
<h6>Bureau Score</h6>
<p>${rs.source.headerText}</p>
${kvFormat1(rs.source.vars)}
<br />
`

const getNa = na => `<p class="none-marginB">${na}</p>`

const getNar = ns => {
  const fields = ['dateLoaded', 'type', 'texts']
  const head = getTableHead(fields)
  const coverNs = ns.map(n => [n.dateLoaded, n.typeCode, n.texts.join('')])
  const row = r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`
  const body = coverNs.map(row)
  return `<h6 class="h6-marginB">Narratives</h6><table class="table table-three">${head + body}</table>`
}
// const getNar = ns => `<h6>Narratives</h6>
// <table class="table">
//   <thead><tr>${[nd.dateLoaded, nd.type, nd.texts].map(c => `<th>${c}</th>`).join('')}</tr></thead>
//   <tbody>${ns
//     .map(n => [[n.dateLoaded, n.typeCode], n.texts.join(' ')])
//     .map(r => '<tr>' + r[0].map(d => `<td>${d}</td>`).join('') + '</tr>')
//     .join('')}</tbody>
// </table>
// `

const getLbsTable = data => {
  const fields = [
    'defendantName',
    'courtCode',
    'caseNumber',
    'dateFiled',
    'natureOfClaim',
    'status',
    'statusDate',
    'claimCurrency',
    'claimAmount',
    'plaintiffNames',
  ]
  const head = `<thead><tr><th>${nd.dateLoaded}</th><th>${data.dateLoaded}</th></tr></thead>`

  const mkr = (k, v) => `<tr><td>${k}</td><td>${v}</td></tr>`
  return `<table cellspacing="0" class="table none-paddingB-th paddingT-th">${head + fields.map(f => mkr(nd[f], data[f])).join('')}</table>`
}

const getLbs = rs => {
  const lbCount = kvFormat1([{ name: nd.litigationWrits, value: rs.litigationWrits }, { name: nd.bankruptcyPetitions, value: rs.bankruptcyPetitions }])
  const subjectKv = r => kvFormat1([{ name: nd.idType, value: r.idType }, { name: nd.idNumber, value: r.idNumber }], 'line-text lineW')
  const lwAndBpKv = r => r.litigationWrits.map(getLbsTable).join('') + r.bankruptcyPetitions.map(getLbsTable).join('')
  const reports = rs.lisReports.map(r => `<P class="none-marginB">Subject</P>${subjectKv(r)}<br />${lwAndBpKv(r)}`).join('')
  return `<h6 class="h6-marginB">Litigation Writ and Bankruptcy Petition Search</h6>${lbCount}<br />${reports}<br />`
}

const getAgg = aggs =>
  getTable(
    'Aggregated Outstanding Balances',
    ['Date', nd.securedBalances, nd.unsecuredInterestBearingBalances, nd.unsecuredNonInterestBearingBalances, nd.exemptedBalances],
    aggs.map(agg => [agg.osbDate, agg.securedBalances, agg.unsecuredInterestBearingBalances, agg.unsecuredNonInterestBearingBalances, agg.exemptedBalances]),
    'table table-five text-center paddingT-td'
  )

module.exports = (reqObj, resObj) =>
  resObj
    .map(item => {
      const enquiryInfo = item.enquiryInfo
      return item.consumerInfos.map(consumer => {
        const head = getHead(enquiryInfo.enquiryNo, enquiryDate, enquiryInfo.enquiryRef)
        const content =
          head +
          getPS(reqObj, consumer.summary) +
          getPD(consumer.personalDetails) +
          getAn(consumer.additionalNames) +
          getEmp(consumer.employments) +
          getAsH(consumer.accountStatusHistory) +
          getPe(consumer.previousEnquiries) +
          getDr(consumer.defaultRecords) +
          getBp(consumer.bankruptcyProceedings) +
          getDrs(consumer.drsRecords) +
          getNa(consumer.noAdverse) +
          getBs(consumer.source) +
          getNar(consumer.narratives) +
          getLbs(consumer.lisRerports) +
          getAI(consumer.additionalIdentifications) +
          getAgg(consumer.aggosbalances) +
          '<p class="text-center border border-dark">End Of Report</p>'
        return [`${enquiryInfo.enquiryRef}_${consumer.personalDetails.idNumber}`, template(content)]
      })
    })
    .reduce((s, e) => s.concat(e), [])
