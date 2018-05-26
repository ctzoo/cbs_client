import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Link } from 'react-router-dom'
import { selector } from '../../redux/reducers'
import CbsConfig from '../CbsConfig'
import CbsEnquiry from '../CbsEnquiry'
import UserManager from '../UserManager'

export default connect(state => ({
  user: selector.user(state),
}))(
  class Home extends React.Component {
    constructor(props) {
      super(props)
    }

    adminUI() {
      return (
        <div>
          <h4>System Manager</h4>
        </div>
      )
    }

    userUI() {
      return <div>user</div>
    }

    headUI() {
      return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
          <a className="navbar-brand" href="#">
            CBS Enquiry
          </a>
          <div className="navbar-collapse">
            <div className="navbar-nav mr-auto">{this.getNavbarItems()}</div>
            <div>
              <span className="p-2">{this.props.user.userId}</span>
              <Link className="p-2" to={'/logout'}>
                logout
              </Link>
            </div>
          </div>
        </nav>
      )
    }

    getNavbarItems() {
      const { path } = this.props.match
      if (this.props.user.isAdmin) {
        return (
          <React.Fragment>
            <Link className={'nav-item nav-link'} to={path}>
              CBS Config
            </Link>
            <Link className="nav-item nav-link" to={path + '/users'}>
              Users
            </Link>
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment>
            <Link className={'nav-item nav-link'} to={path}>
              CBS Enquiry
            </Link>
          </React.Fragment>
        )
      }
    }

    getSwitch() {
      const { path } = this.props.match
      if (this.props.user.isAdmin) {
        return (
          <Switch>
            <Route path={`${path}`} exact component={CbsConfig} />
            <Route path={`${path}/users`} component={UserManager} />
          </Switch>
        )
      } else {
        return (
          <Switch>
            <Route path={`${path}`} exact component={CbsEnquiry} />
          </Switch>
        )
      }
    }

    render() {
      return (
        <div className="container">
          {this.headUI()}
          {this.getSwitch()}
        </div>
      )
    }
  }
)
