const pdf = require('html-pdf')

function myPdfTools(html) {
  return new Promise((resolve, reject) =>
    pdf
      .create(html, {
        format: 'A3',
        width: '500mm',
        height: '900mm',
      })
      .toBuffer((err, buf) => (err ? reject(err) : resolve(buf)))
  )
}

module.exports = async htmls => {
  const ret = []
  for (const html of htmls) {
    const buf = await myPdfTools(html[1])
    ret.push([html[0] + '.pdf', buf])
  }
  return ret
}
