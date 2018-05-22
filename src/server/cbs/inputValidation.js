const cc = require('currency-codes')

const productTypes = [
  'BL',
  'CC',
  'CM',
  'DC',
  'HD',
  'MT',
  'MV',
  'OD',
  'OT',
  'PC',
  'PL',
  'PO',
  'PP',
  'PR',
  'RE',
  'RL',
  'RM',
  'RS',
  'RV',
  'SC',
  'SF',
  'SL',
  'SO',
  'SP',
  'SR',
  'UC',
  'UO',
  'UP',
]

const enquiryTypes = ['NA', 'RV', 'GT', 'CE', 'B0', 'B1', 'B2']

const idTypes = ['EMPL', 'NRIC', 'PASS', 'UNKN', 'WORK']

const addressTypesOfConsumer = ['RESID', 'WORK', 'POST', 'U']

const addressFormats = ['SL', 'UL', 'UP', 'P', 'SF', 'UF', 'NS']

const mergeTypes = types => '[' + types.join(', ') + ']'

const amountCheck = str => {
  const match = /^(\d{1,15}|\d{0,15}\.\d{0,2})([A-Z]{3})$/.exec(str)
  return match
    ? cc.codes().includes(match[2])
      ? null
      : 'Currency Code not exist in ISO 4217'
    : 'Amount must be real type (15,2) and Currency Code must be 3 uppper char'
}

const idNumberCheck = (idType, str) =>
  idType !== 'NRIC'
    ? /^.{1,20}$/.test(str)
      ? null
      : 'The ID Number must be 1-20 char'
    : /^[STFG]\d{7}[A-Z]$/.test(str)
      ? null
      : 'The ID Number does not comply with NRIC specification'

const dateOfBirthCheck = str => {
  const reg = /^(\d{2})(\d{2})(\d{4})$/
  const match = reg.exec(str)
  if (match) {
    const dd = parseInt(match[1])
    const mm = parseInt(match[2])
    const yyyy = parseInt(match[3])

    if (dd < 1 || dd > 31) {
      return 'Day must be >= 1 and <= 31'
    }

    if (mm < 1 || mm > 12) {
      return 'Month must be >= 1 and <= 12'
    }

    if (yyyy < 1890 || yyyy > new Date().getFullYear() - 10) {
      return 'Year must be >= 1890 and < (current year – 10) '
    }

    return null
  } else {
    return 'Date of birth, this fromation must be DDMMYYYY'
  }
}

const fieldValidationInfos = [
  ['accountType', str => (/^[JS]$/.test(str) ? null : 'Account Type must be J or S')],
  ['amount', amountCheck],
  ['enquiryReference', str => (/^.{1,50}$/.test(str) ? null : 'Enquiry Ref must be 1-50 char')],
  ['enquiryType', str => (enquiryTypes.includes(str) ? null : `Enquiry Type must be in ${mergeTypes(enquiryTypes)}`)],
  ['productType', str => (productTypes.includes(str) ? null : `Product Type must be in ${mergeTypes(productTypes)}`)],
  ['idType', str => (idTypes.includes(str) ? null : `ID Type must be in ${mergeTypes(idTypes)}`)],
  ['idNumber', idNumberCheck], // TODO: 特殊
  ['customerName', str => (/^.{1,50}$/.test(str) ? null : 'Customer Name must be 1-50 char')],
  ['dateOfBirth', dateOfBirthCheck],
  ['gender', str => (/^[MFU]$/.test(str) ? null : 'The gender must be in [M, F, U]')],
  ['maritalStatus', str => (/^[DMPSUW]$/.test(str) ? null : 'Marital Status must be in [D, M, P, S, U, W]')],
  ['applicantType', str => (/^[GJPS]$/.test(str) ? null : 'Marital Status must be in [G, J, P, S]')],
  ['addressType', str => (addressTypesOfConsumer.includes(str) ? null : `Address Type must be in ${mergeTypes(addressTypesOfConsumer)}`)],
  ['addressFormat', str => (addressFormats.includes(str) ? null : `Address Format must be in ${mergeTypes(addressFormats)}`)],
  ['postalCode', str => (/^.{1,9}$/.test(str) ? null : 'Postal Code must be 1-9 char')],
]

const xlsxRowGenericValidate = row => {
  if (row.length < 14 && row.length != 0) {
    return [`column count actual: ${row.length}, but expect: count of column of data row must be (>= 14 or == 0)`]
  }
  return []
}

const xlsxRowValidate = row => {
  let idType

  if (row.length === 0) return ''

  const genericV = xlsxRowGenericValidate(row)

  if (genericV.length > 0) return genericV

  return fieldValidationInfos.reduce((s, e, i) => {
    let f = e[1]
    if (e[0] === 'idType') {
      idType = row[i]
    }

    if (e[0] === 'idNumber') {
      f = str => e[1](idType, str)
    }
    const err = f(row[i])
    if (err !== null) {
      s.push(`column: ${String.fromCharCode('A'.charCodeAt(0) + i)} actual: ${row[i]}, but expect:${err}`)
    }
    return s
  }, [])
}

const xlsxWorksheetValidate = data => {
  return data.reduce((s, e, i) => {
    const errs = xlsxRowValidate(e)
    if (errs.length > 0) {
      s.push(['row ' + (i + 1), errs])
    }
    return s
  }, [])
}

const xlsxFileValidate = workSheetsFromBuffer => {
  return workSheetsFromBuffer.reduce((s, e) => {
    const errs = xlsxWorksheetValidate(e.data)
    if (errs.length > 0) {
      s.push(['worksheet: ' + e.name, errs])
    }
    return s
  }, [])
}

function formatEle(ele, prefix) {
  if (Array.isArray(ele)) {
    return prefix + ele[0] + '\n' + formatMsg(ele[1], prefix + '\t')
  }

  return prefix + ele + '\n'
}
function formatMsg(errs, prefix = '') {
  return errs.reduce((s, e) => s + formatEle(e, prefix), '')
}
const validate = buffer => {
  const errs = xlsxFileValidate(buffer)
  return formatMsg(errs)
}

module.exports = validate
