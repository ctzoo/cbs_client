import 'bootstrap/dist/css/bootstrap.min.css'
import './my.css'
import React from 'react'
import { render } from 'react-dom'
import CbsEnquiry from './containers/CbsEnquiry'
import { Route, PrivateRoute } from 'react-router'
import LoginForm from './containers/LoginForm'
const container = document.getElementById('container')

render(<LoginForm />, container)
