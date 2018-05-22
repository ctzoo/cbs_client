import { createAction } from 'redux-act'

export const fetchBegin = createAction('FETCH_BEGIN')
export const fetchEnd = createAction('FETCH_END')
export const loginReq = createAction('LOGIN_REQ', (username, password) => ({ username, password }))
export const loginRes = createAction('LOGIN_RES')
export const loginErr = createAction('LOGIN_ERR')
export const logout = createAction('LOGOUT')
