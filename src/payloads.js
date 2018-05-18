import { BEGIN_UPLOAD_FILE, SLICE_UPLOAD_FILE, BEGIN_UPLOAD_FILE_OK, SLICE_UPLOAD_FILE_OK, UPLOAD_COMPLETE } from './consts'

export const beginUploadFile = (name, size) => ({ type: BEGIN_UPLOAD_FILE, payload: { name, size } })
export const beginUploadfileOk = () => ({ type: BEGIN_UPLOAD_FILE_OK })
export const sliceUploadFile = (slice, data) => ({ type: SLICE_UPLOAD_FILE, payload: { slice, data } })
export const sliceUploadFileOk = () => ({ type: SLICE_UPLOAD_FILE_OK })
export const uploadFileComplete = () => ({ type: UPLOAD_COMPLETE })
