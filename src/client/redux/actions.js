import { createAction } from 'redux-act'

export const fetchBegin = createAction('FETCH_BEGIN')
export const fetchEnd = createAction('FETCH_END')
export const loginReq = createAction('LOGIN_REQ', (username, password) => ({ username, password }))
export const loginRes = createAction('LOGIN_RES')
export const loginErr = createAction('LOGIN_ERR')
export const logout = createAction('LOGOUT')

export const addUser = createAction('ADD_USER', (username, password) => ({ username, password }))
export const delUser = createAction('DEL_USER')
export const updateUser = createAction('UPDATE_USER', (username, password) => ({ username, password }))
export const usersReq = createAction('USERS_REQ')
export const users = createAction('USERS')

export const chgPwd = createAction('CHG_PWD', (username, password) => ({ username, password }))
