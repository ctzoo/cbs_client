import { call, take, put, fork } from 'redux-saga/effects'
import fetch from 'axios'
import * as actions from './actions'
import axios from 'axios'

function login(username, password) {
  return fetch({ url: 'api/token', method: 'post', data: { username, password } })
    .then(res => ({ token: res.data.token }))
    .catch(err => ({ err: err.response.data }))
}

function* fetchSaga(fn, ...args) {
  yield put(actions.fetchBegin())
  const res = yield call(fn, ...args)
  yield put(actions.fetchEnd())
  return res
}

function* logoutSaga() {
  yield take(actions.logout)
  yield call(() => window.localStorage.removeItem('token'))
}
function* loginSaga() {
  while (true) {
    const {
      payload: { username, password },
    } = yield take(actions.loginReq.toString())
    const { err, token } = yield fetchSaga(login, username, password)
    if (err) {
      yield put(actions.loginErr(err))
    } else {
      yield call(() => window.localStorage.setItem('token', token))
      yield call(() => (axios.defaults.headers.common['Authorization'] = 'Bearer ' + token))
      yield put(actions.loginRes(token))
    }
  }
}

// function* validateToken() {
//   while (true) {
//     yield take(actions.validateToken.toString())
//     const token = yield call(() => window.localStorage.getItem('token'))
//     const isValid = yield call(validate, token)
//     if (isValid) {
//       yield put(actions.loginRes(null, token))
//     } else {
//       yield put(actions.loginErr(null))
//     }
//   }
// }

function* updateAxios() {
  const evt = yield take(actions.loginRes)
  yield call(() => (axios.defaults.headers.common['Authorization'] = 'Bearer ' + evt.payload))
}

export default function* root() {
  yield fork(loginSaga)
  yield fork(logoutSaga)
  yield fork(updateAxios)
}