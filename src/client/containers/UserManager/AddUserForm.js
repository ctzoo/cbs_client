import React from 'react'
import { connect } from 'react-redux'
import { selector } from '../../redux/reducers'
import { addUser } from '../../redux/actions'

export default connect(state => ({ fetching: selector.fetchStatus(state) }), { addUser })(
  class AddUserForm extends React.Component {
    constructor(props) {
      super(props)
      this.state = { username: '', password: '' }
      this.onSubmit = e => {
        e.preventDefault()
        this.setState({ username: '', password: '' })
        this.props.addUser(this.state.username, this.state.password)
      }
      this.onUsernameChange = e => this.setState({ username: e.target.value })
      this.onPasswordChange = e => this.setState({ password: e.target.value })
    }
    render() {
      return (
        <form onSubmit={this.onSubmit}>
          <fieldset disabled={this.props.fetching}>
            <div className="input-group mb-3">
              <input className="form-control" value={this.state.username} onChange={this.onUsernameChange} type="text" placeholder="User Name" />
              <input className="form-control" value={this.state.password} onChange={this.onPasswordChange} type="text" placeholder="Password" />
              <div className="input-group-append">
                <input className="btn btn-primary" type="submit" value="Add" />
              </div>
            </div>
          </fieldset>
        </form>
      )
    }
  }
)
