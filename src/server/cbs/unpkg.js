const xpath = require('xpath')
const DOMParser = require('xmldom').DOMParser
const dic = require('./dic')
const logger = require('../logger')('unpack')

const gvd = (node, d = '') => (node ? node.textContent.trim() : d)
const getText = (xpathStr, node) => gvd(xpath.select1(xpathStr, node))

const getObjectText = (fields, node) => {
  const keys = Object.keys(fields).filter(key => key !== '_path' && key !== '_as')
  const p = fields._path
  const _go = n => {
    if (keys.length === 0) {
      return getText('.', n)
    } else {
      return keys.reduce((s, e) => {
        const d = fields[e]
        if (typeof d === 'string') {
          s[e] = getText(fields[e], n)
          return s
        } else if (Array.isArray(d)) {
          const paths = d.slice(0, d.length - 1)
          const fn = d[d.length - 1]
          if (typeof fn == 'function') {
            s[e] = fn(paths.map(p => (typeof p === 'string' ? getText(p, n) : getObjectText(p, n))))
          } else {
            const v = getText(paths[0], n)
            s[e] = fn[v] || v
          }
          return s
        } else {
          s[e] = getObjectText(fields[e], n)
          return s
        }
      }, {})
    }
  }

  if (fields._as) {
    const ns = xpath.select(p, node)
    return ns.map(_go)
  } else {
    const n = xpath.select1(fields._path, node)
    if (n) {
      return _go(n)
    } else {
      return null
    }
  }
}

const formatDate = as => (as[0] == '' ? '' : as.join('/'))

const getSummary = consumer => {
  const fields = {
    _path: 'SUMMARY',
    dateOfEarliestKnownCreditAccount: [
      {
        _path: '../ACCOUNTS/ACCOUNT',
        _as: true,
        y: 'ACC_OPENED_DATE/ACC_OPENED_YEAR',
        m: 'ACC_OPENED_DATE/ACC_OPENED_MONTH',
        d: 'ACC_OPENED_DATE/ACC_OPENED_DAY',
      },
      as => {
        const minx = as[0]
          .map(ymd => ({ y: ymd.y, m: ymd.m.padStart(2, '0'), d: ymd.d.padStart(2, '0') }))
          .sort((a, b) => (a.y + a.m + a.d > b.y + b.m + b.d ? 1 : -1))[0]
        return minx.d + '/' + minx.m + '/' + minx.y
      },
    ],
    previousEnquiries: 'ENQUIRY_COUNT',
    accounts: 'ACCOUNT_COUNT',
    defaults: 'BAD_DEBT_COUNT',
    bankruptcyProceedings: 'BANKRUPTCY_COUNT',
    noticeCount: 'NOTICE_COUNT',
    securedCreditLimit: ['SECURED_CRL', as => as[0] || '0.00'],
    unsecuredCreditLimit: ['UNSECURED_CRL', as => as[0] || '0.00'],
    exemptedCreditLimit: ['EXEMPT_CRL', as => as[0] || '0.00'],
    debtManagementProgramme: 'DEBT_MGMT_FLAG',
    creditFileAge: ['CRD_FILE_AGE/CFRD', 'CRD_FILE_AGE/CFRM', 'CRD_FILE_AGE/CFRY', formatDate],
    idTheft: 'ID_THEFT_FLAG',
    _12_BTI: 'BTI_12X_FLAG',
  }

  return getObjectText(fields, consumer)
}

const getPersonalDetails = consumer => {
  const fields = {
    _path: '.',
    surname: 'PRIMARY_NAME/PRI_SURNAME',
    firstName: 'PRIMARY_NAME/PRI_FIRST_NAME',
    secondName: 'PRIMARY_NAME/PRI_SECOND_NAME',
    foreNames: 'PRIMARY_NAME/PRI_FORENAMES',
    unformattedName: 'PRIMARY_NAME/PRI_UNFORMATTED',
    idType: ['PRIMARY_ID/PRI_ID_TYPE', dic.idType],
    idNumber: 'PRIMARY_ID/PRI_ID_CODE',
    dateOfBirth: ['DATE_OF_BIRTH/DOB_DAY', 'DATE_OF_BIRTH/DOB_MONTH', 'DATE_OF_BIRTH/DOB_YEAR', formatDate],
    gender: ['GENDER_CODE', dic.gender],
    nationality: 'NATIONALITY_CODE',
    maritalStatus: ['MARITAL_CODE', dic.maritalStatus],
    addresses: {
      _path: 'ADDRESSES/RSP_ADDRESS',
      _as: true,
      postalCode: 'ADR_POST_CODE',
      dateLoaded: ['ADR_LOAD_DATE/ADR_LOAD_DAY', 'ADR_LOAD_DATE/ADR_LOAD_MONTH', 'ADR_LOAD_DATE/ADR_LOAD_YEAR', formatDate],
    },
  }
  return getObjectText(fields, consumer)
}

const getAdditionalIdentifications = consumer => {
  const fields = {
    _path: 'ADDITIONAL_IDS/ADDITIONAL_ID',
    _as: true,
    dateLoaded: ['AID_LOAD_DATE/AID_LOAD_DAY', 'AID_LOAD_DATE/AID_LOAD_MONTH', 'AID_LOAD_DATE/AID_LOAD_YEAR', formatDate],
    idType: ['AID_ID_TYPE_CODE', dic.idType],
    idNumber: 'AID_ID_CODE',
  }
  return getObjectText(fields, consumer)
}

const getAdditionalNames = consumer => {
  const fields = {
    _path: 'ADDITIONAL_NAMES/ADDITIONAL_NAME',
    _as: true,
    dateLoaded: ['ANM_LOAD_DATE/ANM_LOAD_DAY', 'ANM_LOAD_DATE/ANM_LOAD_MONTH', 'ANM_LOAD_DATE/ANM_LOAD_YEAR', formatDate],
    name: [
      'ANM_UNFORMATTED',
      'ANM_FORMATTED/ANM_SURNAME',
      'ANM_FORMATTED/ANM_FIRST_NAME',
      'ANM_FORMATTED/ANM_SECOND_NAME',
      as => {
        if (as[0] !== '') {
          return as[0]
        } else {
          return as.slice(1).reduce((s, e) => (e === '' ? s : s + ' ' + e))
        }
      },
    ],
  }
  return getObjectText(fields, consumer)
}

const getEmployments = consumer => {
  const fields = {
    _path: 'OCCUPATIONS/OCCUPATION',
    _as: true,
    dateLoaded: ['OCC_LOAD_DATE/OCC_LOAD_DAY', 'OCC_LOAD_DATE/OCC_LOAD_MONTH', 'OCC_LOAD_DATE/OCC_LOAD_YEAR', formatDate],
    occupation: 'OCC_OCCUPATION',
    employer: 'OCC_EMPLOYER',
  }

  return getObjectText(fields, consumer)
}

const getAccountInfos = consumer => {
  const fields = {
    _path: 'ACCOUNTS/ACCOUNT',
    _as: true,
    productType: ['ACC_PRODUCT_TYPE', dic.productType],
    grantorBank: 'ACC_BANK_NAME',
    accountType: ['ACC_TYPE_CODE', dic.accountType],
    openedDate: ['ACC_OPENED_DATE/ACC_OPENED_DAY', 'ACC_OPENED_DATE/ACC_OPENED_MONTH', 'ACC_OPENED_DATE/ACC_OPENED_YEAR', formatDate],
    closedDate: ['ACC_CLOSED_DATE/ACC_CLOSED_DAY', 'ACC_CLOSED_DATE/ACC_CLOSED_MONTH', 'ACC_CLOSED_DATE/ACC_CLOSED_YEAR', formatDate],
    overdueBalance: 'ACC_OVERDUE_BALANCE',
    statusSummary: 'ACC_STATUS_SUMMARY',
    cashAdvance: 'ACC_CASH_ADVANCE_SUMMARY',
    fullPayment: 'ACC_FULL_PAYMENT_SUMMARY',
  }
  return getObjectText(fields, consumer)
}

const getPreviousEnquiries = consumer => {
  const fields = {
    _path: 'PREVIOUS_ENQUIRIES/PREVIOUS_ENQUIRY',
    _as: true,
    date: ['IPI_LOAD_DATE/IPI_LOAD_DAY', 'IPI_LOAD_DATE/IPI_LOAD_MONTH', 'IPI_LOAD_DATE/IPI_LOAD_YEAR', formatDate],
    enquiryType: ['IPI_ENQUIRY_TYPE', dic.enquiryType],
    accountType: ['IPI_ACCOUNT_TYPE', dic.accountType],
    productType: ['IPI_PRODUCT_TYPE', dic.productType],
  }
  return getObjectText(fields, consumer)
}

const getDefaultRecords = consumer => {
  const fields = {
    _path: 'BAD_DEBTS/BAD_DEBT',
    _as: true,
    productType: ['BD_PRODUCT_TYPE', dic.productType],
    client: 'BD_BANK_NAME',
    dateLoaded: ['BD_LOAD_DATE/BD_LOAD_DAY', 'BD_LOAD_DATE/BD_LOAD_MONTH', 'BD_LOAD_DATE/BD_LOAD_YEAR', formatDate],
    originalAmt: 'BD_AMOUNT',
    balance: 'BD_LBAL',
    status: ['BD_STS', dic.defaultStatus],
    statusDate: ['BD_STATUS_DATE/BD_STATUS_DAY', 'BD_STATUS_DATE/BD_STATUS_MONTH', 'BD_STATUS_DATE/BD_STATUS_YEAR', formatDate],
  }
  return getObjectText(fields, consumer)
}

const getBankruptcyProceedings = consumer => {
  const fields = {
    _path: 'BANKRUPTCY_RECORDS/BANKRUPTCY_RECORD',
    _as: true,
    bankruptcyNumber: 'BR_NUMBER',
    orderDate: ['BR_ORDER_DATE/BR_ORDER_DAY', 'BR_ORDER_DATE/BR_ORDER_MONTH', 'BR_ORDER_DATE/BR_ORDER_YEAR', formatDate],
    petitionDate: ['BR_PETITION_DATE/BR_PETITION_DAY', 'BR_PETITION_DATE/BR_PETITION_MONTH', 'BR_PETITION_DATE/BR_PETITION_YEAR', formatDate],
    originalOrderDate: ['BR_ORIG_ORDER_DATE/BR_ORIG_ORDER_DAY', 'BR_ORIG_ORDER_DATE/BR_ORIG_ORDER_MONTH', 'BR_ORIG_ORDER_DATE/BR_ORIG_ORDER_YEAR', formatDate],
    gazetteDate: ['BR_GAZ_DATE/BR_GAZ_DAY', 'BR_GAZ_DATE/BR_GAZ_MONTH', 'BR_GAZ_DATE/BR_GAZ_YEAR', formatDate],
    orderNature: 'BR_ORDER_NATURE',
  }
  return getObjectText(fields, consumer)
}

const getDrsRecords = consumer => {
  const fields = {
    _path: 'DRS_RECORDS/DRS_RECORD',
    _as: true,
    drsCaseNumber: 'DRS_CASE_NUMBER',
    status: ['DRS_STATUS_CODE', dic.drsStatus],
    commencementDate: ['DRS_COMMENC_DATE/DRS_COMMENC_DAY', 'DRS_COMMENC_DATE/DRS_COMMENC_MONTH', 'DRS_COMMENC_DATE/DRS_COMMENC_YEAR', formatDate],
    completionDate: [
      'DRS_COMPLETION_DATE/DRS_COMPLETION_DAY',
      'DRS_COMPLETION_DATE/DRS_COMPLETION_MONTH',
      'DRS_COMPLETION_DATE/DRS_COMPLETION_YEAR',
      formatDate,
    ],
    failureDate: ['DRS_FAILURE_DATE/DRS_FAILURE_DAY', 'DRS_FAILURE_DATE/DRS_FAILURE_MONTH', 'DRS_FAILURE_DATE/DRS_FAILURE_YEAR', formatDate],
  }
  return getObjectText(fields, consumer)
}

const getSource = consumer => {
  const sourceNode = xpath.select1('SCORE', consumer)
  const fields = {
    _path: '.',
    source: {
      _path: '.',
      headerText: 'SC_HEADER/SC_HEADER_TEXT',
      vars: {
        _path: 'SC_VARIABLES/SC_VARIABLE',
        _as: true,
        name: 'SC_VAR_NAME',
        value: 'SC_VAR_VALUE',
      },
    },
    explanationOfSource: {
      _path: '.',
      vars: {
        _path: 'SC_EXPLANATION_OF_VARIABLES/SC_EXPLANATION_OF_VARIABLE',
        _as: true,
        name: 'SC_EXP_OF_VAR_NAME',
        value: 'SC_EXP_OF_VAR_VALUE',
      },
    },
    keyFactor: {
      _path: '.',
      vars: {
        _path: 'SC_KEY_FACTORS/SC_KEY_FACTOR',
        _as: true,
        name: 'SC_KEY_FACTOR_NAME',
        value: 'SC_KEY_FACTOR_VALUE',
      },
    },
    explanationOfKeyFactor: {
      _path: '.',
      vars: {
        _path: 'SC_EXPLANATION_OF_KEY_FACTORS/SC_EXPLANATION_OF_KEY_FACTOR',
        _as: true,
        name: 'SC_EXP_OF_KEY_FACTOR_NAME',
        value: 'SC_EXP_OF_KEY_FACTOR_VALUE',
      },
    },
  }
  return sourceNode ? getObjectText(fields, sourceNode) : ''
}

const getNarratives = consumer => {
  const fields = {
    _path: '.',
    typeCode: ['NAR_TYPE_CODE', dic.narrativeType],
    dateLoaded: ['NAR_LOAD_DATE/NAR_LOAD_DAY', 'NAR_LOAD_DATE/NAR_LOAD_MONTH', 'NAR_LOAD_DATE/NAR_LOAD_YEAR', formatDate],
    texts: {
      _path: 'NAR_TEXT/NAR_LINE',
      _as: true,
    },
  }
  return xpath.select('NARRATIVES/NARRATIVE', consumer).map(narrative => getObjectText(fields, narrative))
}

const getLisReports = consumer => {
  const fields = {
    _path: '.',
    litigationWrits: ['LIS_REPORTS/WRIT_COUNT', as => as.reduce((s, e) => s + (e == '' ? 0 : parseInt(e)), '')],
    bankruptcyPetitions: ['LIS_REPORTS/BANKRUPTCY_PETITION_COUNT', as => as.reduce((s, e) => s + (e == '' ? 0 : parseInt(e)), '')],
    disclaimer: { _path: 'LIS_REPORTS/LIS_DISCLAIMER/LIS_DISCLAIMER_TEXT/LIS_DISCLAIMER_TEXT_LINE', _as: true },
    lisReports: {
      _path: 'LIS_REPORTS/LIS_REPORT',
      _as: true,
      idType: ['SUBJECT_IDTYPE', dic.idType],
      idNumber: 'SUBJECT_IDNO',
      litigationWrits: {
        _path: 'LITIGATION_WRITS/LITIGATION_WRIT',
        _as: true,
        dateLoaded: ['LW_LOAD_DATE/LW_LOAD_DAY', 'LW_LOAD_DATE/LW_LOAD_MONTH', 'LW_LOAD_DATE/LW_LOAD_YEAR', formatDate],
        defendantName: 'LW_DEFENDANT_NAME',
        courtCode: 'LW_COURT_CODE',
        caseNumber: 'LW_CASE_NUMBER',
        dateFiled: ['LW_FILE_DATE/LW_FILE_DAY', 'LW_FILE_DATE/LW_FILE_MONTH', 'LW_FILE_DATE/LW_FILE_YEAR', formatDate],
        natureOfClaim: 'LW_NATURE_OF_CLAIM',
        status: 'LW_STATUS',
        statusDate: ['LW_STATUS_DATE/LW_STATUS_DAY', 'LW_STATUS_DATE/LW_STATUS_MONTH', 'LW_STATUS_DATE/LW_STATUS_YEAR', formatDate],
        claimCurrency: 'LW_CLAIM_CURR1',
        claimAmount: 'LW_CLAIM_AMT1',
        plaintiffNames: {
          _path: 'LW_PLAINTIFF_NAMES/LW_PLAINTIFF_NAME',
          _as: true,
        },
      },
      bankruptcyPetitions: {
        _path: 'BANKRUPTCY_PETITIONS/BANKRUPTCY_PETITION',
        _as: true,
        dateLoaded: ['BP_LOAD_DATE/BP_LOAD_DAY', 'BP_LOAD_DATE/BP_LOAD_MONTH', 'BP_LOAD_DATE/BP_LOAD_YEAR', formatDate],
        defendantName: 'BP_DEFENDANT_NAME',
        courtCode: 'BP_COURT_CODE',
        caseNumber: 'BP_CASE_NUMBER',
        dateFiled: ['BP_FILE_DATE/BP_FILE_DAY', 'BP_FILE_DATE/BP_FILE_MONTH', 'BP_FILE_DATE/BP_FILE_YEAR', formatDate],
        natureOfClaim: 'BP_NATURE_OF_CLAIM',
        status: 'BP_STATUS',
        statusDate: [
          'BP_STATUS_DATE/BP_STATUS_DAY',
          'BP_STATUS_DATE/BP_STATUS_MONTH',
          'BP_STATUS_DATE/BP_STATUS_YEAR',
          as => (as[0] == '' ? '-' : as.join('/')),
        ],
        claimCurrency: 'BP_CLAIM_CURR1',
        claimAmount: 'BP_CLAIM_AMT1',
        plaintiffNames: {
          _path: 'BP_PLAINTIFF_NAMES/BP_PLAINTIFF_NAME',
          _as: true,
        },
      },
    },
  }
  return getObjectText(fields, consumer)
}

const getEnquiryInfo = rspReport => {
  const fields = {
    _path: '.',
    enquiryNo: 'ENQUIRY_NUMBER',
    enquiryRef: 'RSP_ENQUIRY_REF',
  }
  return getObjectText(fields, rspReport)
}

const getAggosbalances = consumer => {
  const fields = {
    _path: 'AGGOSBALANCES/AGGREGATE_OS_BAL',
    _as: true,
    osbDate: ['OSB_MONTH', 'OSB_YEAR', formatDate],
    securedBalances: ['SECURED_OSB', as => as[0] || '0.00'],
    unsecuredInterestBearingBalances: ['IBUNSEC_OSB', as => as[0] || '0.00'],
    unsecuredNonInterestBearingBalances: ['NIBUSEC_OSB', as => as[0] || '0.00'],
    exemptedBalances: 'EXEMPTED_OSB',
  }
  return getObjectText(fields, consumer)
}

module.exports = data => {
  const doc = new DOMParser().parseFromString(data)
  const state = xpath.select1('/RESPONSE/STATUS', doc).textContent.trim()
  if (state === 'OK') {
    return xpath.select('/RESPONSE/MESSAGE/ITEM', doc).map(e => {
      const report = xpath.select1('RSP_REPORT', e)
      return {
        enquiryInfo: getEnquiryInfo(report),
        consumerInfos: xpath.select('CONSUMER_OUT', report).map(consumer => ({
          applicantType: getText('APPLICANT_TYPE', consumer),
          consumerSeq: getText('CONSUMER_SEQ', consumer),
          summary: getSummary(consumer),
          personalDetails: getPersonalDetails(consumer),
          additionalIdentifications: getAdditionalIdentifications(consumer),
          additionalNames: getAdditionalNames(consumer),
          employments: getEmployments(consumer),
          accountStatusHistory: getAccountInfos(consumer),
          previousEnquiries: getPreviousEnquiries(consumer),
          defaultRecords: getDefaultRecords(consumer),
          bankruptcyProceedings: getBankruptcyProceedings(consumer),
          drsRecords: getDrsRecords(consumer),
          source: getSource(consumer),
          noAdverse: gvd(xpath.select1('NO_ADVERSE', consumer)),
          narratives: getNarratives(consumer),
          lisRerports: getLisReports(consumer),
          aggosbalances: getAggosbalances(consumer),
        })),
        disclaimer: getText('DISCLAIMER', report),
      }
    })
  } else {
    logger.error('response status error: %o', data)
    return []
  }
}
