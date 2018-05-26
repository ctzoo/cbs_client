import { createReducer } from 'redux-act'
import * as actions from './actions'
import { combineReducers } from 'redux'
import * as jwt from 'jsonwebtoken'

export const loginReducer = createReducer(
  {
    [actions.loginRes]: (s, t) => ({ user: jwt.decode(t), token: t, isLogin: true, err: null }),
    [actions.loginErr]: (s, err) => ({ user: null, token: null, err, isLogin: false }),
    [actions.logout]: () => ({ user: null, token: null, err: null, isLogin: false }),
  },
  { user: null, token: null, err: null, isLogin: false }
)

export const fetchStatusReducer = createReducer(
  {
    [actions.fetchBegin]: () => true,
    [actions.fetchEnd]: () => false,
  },
  false
)

export const usersReducer = createReducer(
  {
    [actions.users]: (s, users) => users,
  },
  []
)

export const selector = {
  token: s => s.login.token,
  user: s => s.login.user,
  isLogin: s => s.login.isLogin,
  err: s => s.login.err,
  fetchStatus: s => s.fetchStatus,
  users: s => s.users,
}

export default combineReducers({
  login: loginReducer,
  fetchStatus: fetchStatusReducer,
  users: usersReducer,
})
