import React from 'react'
import { connect } from 'react-redux'
import { selector } from '../../redux/reducers'
import { usersReq, delUser } from '../../redux/actions'

export default connect(state => ({ users: selector.users(state) }), { usersReq, delUser })(
  class UsersList extends React.Component {
    constructor(props) {
      super(props)
      this.props.usersReq()
    }

    render() {
      const makeRow = user => (
        <tr key={user.username}>
          <td>{user.username}</td>
          <td>
            <button className="btn btn-primary" onClick={() => this.props.delUser(user.username)}>
              Delete
            </button>
          </td>
        </tr>
      )
      return (
        <table className="table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>{this.props.users.map(makeRow)}</tbody>
        </table>
      )
    }
  }
)
