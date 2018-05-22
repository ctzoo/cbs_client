import { createStore, applyMiddleware } from 'redux'
import rootSaga from './sagas'
import reducers from './reducers'
import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducers, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)
export default store
