import React from 'react'
import AddUserForm from './AddUserForm'
import UsersList from './UsersList'

export default class UserManager extends React.Component {
  render() {
    return (
      <div>
        <AddUserForm />
        <UsersList />
      </div>
    )
  }
}
