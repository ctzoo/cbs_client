import React from 'react'
import fetch from 'axios'

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { username: '', password: '', error: '' }
    this.onUsernameChange = evt => this.setState({ username: evt.target.value })
    this.onPasswordChange = evt => this.setState({ password: evt.target.value })
    this.onSubmit = () => {
      fetch({ url: 'api/token', method: 'post', data: this.state })
        .then(res => {
          window.localStorage.setItem('token', res.data.token)

          fetch({ url: 'api/test', headers: { Authorization: 'Bearer ' + window.localStorage.getItem('token') } })
        })
        .catch(err => {
          this.setState({ error: err.response.data })
        })
    }
  }
  render() {
    return (
      <div>
        <div>
          <span>{this.state.error}</span>
        </div>
        <div>
          <label>Login Name</label>
          <input type="text" onChange={this.onUsernameChange} placeholder="Login Name" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" onChange={this.onPasswordChange} placeholder="Password" />
        </div>
        <div>
          <button onClick={this.onSubmit}>Login</button>
        </div>
      </div>
    )
  }
}
