import React from 'react'
import { connect } from 'react-redux'
import { logout } from '../redux/actions'
import { Redirect } from 'react-router-dom'

export default connect(null, { logout })(props => {
  props.logout()
  return <Redirect to="/login" />
})
