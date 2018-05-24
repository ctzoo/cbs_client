const pdf = require('html-pdf')

function myPdfTools(html) {
  return new Promise((resolve, reject) => pdf.create(html).toBuffer((err, buf) => (err ? reject(err) : resolve(buf))))
}

module.exports = async htmls => {
  const ret = []
  for (const html of htmls) {
    const buf = await myPdfTools(html[1])
    ret.push([html[0] + '.pdf', buf])
  }
  return ret
}
