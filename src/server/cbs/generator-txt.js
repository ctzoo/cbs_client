const dic = require('./dic')
const newline = require('os').EOL
const consumerFieldLens = [50, 2, 5, 5, 20, 35, 35, 35, 105, 105, 5, 8, 5, 5, 256, 5, 5, 5, 5, 5, 1, 5, 5, 8, 1, 18, 18, 18, 1]
const aggBalanceFieldLens = [50, 2, 2, 4, 18, 18, 18, 18]
const scoringVarFieldLens = [50, 2, 30, 50, 2000]
const previousEnquiryFieldLens = [50, 2, 5, 5, 5, 8]

function makeLine(vals, pads) {
  return vals.map((v, i) => v.padEnd(pads[i], ' ')).join('')
}

function generateAggBanceStr(pkg) {
  const retAs = []
  for (const item of pkg) {
    for (const consumer of item.consumerInfos) {
      for (const aggbalance of consumer.aggosbalances) {
        const as = []
        as.push(item.enquiryInfo.enquiryRef)
        as.push(' 1')
        as.push(...aggbalance.osbDate.split('/'))
        as.push(aggbalance.securedBalances)
        as.push(aggbalance.unsecuredInterestBearingBalances)
        as.push(aggbalance.unsecuredNonInterestBearingBalances)
        as.push(aggbalance.exemptedBalances)
        retAs.push(makeLine(as, aggBalanceFieldLens))
      }
    }
  }
  return retAs.join(newline)
}

function generateScoringVariableStr(pkg) {
  const retAs = []
  for (const item of pkg) {
    for (const consumer of item.consumerInfos) {
      for (const v of consumer.source.source.vars) {
        const as = []
        as.push(item.enquiryInfo.enquiryRef)
        as.push(' 1')
        as.push(v.name)
        as.push(v.value)
        as.push(consumer.source.source.headerText)
        retAs.push(makeLine(as, scoringVarFieldLens))
      }
    }
  }
  return retAs.join(newline)
}

function generatePreviousEnquiryStr(pkg) {
  const retAs = []
  for (const item of pkg) {
    for (const consumer of item.consumerInfos) {
      for (const previousEnquirie of consumer.previousEnquiries) {
        const as = []
        as.push(item.enquiryInfo.enquiryRef)
        as.push(' 1')
        as.push(dic.getKey(dic.enquiryType, previousEnquirie.enquiryType))
        as.push(dic.getKey(dic.accountType, previousEnquirie.accountType))
        as.push(dic.getKey(dic.productType, previousEnquirie.productType))
        as.push(previousEnquirie.date.split('/').reduce((s, e) => s + e.padStart(2, '0'), ''))
        retAs.push(makeLine(as, previousEnquiryFieldLens))
      }
    }
  }
  return retAs.join(newline)
}

function generateConsumer(pkg) {
  const retAs = []
  for (const item of pkg) {
    for (const consumer of item.consumerInfos) {
      const as = []
      as.push(item.enquiryInfo.enquiryRef) // 1
      as.push(' 1') // 2
      as.push(consumer.__applicantType) // 3
      as.push(dic.getKey(dic.idType, consumer.personalDetails.idType)) // 4
      as.push(consumer.personalDetails.idNumber) // 5
      as.push(consumer.personalDetails.surname) // 6
      as.push(consumer.personalDetails.firstName) // 7
      as.push(consumer.personalDetails.secondName) // 8
      as.push(consumer.personalDetails.foreNames) // 9
      as.push(consumer.personalDetails.unformattedName) // 10
      as.push(dic.getKey(dic.maritalStatus, consumer.personalDetails.maritalStatus)) // 11
      as.push(consumer.personalDetails.dateOfBirth.split('/').reduce((s, e) => s + e.padStart(2, '0'), '')) // 12
      as.push(dic.getKey(dic.gender, consumer.personalDetails.gender)) // 13
      as.push(consumer.personalDetails.nationality) // 14
      as.push(consumer.noAdverse) // 15
      as.push(consumer.summary.accounts) // 16
      as.push(consumer.summary.previousEnquiries) // 17
      as.push(consumer.summary.defaults) // 18
      as.push(consumer.summary.bankruptcyProceedings) // 19
      as.push(consumer.summary.__noticeCount) // 20
      as.push(consumer.summary.debtManagementProgramme) // 21
      as.push(consumer.lisRerports.litigationWrits) // 22
      as.push(consumer.lisRerports.bankruptcyPetitions) // 23
      as.push(consumer.summary.__creditFileAge && consumer.summary.__creditFileAge.split('/').reduce((s, e) => s + e.padStart(2, '0'), '')) // 24
      as.push(consumer.summary.idTheft) // 25
      as.push(consumer.summary.securedCreditLimit) // 26
      as.push(consumer.summary.unsecuredCreditLimit) // 27
      as.push(consumer.summary.exemptedCreditLimit) // 28
      as.push(consumer.summary._12_BTI) // 29
      retAs.push(makeLine(as, consumerFieldLens))
    }
  }
  return retAs.join(newline)
}

module.exports = function (pkg) {
  return [
    ['Customer.txt', generateConsumer(pkg)],
    ['AGGOSBALANCES.txt', generateAggBanceStr(pkg)],
    ['ScoringVariable.txt', generateScoringVariableStr(pkg)],
    ['PreviousEnquiry.txt', generatePreviousEnquiryStr(pkg)],
  ]
}