const xlsxFieldNames = [
  'accountType',
  'amount',
  'currency',
  'enquiryReference',
  'enquiryType',
  'productType',
  'idType',
  'idNo',
  'customerName',
  'yearOfBirth',
  'monthOfBirth',
  'dayOfBirth',
  'gender',
  'maritalStatus',
  'applicantType',
  'addressType',
  'addressFormat',
  'postalCode',
]

const reqXml = `<?xml version="1.0" encoding="utf-8"?>
<REQUEST>
  <SERVICE>ENQLITSC</SERVICE>
  <ACTION>A</ACTION>
  <MESSAGE>
    <HEADER>
      <CLIENT_ID>{clientId}</CLIENT_ID>
      <USER_ID>{userId}</USER_ID>
      <VERSION_NO>2.0</VERSION_NO>
      <RUN_NO>{runNo}</RUN_NO>
      <TOT_ITEMS>1</TOT_ITEMS>
    </HEADER>
    <ENQUIRY>
      <ENQUIRY_TYPE>{enquiryType}</ENQUIRY_TYPE>
      <ENQUIRY_REFERENCE>{enquiryReference}</ENQUIRY_REFERENCE>
      <PRODUCT_TYPE>{productType}</PRODUCT_TYPE>
      <ACCOUNT_TYPE>{accountType}</ACCOUNT_TYPE>
      <AMOUNT>{amount}</AMOUNT>
      <CURRENCY>{currency}</CURRENCY>
      <NO_OF_APPLICANTS>1</NO_OF_APPLICANTS>
      <APPLICANT>
        <CTYP>{applicantType}</CTYP>
        <CONSUMER>
          <CID>
            <CID1>{idType}</CID1>
            <CID2>{idNo}</CID2>
          </CID>
          <CNAM>
            <CNMU>{customerName}</CNMU>
          </CNAM>
          <CDOB>
            <DBY>{yearOfBirth}</DBY>
            <DBM>{monthOfBirth}</DBM>
            <DBD>{dayOfBirth}</DBD>
          </CDOB>
          <CGND>{gender}</CGND>
          <CADR>
            <CADF>{addressFormat}</CADF>
            <CADT>{addressType}</CADT>
            <CAD7>{postalCode}</CAD7>
          </CADR>
          <CMAR>{maritalStatus}</CMAR>
        </CONSUMER>
      </APPLICANT>
    </ENQUIRY>
  </MESSAGE>
</REQUEST>`

function makeRowPkg(row) {
  const ddmmyyyy = row[8].toString()
  const ymd = [ddmmyyyy.slice(4), ddmmyyyy.slice(2, 4), ddmmyyyy.slice(0, 2)]
  const amtAndCurrency = row[1]
  const amt = amtAndCurrency.replace(/^0*/, '')
  const ac = [amt.slice(0, amt.length - 3), amtAndCurrency.slice(amtAndCurrency.length - 3, amtAndCurrency.length)]
  const as = [].concat(row.slice(0, 1), ac, row.slice(2, 8), ymd, row.slice(9))
  // console.log(as)
  return xlsxFieldNames.reduce((s, e, i) => s.replace(`{${e}}`, as[i]), reqXml)
}

function makeWorksheetPkg(worksheet) {
  // console.log(worksheet.name, worksheet.data.reduce)
  return [worksheet.name, worksheet.data.reduce((s, e) => (e.length === 0 ? s : [...s, makeRowPkg(e)]), [])]
}

// module.exports = {
//   pkg(buffer) {
//     return xlsx.parse(buffer).reduce((s, e) => [...s, makeWorksheetPkg(e)], [])
//   },
// }

module.exports = worksheets => worksheets.reduce((s, e) => [...s, makeWorksheetPkg(e)], []).filter(r => r[1].length > 0)
