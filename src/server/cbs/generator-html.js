const nd = require('./name-display')
const unpkg = require('./unpkg')

const template = container => `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Test</title>
  <link rel="stylesheet" href="bootstrap.min.css">
</head>

<body>
  <div class="container">
    <h6 class="text-center">DRAFT OF V2.0 CONSUMER CREDIT REPORT SAMPLE (BANK’S VERSION)</h6>
    ${container}
  </div>
</body>

</html>
`

const enquiryDate = '17/05/2018'

const getHead = (enquiryNo, enquiryDate, Reference) => `
<table class="table">
<tbody>
  <tr>
    <td>Enquiry Number</td>
    <td>${enquiryNo}</td>
    <td>Enquiry Date</td>
    <td>${enquiryDate}</td>
  </tr>
  <tr>
    <td>Reference</td>
    <td>${Reference}</td>
    <td></td>
    <td></td>
  </tr>
</tbody>
</table>
`

const getDataProvided = dataProvided => `
<div class="col">
  <h6>Data Provided</h6>
  <table class="table">
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

const kvTempG = (obj, cb, keys) => (keys || Object.keys(obj)).reduce((s, e, i) => s + cb(nd[e], obj[e], i), '')
const getSummary = summary => {
  const c = kvTempG(summary, (name, value) => `<tr><td>${name}</td><td>${value}</td></tr>`)
  return `<div class="col"><h6>Summary</h6><table class="table"><tbody>${c}</tbody></table></div>`
}

const getPS = (dataProvided, summary) => `<div class="row">${getDataProvided(dataProvided)}${getSummary(summary)}</div>`
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
  const c = `<table class="table"><tbody>${p1}${pad}${p2}${pad}${p3}${pad}${p4}</tbody></table>`
  return `<div class="row"><div class="col"><h6>Personal Details</h6>${c}</div><div class="col"></div></div>`
}

const getAI = ais => `<h6>Additional Identification</h6><table class="table">
  <thead><tr><th>${nd.dateLoaded}</th><th>${nd.idType}</th><th>${nd.idNumber}</th></tr></thead>
  <tbody>${ais.map(ai => `<tr><td>${ai.dateLoaded}</td><td>${ai.idType}</td><td>${ai.idNumber}</td></tr>`).join('')}</tbody>
</table>`

const getAn = ans => `<h6>Additional Names</h6>
<table class="table">
<thead>
  <tr>
    <th>${nd.dateLoaded}</th>
    <th>${nd.name}</th>
  </tr>
</thead>
<tbody>${ans.map(an => `<tr><td>${an.dateLoaded}</td><td>${an.name}</td></tr>`).join('')}</tbody>
</table>`

const getEmp = emps => `<h6>Employment</h6>
<table class="table">
<thead>
  <tr>
    <th>${nd.dateLoaded}</th>
    <th>${nd.occupation}</th>
    <th>${nd.employer}</th>
  </tr>
</thead>
<tbody>${emps.map(o => `<tr><td>${o.dateLoaded}</td><td>${o.occupation}</td><td>${o.employer}</td></tr>`).join('')}</tbody>
</table>`

const getTable = (tn, cols, rows) => `<h6>${tn}</h6>
<table class="table">
  <thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
  <tbody>${rows.map(r => '<tr>' + r.map(d => `<td>${d}</td>`).join('') + '</tr>').join('')}</tbody>
</table>
`

const getAsH = hises =>
  getTable(
    'Account Status History',
    [nd.productType, nd.grantorBank, nd.accountType, nd.dateOpenClose, nd.overdueBalance, nd.cf],
    hises.map(his => [
      his.productType,
      his.grantorBank,
      his.accountType,
      his.openedDate + '<br />' + his.closedDate,
      his.overdueBalance,
      his.statusSummary + '<br />' + his.cashAdvance + '<br />' + his.fullPayment,
    ])
  )

const getPe = pes =>
  getTable(
    'Previous Enquiries',
    [nd.date, nd.enquiryType, nd.accountType, nd.productType],
    pes.map(pe => [pe.date, pe.enquiryType, pe.accountType, pe.productType])
  )

const getDr = drs =>
  getTable(
    'Default Records',
    [nd.productType, nd.client, nd.dateLoaded, nd.originalAmt, nd.balance, nd.status, nd.statusDate],
    drs.map(dr => [dr.productType, dr.client, dr.dateLoaded, dr.originalAmt, dr.balance, dr.status, dr.statusDate])
  )

const getBp = bps => `<h6>Bankruptcy Proceedings</h6>
  <table class="table">
    <thead><tr>${[nd.bankruptcyNumber, nd.orderDate, nd.petitionDate, nd.originalOrderDate, nd.gazetteDate].map(c => `<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${bps
      .map(bp => [[bp.bankruptcyNumber, bp.orderDate, bp.petitionDate, bp.originalOrderDate, bp.gazetteDate], bp.orderNature])
      .map(r => '<tr>' + r[0].map(d => `<td>${d}</td>`).join('') + '</tr>' + `<tr><td colspan="${r[0].length}">${r[1]}</td></tr>`)
      .join('')}</tbody>
  </table>
  `
const getDrs = rs =>
  getTable(
    'DRS Records',
    [nd.drsCaseNumber, nd.status, nd.commencementDate, nd.completionDate, nd.failureDate],
    rs.map(r => [r.drsCaseNumber, r.status, r.commencementDate, r.completionDate, r.failureDate])
  )

const kvFormat1 = vars =>
  vars.map(kv => (kv.name == '' ? '' : `<div class="row"><div class="col-4">${kv.name}</div><div class="col">${kv.value}</div></div>`)).join('')
const kvFormat2 = vars => vars.map(kv => `${kv.name}<br />${kv.value}`).join('<br />')
const getBs = rs =>
  rs.source &&
  `
<h6>Bureau Score</h6>
<p>${rs.source.headerText}</p>
${kvFormat1(rs.source.vars)}
<br />
<p>Explanation of Scorecard values</p>
<p>${kvFormat2(rs.explanationOfSource.vars)}</p>
<p>Key Contributing Factors associated with this Rating</p>
${kvFormat1(rs.keyFactor.vars)}
<br />
<p>Explanation of Key Contributing Factors</p>
<p>${kvFormat2(rs.explanationOfKeyFactor.vars)}</p>
`

const getNa = na => `<p>${na}</p>`

const getNar = ns => `<h6>Narratives</h6>
<table class="table">
  <thead><tr>${[nd.dateLoaded, nd.type].map(c => `<th>${c}</th>`).join('')}</tr></thead>
  <tbody>${ns
    .map(n => [[n.dateLoaded, n.typeCode], n.texts.join(' ')])
    .map(r => '<tr>' + r[0].map(d => `<td>${d}</td>`).join('') + '</tr>' + `<tr><td colspan="${r[0].length}">${r[1]}</td></tr>`)
    .join('')}</tbody>
</table>
`

const getDisc = disc => `<h6>Disclaimer</h6><p>${disc}</p>`
const getLrBpPart = bp => `
${kvFormat1(
  ['defendantName', 'courtCode', 'caseNumber', 'dateFiled', 'natureOfClaim', 'status', 'statusDate', 'claimCurrency', 'claimAmount', 'plaintiffNames'].map(
    n => ({ name: nd[n], value: bp[n] })
  )
)}
`
const getLrLwPart = lw => `
${kvFormat1(
  ['defendantName', 'courtCode', 'caseNumber', 'dateFiled', 'natureOfClaim', 'status', 'statusDate', 'claimCurrency', 'claimAmount', 'plaintiffNames'].map(
    n => ({ name: nd[n], value: lw[n] })
  )
)}
`
const getLr = rs => `<h6>Litigation Writ and Bankruptcy Petition Search</h6>
${kvFormat1([{ name: nd.litigationWrits, value: rs.litigationWrits }, { name: nd.bankruptcyPetitions, value: rs.bankruptcyPetitions }])}
<br />
<p>${rs.disclaimer.map(txt => (txt === '' ? '<br />' : txt)).join('')}</p>
${rs.lisReports
  .map(
    r => `

Subject
${kvFormat1([{ name: nd.idType, value: r.idType }, { name: nd.idNumber, value: r.idNumber }])}
<br/>
${r.litigationWrits
      .map(
        lw =>
          getTable('Litigation Writs', [nd.dateLoaded, nd.type, 'Publication'], [lw.dateLoaded, 'Litigation', 'InfoCredit Litigation Information']) +
          getLrLwPart(lw)
      )
      .join('')}
${r.bankruptcyPetitions
      .map(
        bp =>
          getTable('Bankruptcy Petitions', [nd.dateLoaded, nd.type, 'Publication'], [[bp.dateLoaded, 'Litigation', 'InfoCredit Litigation Information']]) +
          getLrBpPart(bp)
      )
      .join('')}
`
  )
  .join('')}
<br />
`

const getAgg = aggs => `
${getTable(
  'Aggregated Outstanding Balances',
  ['Product Group ', ...aggs.map(agg => agg.osbDate)],
  aggs.reduce(
    (s, e) => {
      s[0].push(e.securedBalances)
      s[1].push(e.unsecuredInterestBearingBalances)
      s[2].push(e.unsecuredNonInterestBearingBalances)
      s[3].push(e.exemptedBalances)
      return s
    },
    [[nd.securedBalances], [nd.unsecuredInterestBearingBalances], [nd.unsecuredNonInterestBearingBalances], [nd.exemptedBalances]]
  )
)}
`

module.exports = (reqObj, respStr) =>
  unpkg(respStr)
    .map(item => {
      const enquiryInfo = item.enquiryInfo
      const disclaimer = item.disclaimer
      return item.consumerInfos.map(consumer => {
        const head = getHead(enquiryInfo.enquiryNo, enquiryDate, enquiryInfo.enquiryRef)
        const content =
          head +
          getPS(reqObj, consumer.summary) +
          getPD(consumer.personalDetails) +
          getAI(consumer.additionalIdentifications) +
          getAn(consumer.additionalNames) +
          getEmp(consumer.employments) +
          getAsH(consumer.accountStatusHistory) +
          getPe(consumer.previousEnquiries) +
          getDr(consumer.defaultRecords) +
          getBp(consumer.bankruptcyProceedings) +
          getDrs(consumer.drsRecords) +
          getBs(consumer.source) +
          getNa(consumer.noAdverse) +
          getNar(consumer.narratives) +
          getDisc(disclaimer) +
          '<p class="text-center border border-dark">End Of Report</p>' +
          getLr(consumer.lisRerports) +
          getAgg(consumer.aggosbalances)
        return [`${enquiryInfo.enquiryRef}_${consumer.personalDetails.idNumber}`, template(content)]
      })
    })
    .reduce((s, e) => s.concat(e), [])
