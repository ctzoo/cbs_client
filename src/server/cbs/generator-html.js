const nd = require('./name-display')
const path = require('path')
const fs = require('fs')
// const cssBuf = fs.readFileSync(path.join(__dirname, 'bootstrap.min.css'))
const cssBuf = fs.readFileSync(path.join(__dirname, 'style.css'))

const template = (head, container) =>
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
  <div id="pageHeader">
    ${head}
  </div>
  <div class="container" id="pageContent">
    ${container}
  </div>
</body>

</html>
`.replace('{css-style}', cssBuf)

const time = new Date()
const month = time.getMonth() + 1
const enquiryDate = time.getFullYear() + '-' + month + '-' + time.getDate()

const getHead = (enquiryNo, enquiryDate, Reference) => `
<div style="text-align: left;  font-family: Verdana; font-size: 10.5pt;">
  Gredit Bureau（Singapore）Pte Ltd<br/>
  <i style="font-size: 6.5pt">A subdidiary Infocredit Holdings</i>
  <div style="width: 100%; font-size: 7.5pt; padding-top: 6px">
    <span style="display: inline-block; width: 32%">Enquiry No.:${enquiryNo}</span>
    <span style="display: inline-block; width: 32%">Client Ref.:${Reference}</span>
    <span style="display: inline-block; width: 32%">Report Date:${enquiryDate}</span>
  </div>
</div>
`

const getDataProvided = dataProvided => `
<div class="table-half">
  <h6 class="h6-marginB">Data Provided</h6>
  <table cellspacing="0" class="table">
    <tbody>
      <tr>
        <td class="marginT font-B">Name</td>
        <td class="marginT-H">${dataProvided.customerName}</td>
      </tr>
      <tr>
        <td class="font-B">ID Type</td>
        <td>${dataProvided.idType}</td>
      </tr>
      <tr>
        <td class="font-B">ID Number</td>
        <td>${dataProvided.idNumber}</td>
      </tr>
      <tr>
        <td class="font-B">Date of Birth</td>
        <td>${dataProvided.dateOfBirth}</td>
      </tr>
      <tr>
        <td class="font-B">Postal Code</td>
        <td>${dataProvided.postalCode}</td>
      </tr>
      <tr>
        <td class="font-B">Enquiry Type</td>
        <td>${dataProvided.enquiryType}</td>
      </tr>
      <tr>
        <td class="font-B">Product Type</td>
        <td>${dataProvided.productType}</td>
      </tr>
      <tr>
        <td class="font-B">Applicant Type</td>
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
  const c = kvTempG(summary, (name, value) => `<tr><td class="font-B">${name}</td><td class="text-right">${value}</td></tr>`)
  return `<div class="table-half"><h6 class="h6-marginB">Summary</h6><table cellspacing="0" class="table"><tbody>${c}</tbody></table></div>`
}

const getPS = (dataProvided, summary) => `<div>${getDataProvided(dataProvided)}${getSummary(summary)}</div>`
const getPD = personal => {
  const p1 = kvTempG(
    personal,
    (n, v) => {
      return `<tr><td class="font-B">${n}</td><td>${v}</td></tr>`
    },
    ['surname', 'firstName', 'secondName', 'foreNames', 'unformattedName']
  )
  const p2 = kvTempG(
    personal,
    (n, v) => {
      return `<tr><td class="font-B">${n}</td><td>${v}</td></tr>`
    },
    ['idType', 'idNumber']
  )
  const p3 = kvTempG(
    personal,
    (n, v) => {
      return `<tr><td class="font-B">${n}</td><td>${v}</td></tr>`
    },
    ['dateOfBirth', 'gender', 'nationality', 'maritalStatus']
  )

  const p4 = personal.addresses
    .map((addr, i) => `<tr><td>${(i + 1) + ')  ' + addr.postalCode}</td><td>${addr.dateLoaded}</td></tr>`)
    .join('')

  const ctb = `<tbody>${p1}</tbody><tbody class="position-right-up">${p2}</tbody><tbody class="position-right-down">${p3}</tbody>`
  const c = `<table cellspacing="0" class="table Line-height-max">${ctb}</table>`
  const pc = `<p class="cycle-table-title"><b>Postal Code</b></p><table cellspacing="0" class="cycle-table"><tbody>${p4}</tbody></table>`
  return `<div class="table-half placeholder-half"><div><h6 class="h6-marginB">Personal Details</h6>${c}${pc}</div></div>`
}

const getTable = (tn, cols, rows, tableclass = 'table') =>
  `<h6>${tn}</h6>${
    rows.length === 0
      ? '<p>Empty</p>'
      : `<table cellspacing="0" class="${tableclass}">
<thead class="borderTB-th"><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
<tbody>${rows.map(r => '<tr>' + r.map(d => `<td>${d}</td>`).join('') + '</tr>').join('')}</tbody>
</table>`
  }`

const getAI = ais => 
  getTable(
    'Additional Identification',
    [nd.dateLoaded, nd.idType, nd.idNumber],
    ais.map(ai => [
      ai.dateLoaded,
      ai.idType,
      ai.idNumber
    ]),
    'table table-three'
  )

const getAn = ans => 
  getTable(
    'Additional Names',
    [nd.dateLoaded, nd.name],
    ans.map(an => [
      an.dateLoaded,
      an.name,
    ]),
    'table table-six paddingT-td'
  )

const getEmp = emps => 
  getTable(
    'Additional Names',
    [nd.dateLoaded, nd.occupation, nd.employer],
    emps.map(o => [
      o.dateLoaded,
      o.occupation,
      o.employer,
    ]),
    'table table-three'
  )

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

const getBp = bps =>
  getTable(
    'Bankruptcy Proceedings',
    [nd.bankruptcyNumber, nd.orderDate, nd.petitionDate, nd.originalOrderDate, nd.gazetteDate],
    bps.map(dr => [dr.bankruptcyNumber, dr.orderDate, dr.petitionDate, dr.originalOrderDate, dr.gazetteDate]),
    'table table-senven paddingT-td'
  )

const getDrs = rs =>
  getTable(
    'DRS Records',
    [nd.drsCaseNumber, nd.status, nd.commencementDate, nd.completionDate, nd.failureDate],
    rs.map(r => [r.drsCaseNumber, r.status, r.commencementDate, r.completionDate, r.failureDate]),
    'table table-five paiingT-td paging-max'
  )

const kvTable = (vars, classes = 'table') =>
  `<table cellspacing="0" class="${classes}">
    <tbody>${vars.map(kv => `<tr><td class="no-border-right">${kv.name}</td><td>${kv.value}</td></tr>`).join('')}</tbody>
  </table>`

const getBs = rs => rs.source && `
<h6>Bureau Score</h6>
 <p>${rs.source.headerText}</p>
 ${kvTable(rs.source.vars, 'table Bureau-table')}
<br />`

const getNa = na => `<p class="none-marginB">${na}</p>`

const getNar = ns => {
  const fields = ['dateLoaded', 'type', 'texts']
  const head = getTableHead(fields)
  const coverNs = ns.map(n => [n.dateLoaded, n.typeCode, n.texts.join('')])
  const row = r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`
  const body = coverNs.map(row)
  const table = ns.length === 0 ? '<p>Empty</p>' : `<table class="table table-three">${head + body}</table>`
  return `<h6 class="h6-marginB">Narratives</h6>${table}`
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

  const head = `<div><span class="Subject-left Subject-marginB">${nd.dateLoaded}</span>` +
    `<span class="Subject-right Subject-marginB">${data.dateLoaded}</span></div>`

  const mkr = (k, v) => `<div><span class="Subject-left">${k}</span><span class="Subject-right">${v}</span></div>`
  return `<div class="Subject-content-box">${head + fields.map(f => mkr(nd[f], data[f])).join('')}</div>`
}

const kvFormat1 = (vars, classes = 'Aline') =>
  vars
    .map(kv => {
      return kv.name == '' ? '' : `<div class="${classes}"><div>${kv.name}</div><div>${kv.value}</div></div>`
    })
    .join('')

const getLbs = rs => {
  const lbCount = kvFormat1([{ name: nd.litigationWrits, value: rs.litigationWrits }, { name: nd.bankruptcyPetitions, value: rs.bankruptcyPetitions }])
  const subjectKv = r => kvFormat1([{ name: nd.idType, value: r.idType }, { name: nd.idNumber, value: r.idNumber }])
  const lwKv = r => rs.litigationWrits !== '0' ? 
    `<P class="none-marginB Subject-title">Litigation Writs</P>${r.litigationWrits.map(getLbsTable).join('')}<br/>` : ''
  const bpKv = r => rs.bankruptcyPetitions !== '0' ? 
    `<P class="none-marginB Subject-title">Bankruptcy Petitions</P>${r.bankruptcyPetitions.map(getLbsTable).join('')}<br/>` : ''
  const reports = rs.lisReports.map(r => `<P class="none-marginB Subject-content">Subject</P>${subjectKv(r)}<br />${lwKv(r)}${bpKv(r)}`).join('')
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
          '<p class="text-center margin-max">End Of Report</p>'
        return [`${enquiryInfo.enquiryRef}_${consumer.personalDetails.idNumber}`, template(head, content)]
      })
    })
    .reduce((s, e) => s.concat(e), [])
