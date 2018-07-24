const pdf = require('html-pdf')
const { ONE_PDF_COMPLETED, BEGIN_PROC_PDF } = require('../../consts')

function myPdfTools(html) {
  return new Promise((resolve, reject) =>
    pdf.create(html, {
      format: 'A4',
      orientation: 'portrait',
      border: {
        top: '2.2cm',
        bottom: '2.8cm',
        left: '1.8cm',
        right: '1.8cm'
      },
      header: {
        height: '70px'
      }
    }).toBuffer((err, buf) => (err ? reject(err) : resolve(buf)))
  )
}

module.exports = async (htmls, ad) => {
  const ret = []
  let i = 0
  ad(BEGIN_PROC_PDF, { count: htmls.length })
  for (const html of htmls) {
    i++
    const buf = await myPdfTools(html[1])
    ret.push([html[0] + '.pdf', buf])
    ad(ONE_PDF_COMPLETED, { count: htmls.length, completedCount: i })
  }
  return ret
}
