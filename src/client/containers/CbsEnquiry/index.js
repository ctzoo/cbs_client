import React from 'react'
import io from 'socket.io-client'
import {
  BEGIN_UPLOAD_FILE_OK,
  SLICE_UPLOAD_FILE,
  SLICE_UPLOAD_FILE_OK,
  UPLOAD_COMPLETED,
  BEGIN_UPLOAD_FILE,
  SLICE_SIZE,
  ERROR,
  COMPLETED,
  VALIDATE_COMPLETED,
  BEGIN_PROC_WORKSHEET,
  ONE_RECORD_COMPLETED,
  WORKSHEET_COMPLETED,
  BEGIN_DOWNLOAD,
  BEGIN_DOWNLOAD_OK,
  SLICE_DOWNLOAD,
  SLICE_DOWNLOAD_OK,
  BOC_DTS_COMPLETED,
  ERROR_REPORT_COMPLETED,
  BEGIN_PROC_PDF,
  ONE_PDF_COMPLETED,
} from '../../../consts'
import { Logger, logger } from '../Logger'
import { connect } from 'react-redux'
import { selector } from '../../redux/reducers'

export default connect(state => ({
  token: selector.token(state)
}))(
  class CbsEnquiry extends React.Component {
    constructor(props) {
      super(props)
      const state = {
        filePath: '选择文件...',
        inputDisabled: false,
      }
      this.state = state
      this.onFileChange = evt => {
        this.setState({ inputDisabled: true })
        if (evt.target.files.length === 0) {
          this.setState(state)
        } else {
          const file = evt.target.files[0]
          this.setState({ filePath: file.name })
          this.sendFile(
            file,
            progress => this.setState({ progress }),
            zipAs => {
              this.setState({ inputDisabled: false })
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              const blob = new Blob(zipAs, { type: 'octet/stream' })
              const url = window.URL.createObjectURL(blob)
              a.href = url
              a.download = 'cbs.zip'
              a.click()
              window.URL.revokeObjectURL(url)
              document.body.removeChild(a)
            },
            () => {
              this.setState({ inputDisabled: false })
            }
          )
        }
        evt.target.value = ''
      }
    }

    sendFile(file, progressChangeCb, completeCb, errorCb) {
      logger.clear()
      const socket = io('/cbs_enquiry', {
        'query': 'token=' + this.props.token
      })

      const sliceCount = Math.ceil(file.size / SLICE_SIZE)
      let currentSlice = 0

      const zipAs = []

      logger.log('begin upload file: ' + file.name)
      socket.emit(BEGIN_UPLOAD_FILE, { name: file.name, type: file.type, size: file.size })
      const sendSliceData = () => {
        const blob = file.slice(currentSlice * SLICE_SIZE, ++currentSlice * SLICE_SIZE)
        const reader = new FileReader()
        reader.readAsArrayBuffer(blob)
        reader.onload = () => {
          socket.emit(SLICE_UPLOAD_FILE, { data: reader.result })
        }
      }
      // 后台用户token验证失败时回复error事件
      socket.on('error', err => {
        socket.close()
        errorCb(err)
        if (err.type == 'UnauthorizedError' || err.code == 'invalid_token') {
          logger.err('Login Again Please！')
        } else {
          logger.err(err)
        }
      })
      socket.on(BEGIN_UPLOAD_FILE_OK, () => {
        logger.log('upload file progress 0%')
        sendSliceData()
      })
      socket.on(SLICE_UPLOAD_FILE_OK, () => {
        sendSliceData()
        progressChangeCb(currentSlice * 100 / sliceCount)
        logger.relog('upload file progress ' + currentSlice * 100 / sliceCount + '%')
      })
      socket.on(UPLOAD_COMPLETED, () => {
        logger.log('upload file completed!')
      })
      socket.on(COMPLETED, () => {
        logger.log('completed!')
        socket.close()
        completeCb(zipAs)
      })
      socket.on(ERROR, msg => {
        socket.close()
        errorCb(msg)
        logger.err(msg)
      })
      socket.on(VALIDATE_COMPLETED, () => {
        logger.log('validate completed!')
      })
      socket.on(BEGIN_PROC_WORKSHEET, msg => {
        logger.log('proccess worksheet: ' + msg.name)
        logger.log('progress: 0/' + msg.count)
      })
      socket.on(ONE_RECORD_COMPLETED, msg => {
        logger.relog('progress: ' + msg.completedCount + '/' + msg.count)
      })
      socket.on(WORKSHEET_COMPLETED, msg => {
        logger.log('worksheet ' + msg.name + ' completed!')
      })
      socket.on(BEGIN_DOWNLOAD, evt => {
        logger.log('begin download file, total size: ' + evt.size)
        logger.log('progress: ' + 0 + '/' + evt.size)
        socket.emit(BEGIN_DOWNLOAD_OK)
      })
      socket.on(SLICE_DOWNLOAD, evt => {
        logger.relog('progress: ' + evt.completedSize + '/' + evt.size)
        zipAs.push(evt.data)
        socket.emit(SLICE_DOWNLOAD_OK)
      })
      socket.on(BOC_DTS_COMPLETED, () => {
        logger.log('generate BOC DTS completed!')
      })
      socket.on(ERROR_REPORT_COMPLETED, () => {
        logger.log('generate error report completed! ')
      })
      socket.on(BEGIN_PROC_PDF, msg => {
        logger.log('proccess PDF')
        logger.log('progress: 0/' + msg.count)
      })
      socket.on(ONE_PDF_COMPLETED, msg => {
        logger.relog('progress: ' + msg.completedCount + '/' + msg.count)
      })
    }

    render() {
      return (
        <div>
          <div className="custom-file">
            <input type="file" className="custom-file-input" onChange={this.onFileChange} disabled={this.state.inputDisabled} />
            <label className="custom-file-label">{this.state.filePath}</label>
          </div>
          <Logger />
        </div>
      )
    }
  }
)