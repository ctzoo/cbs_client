import React from 'react'
import { connect } from 'react-redux'
import { updateUser } from '../../redux/actions'
import { selector } from '../../redux/reducers'

export default connect(state => ({
  fetching: selector.fetchStatus(state),
  user: selector.user(state),
}), { updateUser })(
  class ChgPwdForm extends React.Component {
    constructor(props) {
      super(props)
      this.state = { password: '', confirmPassword: '' }
      this.onSubmit = e => {
        e.preventDefault()
        if (this.state.password && this.state.password === this.state.confirmPassword) {
          this.setState({ password: '', confirmPassword: '' })
          this.props.updateUser(this.props.user.userId, this.state.password)
        } else {
          alert('Password confirmation error')
        }
      }
    } 

    render() {
      return (
        <form onSubmit={this.onSubmit}>
          <fieldset disabled={this.state.fetching}>
            <div className="form-group">
              <label htmlFor="password">New password</label>
              <input type="password" className="form-control"
                id="newPassword" value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}/>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm new password</label>
              <input type="password" className="form-control"
                id="confirmPassword" value={this.state.confirmPassword}
                onChange={e => this.setState({ confirmPassword: e.target.value })}/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </fieldset>
        </form>
      )
    }
  }
)