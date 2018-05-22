import React from 'react'
import fetch from 'axios'
import { connect } from 'react-redux'
import './login-form.css'
import { Link, Redirect } from 'react-router-dom'
import { selector } from '../../redux/reducers'
import { loginReq } from '../../redux/actions'

class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.user = {}
    this.onUsernameChange = evt => (this.user.username = evt.target.value)
    this.onPasswordChange = evt => (this.user.password = evt.target.value)

    this.onSubmit = e => {
      e.preventDefault()
      this.props.loginReq(this.user.username, this.user.password)
    }
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    if (this.props.isLogin) {
      return <Redirect to={from} />
    }
    // if (this.props.loginStatus.validating) {
    //   return <div />
    // }
    return (
      <div className="login-form">
        <form onSubmit={this.onSubmit}>
          <fieldset disabled={this.props.fetching}>
            <h4 className="text-center">Login Form</h4>
            <div>
              <span>{this.props.err}</span>
            </div>
            <div className="form-group">
              <input type="text" className="form-control" onChange={this.onUsernameChange} placeholder="Login Name" required autoFocus />
            </div>
            <div className="form-group">
              <input type="password" className="form-control" onChange={this.onPasswordChange} placeholder="Password" required />
            </div>
            <div className="form-group">
              <input type="submit" className="btn btn-primary form-control" value="Login" />
            </div>
          </fieldset>
        </form>
      </div>
    )
  }
}
export default connect(s => ({ fetching: selector.fetchStatus(s), err: selector.err(s), isLogin: selector.isLogin(s) }), { loginReq })(LoginForm)
