// // const { pkg } = require('./cbs-pkg')

// // console.log(pkg(require('fs').readFileSync('C:/Users/cuita/Documents/a/Book1.xlsx'))[0][1][0])

// const a = require('./cbs')
// const fs = require('fs')
// const b1 = fs.readFileSync('./a.xlsx')
// // const b2 = fs.readFileSync('./b.xlsx')
// const res = fs.readFileSync('./a.xml', 'utf8')
// // a(b2, (evtType, msg) => console.log(evtType, msg)).catch(console.log)
// a(b1, (evtType, msg) => console.log(evtType, msg), async pkg => res)
//   .then(htmls => {
//     const AdmZip = require('adm-zip')
//     const zip = new AdmZip()
//     htmls.forEach(h => {
//       zip.addFile(h[0] + '.html', Buffer.from(h[1], 'utf8'))
//     })
//     zip.writeZip('./dist/a.zip')
//   })
//   .catch(console.log)

// // const aa = [1, 2]
// // aa.concat(aa)
// // console.log(aa)

const jwt = require('jsonwebtoken')
const s = jwt.sign(
  {
    exp: Math.floor(Date.now() / 1000) + 1,
    data: 'foobar',
  },
  'secret'
)
console.log(s)
console.log(
  jwt.decode(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MjY4ODc0NDgsImRhdGEiOiJmb29iYXIiLCJpYXQiOjE1MjY4ODc0NDd9.ASqAzfRdRFP1tLRlr_bdoAc7EpGIjlyhjQQD0BmufxY'
  )
)
console.log(
  jwt.verify(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MjY4ODc0NDgsImRhdGEiOiJmb29iYXIiLCJpYXQiOjE1MjY4ODc0NDd9.ASqAzfRdRFP1tLRlr_bdoAc7EpGIjlyhjQQD0BmufxY',
    'secret'
  )
)
