import React from 'react'
import { createStore } from 'redux'
import { createAction, createReducer } from 'redux-act'
import { connect, Provider } from 'react-redux'
export const newLog = createAction()
export const relog = createAction()
export const clearLog = createAction()

export const logReducer = createReducer(
  {
    [newLog]: (state, payload) => [...state, payload],
    [relog]: (state, payload) => [...state.slice(0, state.length - 1), payload],
    [clearLog]: () => [],
  },
  []
)

export const store = createStore(logReducer)

export const logger = {
  log: msg => store.dispatch(newLog({ lev: 'log', msg })),
  relog: msg => store.dispatch(relog({ lev: 'log', msg })),
  err: msg => store.dispatch(newLog({ lev: 'err', msg })),
  clear: () => store.dispatch(clearLog()),
}

const LoggerT = connect(state => ({ logs: state }))(props => (
  <div>
    {props.logs.map((msg, i) => (
      <div key={i}>
        <strong>{msg.lev == 'err' ? 'ERROR: ' : 'INFO: '}</strong>
        <span style={{ whiteSpace: 'pre' }}>{msg.msg}</span>
      </div>
    ))}
  </div>
))

export const Logger = () => (
  <Provider store={store}>
    <LoggerT />
  </Provider>
)
