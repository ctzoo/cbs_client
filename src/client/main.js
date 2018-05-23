import 'regenerator-runtime/runtime'
import 'bootstrap/dist/css/bootstrap.min.css'
import './my.css'
import React from 'react'
import { render } from 'react-dom'
import CbsEnquiry from './containers/CbsEnquiry'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import store from './redux/store'
import { selector } from './redux/reducers'
import LoginForm from './containers/LoginForm'
import CbsConfig from './containers/CbsConfig'
import Logout from './containers/Logout'
import UserManager from './containers/UserManager'

import { loginRes, logout } from './redux/actions'

function initToken() {
  const token = window.localStorage.getItem('token')
  if (token) {
    store.dispatch(loginRes(token))
  }
}

initToken()

window.lo = () => store.dispatch(logout())
const container = document.getElementById('container')

const PrivateRoute = connect(s => ({ isLogin: selector.isLogin(s) }))(({ component: Component, isLogin, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLogin ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
))

const routes = (
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <PrivateRoute path="/home" component={UserManager} />
        <PrivateRoute path="/def" component={CbsConfig} />
        <PrivateRoute path="/abc" component={CbsEnquiry} />
        <Route path="/login" component={LoginForm} />
        <Route path="/logout" component={Logout} />
        <Redirect from="/" to="/home" />
      </Switch>
    </HashRouter>
  </Provider>
)
render(routes, container)
