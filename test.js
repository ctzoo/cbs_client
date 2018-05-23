// // // // // // const { pkg } = require('./cbs-pkg')

// // // // // // console.log(pkg(require('fs').readFileSync('C:/Users/cuita/Documents/a/Book1.xlsx'))[0][1][0])

// // // // // const a = require('./cbs')
// // // // // const fs = require('fs')
// // // // // const b1 = fs.readFileSync('./a.xlsx')
// // // // // // const b2 = fs.readFileSync('./b.xlsx')
// // // // // const res = fs.readFileSync('./a.xml', 'utf8')
// // // // // // a(b2, (evtType, msg) => console.log(evtType, msg)).catch(console.log)
// // // // // a(b1, (evtType, msg) => console.log(evtType, msg), async pkg => res)
// // // // //   .then(htmls => {
// // // // //     const AdmZip = require('adm-zip')
// // // // //     const zip = new AdmZip()
// // // // //     htmls.forEach(h => {
// // // // //       zip.addFile(h[0] + '.html', Buffer.from(h[1], 'utf8'))
// // // // //     })
// // // // //     zip.writeZip('./dist/a.zip')
// // // // //   })
// // // // //   .catch(console.log)

// // // // // // const aa = [1, 2]
// // // // // // aa.concat(aa)
// // // // // // console.log(aa)

// // // // const jwt = require('jsonwebtoken')
// // // // const s = jwt.sign(
// // // //   {
// // // //     exp: Math.floor(Date.now() / 1000) + 1,
// // // //     data: 'foobar',
// // // //   },
// // // //   'secret'
// // // // )
// // // // console.log(s)
// // // // console.log(
// // // //   jwt.decode(
// // // //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MjY4ODc0NDgsImRhdGEiOiJmb29iYXIiLCJpYXQiOjE1MjY4ODc0NDd9.ASqAzfRdRFP1tLRlr_bdoAc7EpGIjlyhjQQD0BmufxY'
// // // //   )
// // // // )
// // // // console.log(
// // // //   jwt.verify(
// // // //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MjY4ODc0NDgsImRhdGEiOiJmb29iYXIiLCJpYXQiOjE1MjY4ODc0NDd9.ASqAzfRdRFP1tLRlr_bdoAc7EpGIjlyhjQQD0BmufxY',
// // // //     'secret'
// // // //   )
// // // // )

// // // const level = require('level')
// // // const db = level('./users_storage')

// // // // db.put('admin', JSON.stringify({ username: 'admin', password: 'admin' }), err => {
// // // //   if (err) {
// // // //     console.log(err)
// // // //   } else {
// // // //     console.log('ok')
// // // //   }
// // // // })

// // // db.get('a', (e, v) => {
// // //   console.log(e)
// // // })

// // const i = 1
// // const istr = i.toString().padStart(7, '0')
// // console.log(istr)
// // console.log(parseInt(istr))
// const level = require('level')

// const db1 = level('./storage_cbs')
// // const db2 = level('./storage_2')

// // for (let i = 0; i < 100; i++) {
// //   db1.put(i, i)
// // }

// db1.createReadStream().on('data', data => console.log(data))

const unpkg = require('./src/server/cbs/unpkg')
const xml = `<RESPONSE>
<SERVICE>ENQUIRY</SERVICE>
<ACTION>A</ACTION>
<STATUS>OK</STATUS>
<MESSAGE>
  <HEADER>
    <CLIENT_ID>{clientId}</CLIENT_ID>
    <USER_ID>{userId}</USER_ID>
    <VERSION_NO>2.0</VERSION_NO>
    <RUN_NO>{runNo}</RUN_NO>
    <TOT_ITEMS>1</TOT_ITEMS>
    <ERR_ITEMS>0</ERR_ITEMS>
    <INF_ITEMS>0</INF_ITEMS>
  </HEADER>
  <ITEM>
    <RSP_ENQUIRY_REF>{enquiryReference}</RSP_ENQUIRY_REF>
    <RSP_REPORT>
      <ENQUIRY_NUMBER>270</ENQUIRY_NUMBER>
      <RSP_ENQUIRY_REF>{enquiryReference}</RSP_ENQUIRY_REF>
      <ENQUIRY_TYPE>{enquiryType}</ENQUIRY_TYPE>
      <ACCOUNT_TYPE>{accountType}</ACCOUNT_TYPE>
      <PRODUCT_TYPE>{productType}</PRODUCT_TYPE>
      <CONSUMER_OUT>
        <CONSUMER_SEQ>1</CONSUMER_SEQ>
        <APPLICANT_TYPE>{applicantType}</APPLICANT_TYPE>
        <PRIMARY_ID>
          <PRI_ID_TYPE>{idType}</PRI_ID_TYPE>
          <PRI_ID_CODE>{idNumber}</PRI_ID_CODE>
        </PRIMARY_ID>
        <PRIMARY_NAME>
          <PRI_SURNAME>SAMPLE</PRI_SURNAME>
          <PRI_FIRST_NAME>{customerName}</PRI_FIRST_NAME>
        </PRIMARY_NAME>
        <MARITAL_CODE>{maritalStatus}</MARITAL_CODE>
        <DATE_OF_BIRTH>
          <DOB_YEAR>{yearOfBirth}</DOB_YEAR>
          <DOB_MONTH>{monthOfBirth}</DOB_MONTH>
          <DOB_DAY>{dayOfBirth}</DOB_DAY>
        </DATE_OF_BIRTH>
        <GENDER_CODE>{gender}</GENDER_CODE>
        <NATIONALITY_CODE>SGP</NATIONALITY_CODE>
        <ADDRESSES>
          <RSP_ADDRESS>
            <ADR_TYPE_CODE>{addressType}</ADR_TYPE_CODE>
            <ADR_FORMAT_CODE>{addressFormat}</ADR_FORMAT_CODE>
            <ADR_POST_CODE>{postalCode}</ADR_POST_CODE>
            <ADR_CITY></ADR_CITY>
            <ADR_COUNTRY></ADR_COUNTRY>
            <ADR_UNFORMATTED></ADR_UNFORMATTED>
            <ADR_STRING>15446</ADR_STRING>
            <ADR_LOAD_DATE>
              <ADR_LOAD_YEAR>2001</ADR_LOAD_YEAR>
              <ADR_LOAD_MONTH>6</ADR_LOAD_MONTH>
              <ADR_LOAD_DAY>1</ADR_LOAD_DAY>
            </ADR_LOAD_DATE>
          </RSP_ADDRESS>
        </ADDRESSES>
        <ADDITIONAL_IDS>
          <ADDITIONAL_ID>
            <AID_ID_TYPE_CODE>PASS</AID_ID_TYPE_CODE>
            <AID_ID_CODE>BAYLAST</AID_ID_CODE>
            <AID_LOAD_DATE>
              <AID_LOAD_YEAR>2011</AID_LOAD_YEAR>
              <AID_LOAD_MONTH>02</AID_LOAD_MONTH>
              <AID_LOAD_DAY>21</AID_LOAD_DAY>
            </AID_LOAD_DATE>
          </ADDITIONAL_ID>
        </ADDITIONAL_IDS>
        <ADDITIONAL_NAMES>
          <ADDITIONAL_NAME>
            <ANM_FORMATTED>
              <ANM_SURNAME>MUNNA</ANM_SURNAME>
              <ANM_FIRST_NAME>KHAN</ANM_FIRST_NAME>
            </ANM_FORMATTED>
            <ANM_LOAD_DATE>
              <ANM_LOAD_YEAR>2011</ANM_LOAD_YEAR>
              <ANM_LOAD_MONTH>03</ANM_LOAD_MONTH>
              <ANM_LOAD_DAY>01</ANM_LOAD_DAY>
            </ANM_LOAD_DATE>
          </ADDITIONAL_NAME>
          <ADDITIONAL_NAME>
            <ANM_UNFORMATTED>CHANTHEA THY</ANM_UNFORMATTED>
            <ANM_LOAD_DATE>
              <ANM_LOAD_YEAR>2011</ANM_LOAD_YEAR>
              <ANM_LOAD_MONTH>02</ANM_LOAD_MONTH>
              <ANM_LOAD_DAY>03</ANM_LOAD_DAY>
            </ANM_LOAD_DATE>
          </ADDITIONAL_NAME>
        </ADDITIONAL_NAMES>
        <OCCUPATIONS>
          <OCCUPATION>
            <OCC_OCCUPATION>FINACIAL ADVISOR</OCC_OCCUPATION>
            <OCC_EMPLOYER>INFINTY</OCC_EMPLOYER>
            <OCC_LOAD_DATE>
              <OCC_LOAD_YEAR>2011</OCC_LOAD_YEAR>
              <OCC_LOAD_MONTH>07</OCC_LOAD_MONTH>
              <OCC_LOAD_DAY>06</OCC_LOAD_DAY>
            </OCC_LOAD_DATE>
          </OCCUPATION>
        </OCCUPATIONS>
        <ACCOUNTS>
          <ACCOUNT>
            <ACC_PRODUCT_TYPE>CC</ACC_PRODUCT_TYPE>
            <ACC_BANK_NAME>BANK 1</ACC_BANK_NAME>
            <ACC_TYPE_CODE>J</ACC_TYPE_CODE>
            <ACC_OPENED_DATE>
              <ACC_OPENED_YEAR>1999</ACC_OPENED_YEAR>
              <ACC_OPENED_MONTH>6</ACC_OPENED_MONTH>
              <ACC_OPENED_DAY>30</ACC_OPENED_DAY>
            </ACC_OPENED_DATE>
            <ACC_OVERDUE_BALANCE>2568</ACC_OVERDUE_BALANCE>
            <ACC_STATUS_SUMMARY>ABAAAAAAAAAA</ACC_STATUS_SUMMARY>
            <ACC_CASH_ADVANCE_SUMMARY>YNNNNNNNNNNN</ACC_CASH_ADVANCE_SUMMARY>
            <ACC_FULL_PAYMENT_SUMMARY>NYYYYYYYYYYY</ACC_FULL_PAYMENT_SUMMARY>
            <ACC_LOAD_DATE>
              <ACC_LOAD_YEAR>2001</ACC_LOAD_YEAR>
              <ACC_LOAD_MONTH>06</ACC_LOAD_MONTH>
              <ACC_LOAD_DAY>1</ACC_LOAD_DAY>
            </ACC_LOAD_DATE>
          </ACCOUNT>
          <ACCOUNT>
            <ACC_PRODUCT_TYPE>CC</ACC_PRODUCT_TYPE>
            <ACC_BANK_NAME>BANK 2</ACC_BANK_NAME>
            <ACC_TYPE_CODE>J</ACC_TYPE_CODE>
            <ACC_OPENED_DATE>
              <ACC_OPENED_YEAR>1998</ACC_OPENED_YEAR>
              <ACC_OPENED_MONTH>5</ACC_OPENED_MONTH>
              <ACC_OPENED_DAY>30</ACC_OPENED_DAY>
            </ACC_OPENED_DATE>
            <ACC_OVERDUE_BALANCE>2568</ACC_OVERDUE_BALANCE>
            <ACC_STATUS_SUMMARY>ABAAAAAAAAAA</ACC_STATUS_SUMMARY>
            <ACC_CASH_ADVANCE_SUMMARY>YNNNNNNNNNNN</ACC_CASH_ADVANCE_SUMMARY>
            <ACC_FULL_PAYMENT_SUMMARY>NYYYYYYYYYYY</ACC_FULL_PAYMENT_SUMMARY>
            <ACC_LOAD_DATE>
              <ACC_LOAD_YEAR>2001</ACC_LOAD_YEAR>
              <ACC_LOAD_MONTH>6</ACC_LOAD_MONTH>
              <ACC_LOAD_DAY>1</ACC_LOAD_DAY>
            </ACC_LOAD_DATE>
          </ACCOUNT>
        </ACCOUNTS>
        <PREVIOUS_ENQUIRIES>
          <PREVIOUS_ENQUIRY>
            <IPI_ENQUIRY_TYPE>NA</IPI_ENQUIRY_TYPE>
            <IPI_ACCOUNT_TYPE>S</IPI_ACCOUNT_TYPE>
            <IPI_PRODUCT_TYPE>BL</IPI_PRODUCT_TYPE>
            <IPI_LOAD_DATE>
              <IPI_LOAD_YEAR>2001</IPI_LOAD_YEAR>
              <IPI_LOAD_MONTH>6</IPI_LOAD_MONTH>
              <IPI_LOAD_DAY>1</IPI_LOAD_DAY>
            </IPI_LOAD_DATE>
          </PREVIOUS_ENQUIRY>
        </PREVIOUS_ENQUIRIES>
        <BAD_DEBTS>
          <BAD_DEBT>
            <BD_PRODUCT_TYPE>PC</BD_PRODUCT_TYPE>
            <BD_BANK_NAME>ABN AMRO BANK</BD_BANK_NAME>
            <BD_LOAD_DATE>
              <BD_LOAD_YEAR>2011</BD_LOAD_YEAR>
              <BD_LOAD_MONTH>02</BD_LOAD_MONTH>
              <BD_LOAD_DAY>21</BD_LOAD_DAY>
            </BD_LOAD_DATE>
            <BD_LBAL>500.00</BD_LBAL>
            <BD_AMOUNT>250.00</BD_AMOUNT>
            <BD_STS>OS</BD_STS>
          </BAD_DEBT>
        </BAD_DEBTS>
        <PUBLIC_NOTICES>
          <PUBLIC_NOTICE>
            <IPN_TYPE_CODE>ADVS</IPN_TYPE_CODE>
            <IPN_LOAD_DATE>
              <IPN_LOAD_YEAR>2011</IPN_LOAD_YEAR>
              <IPN_LOAD_MONTH>02</IPN_LOAD_MONTH>
              <IPN_LOAD_DAY>03</IPN_LOAD_DAY>
            </IPN_LOAD_DATE>
            <IPN_PUBLICATION>NATIONAL NEWS</IPN_PUBLICATION>
            <IPN_TEXT>
              <IPT_LINE_NUMBER>1</IPT_LINE_NUMBER>
              <IPT_LINE>REMOVE AND TREATMENT OF YOUR WASTEWATER SEWAGE</IPT_LINE>
            </IPN_TEXT>
          </PUBLIC_NOTICE>
        </PUBLIC_NOTICES>
        <DRS_RECORDS>
          <DRS_RECORD>
            <DRS_CASE_NUMBER>
              D9858592005B
            </DRS_CASE_NUMBER>
            <DRS_STATUS_CODE>
              IA
            </DRS_STATUS_CODE>
            <DRS_COMMENC_DATE>
              <DRS_COMMENC_DAY>06</DRS_COMMENC_DAY>
              <DRS_COMMENC_MONTH>09</DRS_COMMENC_MONTH>
              <DRS_COMMENC_YEAR>2012</DRS_COMMENC_YEAR>
            </DRS_COMMENC_DATE>
            <DRS_COMPLETION_DATE>
              <DRS_COMPLETION_DAY>11</DRS_COMPLETION_DAY>
              <DRS_COMPLETION_MONTH>07</DRS_COMPLETION_MONTH>
              <DRS_COMPLETION_YEAR>2013</DRS_COMPLETION_YEAR>
            </DRS_COMPLETION_DATE>
            <DRS_FAILURE_DATE>
              <DRS_FAILURE_DAY>11</DRS_FAILURE_DAY>
              <DRS_FAILURE_MONTH>08</DRS_FAILURE_MONTH>
              <DRS_FAILURE_YEAR>2013</DRS_FAILURE_YEAR>
            </DRS_FAILURE_DATE>
          </DRS_RECORD>
        </DRS_RECORDS>
        <BANKRUPTCY_RECORDS>
          <BANKRUPTCY_RECORD>
            <BR_NUMBER>2356455</BR_NUMBER>
            <BR_ORDER_DATE>
              <BR_ORDER_YEAR>2011</BR_ORDER_YEAR>
              <BR_ORDER_MONTH>01</BR_ORDER_MONTH>
              <BR_ORDER_DAY>11</BR_ORDER_DAY>
            </BR_ORDER_DATE>
            <BR_PETITION_DATE>
              <BR_PETITION_YEAR/>
              <BR_PETITION_MONTH/>
              <BR_PETITION_DAY/>
            </BR_PETITION_DATE>
            <BR_ORIG_ORDER_DATE>
              <BR_ORIG_ORDER_YEAR/>
              <BR_ORIG_ORDER_MONTH/>
              <BR_ORIG_ORDER_DAY/>
            </BR_ORIG_ORDER_DATE>
            <BR_ORDER_NATURE>
              <![CDATA[BANKRUPTCY TEST PETTITION]]>
            </BR_ORDER_NATURE>
            <BR_GAZ_DATE>
              <BR_GAZ_YEAR/>
              <BR_GAZ_MONTH/>
              <BR_GAZ_DAY/>
            </BR_GAZ_DATE>
          </BANKRUPTCY_RECORD>
        </BANKRUPTCY_RECORDS>
        <SCORE>
          <SC_HEADER>
            <SC_HEADER_TEXT>
              <![CDATA[ Bureau Scorecards utilise all available data to calculate risk estimate. This is based on analysis of the association of all the data with future adverse outcomes.]]>
            </SC_HEADER_TEXT>
          </SC_HEADER>
          <SC_DIAGRAM_VARIABLES>
            <SC_DIAGRAM_FILE_NAME><![CDATA[ ]]></SC_DIAGRAM_FILE_NAME>
          </SC_DIAGRAM_VARIABLES>
          <SC_VARIABLES>
            <SC_VARIABLE>
              <SC_VAR_NAME><![CDATA[ Score Card ]]></SC_VAR_NAME>
              <SC_VAR_VALUE><![CDATA[ GEN02 ]]></SC_VAR_VALUE>
            </SC_VARIABLE>
            <SC_VARIABLE>
              <SC_VAR_NAME><![CDATA[ Score ]]></SC_VAR_NAME>
              <SC_VAR_VALUE><![CDATA[ 0 ]]></SC_VAR_VALUE>
            </SC_VARIABLE>
            <SC_VARIABLE>
              <SC_VAR_NAME><![CDATA[ Risk Grade ]]></SC_VAR_NAME>
              <SC_VAR_VALUE><![CDATA[ HX ]]></SC_VAR_VALUE>
            </SC_VARIABLE>
            <SC_VARIABLE>
              <SC_VAR_NAME><![CDATA[ Risk Grade Description]]></SC_VAR_NAME>
              <SC_VAR_VALUE>
                <![CDATA[ Public records (with or without inquiry/with or without trade)]]>
              </SC_VAR_VALUE>
            </SC_VARIABLE>
            <SC_VARIABLE>
              <SC_VAR_NAME><![CDATA[ Probability of Default ]]></SC_VAR_NAME>
              <SC_VAR_VALUE><![CDATA[ .00% ]]></SC_VAR_VALUE>
            </SC_VARIABLE>
            <SC_VARIABLE>
              <SC_VAR_NAME><![CDATA[ Risk Odds ]]></SC_VAR_NAME>
              <SC_VAR_VALUE><![CDATA[ .00:1 ]]></SC_VAR_VALUE>
            </SC_VARIABLE>
          </SC_VARIABLES>
          <SC_EXPLANATION_OF_VARIABLES>
            <SC_EXPLANATION_OF_VARIABLE>
              <SC_EXP_OF_VAR_NAME><![CDATA[ Score Card]]></SC_EXP_OF_VAR_NAME>
              <SC_EXP_OF_VAR_VALUE>
                <![CDATA[ Indentifies the Scorecard used to calculate Bureau Score]]>
              </SC_EXP_OF_VAR_VALUE>
            </SC_EXPLANATION_OF_VARIABLE>
            <SC_EXPLANATION_OF_VARIABLE>
              <SC_EXP_OF_VAR_NAME><![CDATA[ Score]]></SC_EXP_OF_VAR_NAME>
              <SC_EXP_OF_VAR_VALUE>
                <![CDATA[The score ranges from 1000 to 2000, where individuals scoring 1000 have the highest likelihood of defaulting on a repayment, where those who score 2000 have the lowest chance of reaching a delinquency status]]>
              </SC_EXP_OF_VAR_VALUE>
            </SC_EXPLANATION_OF_VARIABLE>
            <SC_EXPLANATION_OF_VARIABLE>
              <SC_EXP_OF_VAR_NAME>
                <![CDATA[ Probability of Default]]>
              </SC_EXP_OF_VAR_NAME>
              <SC_EXP_OF_VAR_VALUE>
                <![CDATA[The probability of the consumer defaulting based on the population average, within the next 12 months.]]>
              </SC_EXP_OF_VAR_VALUE>
            </SC_EXPLANATION_OF_VARIABLE>
            <SC_EXPLANATION_OF_VARIABLE>
              <SC_EXP_OF_VAR_NAME><![CDATA[ Risk Odds]]></SC_EXP_OF_VAR_NAME>
              <SC_EXP_OF_VAR_VALUE>
                <![CDATA[An odds-based measure of the likelihood of default within the next 12 months]]>
              </SC_EXP_OF_VAR_VALUE>
            </SC_EXPLANATION_OF_VARIABLE>
          </SC_EXPLANATION_OF_VARIABLES>
          <SC_KEY_FACTORS>
            <SC_KEY_FACTOR>
              <SC_KEY_FACTOR_NAME><![CDATA[ Cuitao Test]]></SC_KEY_FACTOR_NAME>
              <SC_KEY_FACTOR_VALUE><![CDATA[ cccttt ]]></SC_KEY_FACTOR_VALUE>
            </SC_KEY_FACTOR>
            <SC_KEY_FACTOR>
              <SC_KEY_FACTOR_NAME><![CDATA[ ]]></SC_KEY_FACTOR_NAME>
              <SC_KEY_FACTOR_VALUE><![CDATA[ ]]></SC_KEY_FACTOR_VALUE>
            </SC_KEY_FACTOR>
            <SC_KEY_FACTOR>
              <SC_KEY_FACTOR_NAME><![CDATA[ ]]></SC_KEY_FACTOR_NAME>
              <SC_KEY_FACTOR_VALUE><![CDATA[ ]]></SC_KEY_FACTOR_VALUE>
            </SC_KEY_FACTOR>
            <SC_KEY_FACTOR>
              <SC_KEY_FACTOR_NAME><![CDATA[ ]]></SC_KEY_FACTOR_NAME>
              <SC_KEY_FACTOR_VALUE><![CDATA[ ]]></SC_KEY_FACTOR_VALUE>
            </SC_KEY_FACTOR>
          </SC_KEY_FACTORS>
          <SC_EXPLANATION_OF_KEY_FACTORS>
            <SC_EXPLANATION_OF_KEY_FACTOR>
              <SC_EXP_OF_KEY_FACTOR_NAME>
                <![CDATA[ Immature Credit History ]]>
              </SC_EXP_OF_KEY_FACTOR_NAME>
              <SC_EXP_OF_KEY_FACTOR_VALUE>
                <![CDATA[Immature credit history will generally contribute to the credit risk uncertainty]]>
              </SC_EXP_OF_KEY_FACTOR_VALUE>
            </SC_EXPLANATION_OF_KEY_FACTOR>
            <SC_EXPLANATION_OF_KEY_FACTOR>
              <SC_EXP_OF_KEY_FACTOR_NAME>
                <![CDATA[ Credit Exposure]]>
              </SC_EXP_OF_KEY_FACTOR_NAME>
              <SC_EXP_OF_KEY_FACTOR_VALUE>
                <![CDATA[The level of credit exposure will generally contribute to higher credit risk]]>
              </SC_EXP_OF_KEY_FACTOR_VALUE>
            </SC_EXPLANATION_OF_KEY_FACTOR>
            <SC_EXPLANATION_OF_KEY_FACTOR>
              <SC_EXP_OF_KEY_FACTOR_NAME>
                <![CDATA[ Delinquency Presence]]>
              </SC_EXP_OF_KEY_FACTOR_NAME>
              <SC_EXP_OF_KEY_FACTOR_VALUE>
                <![CDATA[The presence of the delinquency is generally indicative of higher credit risk]]>
              </SC_EXP_OF_KEY_FACTOR_VALUE>
            </SC_EXPLANATION_OF_KEY_FACTOR>
            <SC_EXPLANATION_OF_KEY_FACTOR>
              <SC_EXP_OF_KEY_FACTOR_NAME>
                <![CDATA[ Not Enough Clean History]]>
              </SC_EXP_OF_KEY_FACTOR_NAME>
              <SC_EXP_OF_KEY_FACTOR_VALUE>
                <![CDATA[Lack of clean credit history will generally contribute to higher credit risk]]>
              </SC_EXP_OF_KEY_FACTOR_VALUE>
            </SC_EXPLANATION_OF_KEY_FACTOR>
            <SC_EXPLANATION_OF_KEY_FACTOR>
              <SC_EXP_OF_KEY_FACTOR_NAME>
                <![CDATA[ Adverse Credit History]]>
              </SC_EXP_OF_KEY_FACTOR_NAME>
              <SC_EXP_OF_KEY_FACTOR_VALUE>
                <![CDATA[Adverse credit history is generally indicative of the higher credit risk]]>
              </SC_EXP_OF_KEY_FACTOR_VALUE>
            </SC_EXPLANATION_OF_KEY_FACTOR>
            <SC_EXPLANATION_OF_KEY_FACTOR>
              <SC_EXP_OF_KEY_FACTOR_NAME>
                <![CDATA[ Too Many Enquiries]]>
              </SC_EXP_OF_KEY_FACTOR_NAME>
              <SC_EXP_OF_KEY_FACTOR_VALUE>
                <![CDATA[The frequency and recency of credit applications may impact the credit risk assessment]]>
              </SC_EXP_OF_KEY_FACTOR_VALUE>
            </SC_EXPLANATION_OF_KEY_FACTOR>
          </SC_EXPLANATION_OF_KEY_FACTORS>
        </SCORE>
        <NARRATIVES>
          <NARRATIVE>
            <NAR_TYPE_CODE>DEBT</NAR_TYPE_CODE>
            <NAR_LOAD_DATE>
              <NAR_LOAD_YEAR>2011</NAR_LOAD_YEAR>
              <NAR_LOAD_MONTH>02</NAR_LOAD_MONTH>
              <NAR_LOAD_DAY>03</NAR_LOAD_DAY>
            </NAR_LOAD_DATE>
            <NAR_TEXT>
              <NAR_LINE_NUMBER>1</NAR_LINE_NUMBER>
              <NAR_LINE>
                SAFE AND RELIABLE SUPPLY OF GOOD QUALITY WATER WITHIN A STANDARD PRESSSURE R
              </NAR_LINE>
            </NAR_TEXT>
            <NAR_TEXT>
              <NAR_LINE_NUMBER>2</NAR_LINE_NUMBER>
              <NAR_LINE>ANGE testing</NAR_LINE>
            </NAR_TEXT>
          </NARRATIVE>
        </NARRATIVES>
        <NO_ADVERSE>
          No adverse information could be found on the subject.
        </NO_ADVERSE>
        <SUMMARY>
          <ACCOUNT_COUNT>2</ACCOUNT_COUNT>
          <ENQUIRY_COUNT>1</ENQUIRY_COUNT>
          <BAD_DEBT_COUNT>1</BAD_DEBT_COUNT>
          <BANKRUPTCY_COUNT>1</BANKRUPTCY_COUNT>
          <NOTICE_COUNT>0</NOTICE_COUNT>
          <DEBT_MGMT_FLAG>Y</DEBT_MGMT_FLAG>
          <CRD_FILE_AGE>
            <CFRD></CFRD>
            <CFRM></CFRM>
            <CFRY></CFRY>
          </CRD_FILE_AGE>
          <ID_THEFT_FLAG></ID_THEFT_FLAG>
          <SECURED_CRL></SECURED_CRL>
          <UNSECURED_CRL></UNSECURED_CRL>
          <EXEMPT_CRL></EXEMPT_CRL>
          <BTI_12X_FLAG></BTI_12X_FLAG>
        </SUMMARY>
        <LIS_REPORTS>
          <WRIT_COUNT>00000</WRIT_COUNT>
          <BANKRUPTCY_PETITION_COUNT>00002</BANKRUPTCY_PETITION_COUNT>
          <LIS_REPORT>
            <SUBJECT_IDTYPE>NRIC</SUBJECT_IDTYPE>
            <SUBJECT_IDNO>S1235969A</SUBJECT_IDNO>
            <BANKRUPTCY_PETITIONS>
              <BANKRUPTCY_PETITION>
                <BP_LOAD_DATE>
                  <BP_LOAD_DAY>26</BP_LOAD_DAY>
                  <BP_LOAD_MONTH>02</BP_LOAD_MONTH>
                  <BP_LOAD_YEAR>2004</BP_LOAD_YEAR>
                </BP_LOAD_DATE>
                <BP_CASE_SEQ>0</BP_CASE_SEQ>
                <BP_DEFENDANT_NAME>HO HEN KEOW JEAN</BP_DEFENDANT_NAME>
                <BP_COURT_CODE>B</BP_COURT_CODE>
                <BP_CASE_NUMBER>3353</BP_CASE_NUMBER>
                <BP_FILE_DATE>
                  <BP_FILE_DAY>21</BP_FILE_DAY>
                  <BP_FILE_MONTH>08</BP_FILE_MONTH>
                  <BP_FILE_YEAR>2008</BP_FILE_YEAR>
                </BP_FILE_DATE>
                <BP_NATURE_OF_CLAIM>
                  IN DEFAULT OF STATUTORY DEMAND
                </BP_NATURE_OF_CLAIM>
                <BP_STATUS>-</BP_STATUS>
                <BP_STATUS_DATE>
                  <BP_STATUS_DAY />
                  <BP_STATUS_MONTH />
                  <BP_STATUS_YEAR />
                </BP_STATUS_DATE>
                <BP_CLAIM_CURR1>-</BP_CLAIM_CURR1>
                <BP_CLAIM_AMT1>12531.29</BP_CLAIM_AMT1>
                <BP_PLAINTIFF_NAMES>
                  <BP_PLAINTIFF_NAME>DBS BANK LTD</BP_PLAINTIFF_NAME>
                </BP_PLAINTIFF_NAMES>
              </BANKRUPTCY_PETITION>
            </BANKRUPTCY_PETITIONS>
          </LIS_REPORT>
          <LIS_DISCLAIMER>
            <LIS_DISCLAIMER_TEXT>
              <LIS_DISCLAIMER_TEXT_LINE>
                You have requested an additional search of the Litigation Writ and Bankruptcy Petition Database which is derived from publicly available Court records.
              </LIS_DISCLAIMER_TEXT_LINE>
            </LIS_DISCLAIMER_TEXT>
            <LIS_DISCLAIMER_TEXT>
              <LIS_DISCLAIMER_TEXT_LINE>
                This information does not form part of the CBS credit report and is a separate service provided at your request.
              </LIS_DISCLAIMER_TEXT_LINE>
            </LIS_DISCLAIMER_TEXT>
            <LIS_DISCLAIMER_TEXT>
              <LIS_DISCLAIMER_TEXT_LINE />
            </LIS_DISCLAIMER_TEXT>
            <LIS_DISCLAIMER_TEXT>
              <LIS_DISCLAIMER_TEXT_LINE>
                Any information recorded below is based on a match to the ID of the subject and is provided as at the filing date of the write and/or petition. The information
              </LIS_DISCLAIMER_TEXT_LINE>
            </LIS_DISCLAIMER_TEXT>
          </LIS_DISCLAIMER>
        </LIS_REPORTS>
        <AGGOSBALANCES>
          <AGGREGATE_OS_BAL>
            <OSB_MONTH>01</OSB_MONTH>
            <OSB_YEAR>2014</OSB_YEAR>
            <SECURED_OSB>15000.00</SECURED_OSB>
            <IBUNSEC_OSB>0.00</IBUNSEC_OSB>
            <NIBUSEC_OSB>0.00</NIBUSEC_OSB>
            <EXEMPTED_OSB>9250.00</EXEMPTED_OSB>
          </AGGREGATE_OS_BAL>
          <AGGREGATE_OS_BAL>
            <OSB_MONTH>12</OSB_MONTH>
            <OSB_YEAR>2013</OSB_YEAR>
            <SECURED_OSB>27000.00</SECURED_OSB>
            <IBUNSEC_OSB>6500.00</IBUNSEC_OSB>
            <NIBUSEC_OSB>0.00</NIBUSEC_OSB>
            <EXEMPTED_OSB>9500.00</EXEMPTED_OSB>
          </AGGREGATE_OS_BAL>
          <AGGREGATE_OS_BAL>
            <OSB_MONTH>11</OSB_MONTH>
            <OSB_YEAR>2013</OSB_YEAR>
            <SECURED_OSB>25000.00</SECURED_OSB>
            <IBUNSEC_OSB>5500.00</IBUNSEC_OSB>
            <NIBUSEC_OSB>0.00</NIBUSEC_OSB>
            <EXEMPTED_OSB>9750.00</EXEMPTED_OSB>
          </AGGREGATE_OS_BAL>
          <AGGREGATE_OS_BAL>
            <OSB_MONTH>10</OSB_MONTH>
            <OSB_YEAR>2013</OSB_YEAR>
            <SECURED_OSB>20000.00</SECURED_OSB>
            <IBUNSEC_OSB>7500.75</IBUNSEC_OSB>
            <NIBUSEC_OSB>0.00</NIBUSEC_OSB>
            <EXEMPTED_OSB>10000.00</EXEMPTED_OSB>
          </AGGREGATE_OS_BAL>
          <AGGREGATE_OS_BAL>
            <OSB_MONTH>09</OSB_MONTH>
            <OSB_YEAR>2013</OSB_YEAR>
            <SECURED_OSB>0.00</SECURED_OSB>
            <IBUNSEC_OSB>0.00</IBUNSEC_OSB>
            <NIBUSEC_OSB>0.00</NIBUSEC_OSB>
            <EXEMPTED_OSB>0.00</EXEMPTED_OSB>
          </AGGREGATE_OS_BAL>
          <AGGREGATE_OS_BAL>
            <OSB_MONTH>08</OSB_MONTH>
            <OSB_YEAR>2013</OSB_YEAR>
            <SECURED_OSB>0.00</SECURED_OSB>
            <IBUNSEC_OSB>0.00</IBUNSEC_OSB>
            <NIBUSEC_OSB>0.00</NIBUSEC_OSB>
            <EXEMPTED_OSB>0.00</EXEMPTED_OSB>
          </AGGREGATE_OS_BAL>
        </AGGOSBALANCES>
      </CONSUMER_OUT>
      <DISCLAIMER>
        <![CDATA[This information has been collated from various sources and does not represent the opinion of Infocredit D&B(Singapore) Pte Ltd. No liability (in tort contract or Otherwise howsoever) attaches to us with respect to the collation or supplying of the information or any use made of it and whether in relation to its accuracy or completeness or any other matter whatsoever. The information is supplied on a confidential basis to you and not for the use of any other party save of any person on whose behalf you have sought the information. We are entitled to indemnity from you against any claims or loss made or sustained in consequence of the provision of the information sought.]]>
      </DISCLAIMER>
    </RSP_REPORT>
  </ITEM>
</MESSAGE>
</RESPONSE>`

const dic = require('./src/server/cbs/dic')
const newline = require('os').EOL
const consumerFieldLens = [50, 2, 5, 5, 20, 35, 35, 35, 105, 105, 5, 8, 5, 5, 256, 5, 5, 5, 5, 5, 1, 5, 5, 8, 1, 18, 18, 18, 1]
const aggBalanceFieldLens = [50, 2, 2, 4, 18, 18, 18, 18]
const scoringVarFieldLens = [50, 2, 30, 50, 2000]
const previousEnquiryFieldLens = [50, 2, 5, 5, 5, 8]

const pkg = unpkg(xml)
function makeLine(vals, pads) {
  return vals.map((v, i) => v.padEnd(pads[i], ' ')).join('')
}
function generateAggBanceStr(pkg) {
  const retAs = []
  let i = 0
  for (const item of pkg) {
    for (const consumer of item.consumerInfos) {
      i++
      for (const aggbalance of consumer.aggosbalances) {
        const as = []
        as.push(item.enquiryInfo.enquiryRef)
        as.push(i.toString().padStart(2, ' '))
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
  let i = 0
  for (const item of pkg) {
    for (const consumer of item.consumerInfos) {
      i++
      for (const v of consumer.source.source.vars) {
        const as = []
        as.push(item.enquiryInfo.enquiryRef)
        as.push(i.toString().padStart(2, ' '))
        as.push(v.name)
        as.push(v.value)
        as.push(consumer.source.source.headerText)
        retAs.push(makeLine(as, scoringVarFieldLens))
      }
    }
  }
  return retAs.join(newline)
}

function generatePreviousEnquiry(pkg) {
  const retAs = []
  let i = 0
  for (const item of pkg) {
    for (const consumer of item.consumerInfos) {
      i++
      for (const previousEnquirie of consumer.previousEnquiries) {
        const as = []
        as.push(item.enquiryInfo.enquiryRef)
        as.push(i.toString().padStart(2, ' '))
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
  let i = 0
  for (const item of pkg) {
    for (const consumer of item.consumerInfos) {
      i++
      const as = []
      as.push(item.enquiryInfo.enquiryRef) // 1
      as.push(i.toString().padStart(2, ' ')) // 2
      as.push(consumer.applicantType) // 3
      as.push(dic.getKey(consumer.personalDetails.idType, dic.idType)) // 4
      as.push(consumer.personalDetails.idNumber) // 5
      as.push(consumer.personalDetails.surname) // 6
      as.push(consumer.personalDetails.firstName) // 7
      as.push(consumer.personalDetails.secondName) // 8
      as.push(consumer.personalDetails.foreNames) // 9
      as.push(consumer.personalDetails.unformattedName) // 10
      as.push(dic.getKey(consumer.personalDetails.maritalStatus, dic.maritalStatus)) // 11
      as.push(consumer.personalDetails.dateOfBirth.split('/').reduce((s, e) => s + e.padStart(2, '0'), '')) // 12
      as.push(dic.getKey(consumer.personalDetails.gender, dic.gender)) // 13
      as.push(consumer.personalDetails.nationality) // 14
      as.push(consumer.noAdverse) // 15
      as.push(consumer.summary.accounts) // 16
      as.push(consumer.summary.previousEnquiries) // 17
      as.push(consumer.summary.defaults) // 18
      as.push(consumer.summary.bankruptcyProceedings) // 19
      as.push(consumer.summary.noticeCount) // 20
      as.push(consumer.summary.debtManagementProgramme) // 21
      as.push(consumer.lisRerports.litigationWrits) // 22
      as.push(consumer.lisRerports.bankruptcyPetitions) // 23
      as.push(consumer.summary.creditFileAge && consumer.summary.creditFileAge.split('/').reduce((s, e) => s + e.padStart(2, '0'), '')) // 24
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
// console.log(JSON.stringify(pkg, null, '  '))
console.log(generateConsumer(pkg.concat(pkg)))
