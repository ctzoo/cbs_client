process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const express = require('express')
const http = require('http')
const helmet = require('helmet')
const socketIo = require('socket.io')
const cbs = require('./cbs')
const cbsFetch = require('./cbs-fetch')
const AdmZip = require('adm-zip')
const fs = require('fs')
const path = require('path')
// TODO:
// const socketIoJwt = require('socketio-jwt')
const bodyParser = require('body-parser')
const apiRouter = require('./apis')
// eslint-disable-next-line
const bootstrapBuf = fs.readFileSync(path.join(__dirname, 'bootstrap.min.css'))
const logger = require('./logger')('server')

const {
  BEGIN_UPLOAD_FILE,
  BEGIN_UPLOAD_FILE_OK,
  SLICE_UPLOAD_FILE,
  UPLOAD_COMPLETED,
  ERROR,
  SLICE_SIZE,
  SLICE_UPLOAD_FILE_OK,
  COMPLETED,
  BEGIN_DOWNLOAD,
  BEGIN_DOWNLOAD_OK,
  SLICE_DOWNLOAD,
  SLICE_DOWNLOAD_OK,
} = require('../consts')

const app = express()
const httpServer = http.Server(app)
const io = socketIo(httpServer)

const staticFileDir = path.join(process.cwd(), process.argv[2])
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(staticFileDir))
app.use('/api', apiRouter)
io.of('cbs_enquiry').on('connection', socket => {
  // TODO:
  // eslint-disable-next-line
  let name, currentSlice, sliceCount
  const buffers = []
  socket.on(BEGIN_UPLOAD_FILE, evt => {
    if (evt.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      socket.emit(ERROR, '文件类型错误，文件必须是xlsx')
    } else {
      name = evt.name
      currentSlice = 0
      sliceCount = Math.ceil(evt.size / SLICE_SIZE)
      socket.emit(BEGIN_UPLOAD_FILE_OK)
    }
  })
  socket.on(SLICE_UPLOAD_FILE, evt => {
    currentSlice++
    buffers.push(evt.data)

    if (currentSlice === sliceCount) {
      socket.emit(UPLOAD_COMPLETED)
      const buffer = Buffer.concat(buffers)
      cbs(buffer, (evtType, msg) => socket.emit(evtType, msg), cbsFetch)
        .then(ret => {
          const zip = new AdmZip()
          // zip.addFile('bootstrap.min.css', bootstrapBuf)
          // ret.htmls.forEach(h => {
          //   zip.addFile(h[0] + '.html', Buffer.from(h[1].replace('{css-style}', bootstrapBuf), 'utf-8'))
          // })
          ret.pdfs.forEach(p => zip.addFile(p[0], p[1]))
          ret.txts.forEach(t => {
            zip.addFile(t[0], Buffer.from(t[1], 'utf-8'))
          })
          if (ret.err) {
            zip.addFile('errors.txt', Buffer.from(ret.err, 'utf-8'))
          }
          const zipBuffer = zip.toBuffer()
          const count = Math.ceil(zipBuffer.length / SLICE_SIZE)
          let currentSlice = 0
          const sendSliceData = () => {
            const cs = currentSlice * SLICE_SIZE
            const blob = zipBuffer.slice(cs, ++currentSlice * SLICE_SIZE)
            socket.emit(SLICE_DOWNLOAD, { data: blob, size: zipBuffer.length, completedSize: cs + blob.length })
          }
          socket.emit(BEGIN_DOWNLOAD, { size: zipBuffer.length })
          socket.on(BEGIN_DOWNLOAD_OK, () => {
            sendSliceData()
          })
          socket.on(SLICE_DOWNLOAD_OK, () => {
            if (currentSlice !== count) {
              sendSliceData()
            } else {
              socket.emit(COMPLETED)
            }
          })
        })
        .catch(err => {
          logger.error(err)
          socket.emit(ERROR, err.toString())
        })
    } else {
      socket.emit(SLICE_UPLOAD_FILE_OK)
    }
  })
})

httpServer.listen(3000, err => {
  if (err) {
    logger.error(err)
  } else {
    logger.info('started')
  }
})
