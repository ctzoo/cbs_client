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
  try {
    const res = yield call(fn, ...args)
    return res
  } catch (e) {
    yield call(alert, e.message)
  } finally {
    yield put(actions.fetchEnd())
  }
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

function* updateAxios() {
  const evt = yield take(actions.loginRes)
  yield call(() => (axios.defaults.headers.common['Authorization'] = 'Bearer ' + evt.payload))
}

function* postUserSaga() {
  const putUser = (username, password) => fetch('api/users', { method: 'post', data: { username, password } })
  while (true) {
    const {
      payload: { username, password },
    } = yield take(actions.addUser.toString())

    yield fetchSaga(putUser, username, password)
    yield put(actions.usersReq())
  }
}

function* putUserSaga() {
  const putUser = (username, password) => fetch(`api/users/${username}`, { method: 'put', data: { username, password } })
  while (true) {
    const {
      payload: { username, password },
    } = yield take(actions.updateUser.toString())
    yield fetchSaga(putUser, username, password)
    yield put(actions.usersReq())
  }
}

function* delUserSaga() {
  const delUser = username => fetch(`api/users/${username}`, { method: 'delete' })
  while (true) {
    const { payload: username } = yield take(actions.delUser)
    yield fetchSaga(delUser, username)
    yield put(actions.usersReq())
  }
}

function* fetchUsersSaga() {
  const users = () => fetch('api/users').then(res => res.data)
  while (true) {
    yield take(actions.usersReq)
    const data = yield fetchSaga(users)
    yield put(actions.users(data))
  }
}

function* usermanagerSaga() {
  yield fork(postUserSaga)
  yield fork(putUserSaga)
  yield fork(delUserSaga)
  yield fork(fetchUsersSaga)
}

export default function* root() {
  yield fork(loginSaga)
  yield fork(logoutSaga)
  yield fork(updateAxios)
  yield* usermanagerSaga()
}
