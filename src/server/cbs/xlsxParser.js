const xlsxFieldNames = [
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
  'streetName',
  'stateCityName',
  'countryCode',
  'blkHseBldgNumber',
  'storeyNumber',
  'unitNumber',
  'buildingName'
]

function makeRow(row) {
  return xlsxFieldNames.reduce((s, e, i) => ((s[e] = row[i] ? row[i] + '' : ''), s), {})
}

function makeWorksheet(worksheet) {
  return [worksheet.name, worksheet.data.reduce((s, e) => (e.length === 0 ? s : [...s, { name: e[2], data: makeRow(e) }]), [])]
}

module.exports = worksheets => worksheets.reduce((s, e) => [...s, makeWorksheet(e)], []).filter(r => r[1].length > 0)