import 'bootstrap/dist/css/bootstrap.min.css'
import './my.css'
import React from 'react'
import { render } from 'react-dom'
import CbsEnquiry from './containers/CbsEnquiry'
import { Route, PrivateRoute } from 'react-router'
const container = document.getElementById('container')

render(<CbsEnquiry />, container)
