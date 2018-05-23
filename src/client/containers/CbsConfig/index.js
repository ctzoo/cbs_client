import React from 'react'
import fetch from 'axios'

const nametools = str => {
  const s = str.replace(/([A-Z])/g, ' $1')
  return s[0].toUpperCase() + s.slice(1)
}
const fields = ['cbsUrl', 'username', 'password', 'clientId', 'userId']

export default class CbsConfig extends React.Component {
  constructor(props) {
    super(props)
    this.state = { fetching: true, config: {} }
    this.onSubmit = e => {
      e.preventDefault()
      this.setState({ fetching: true })
      fetch('api/cbs-config', { method: 'PUT', data: this.state.config }).then(() => this.setState({ fetching: false }))
    }
    fetch('api/cbs-config')
      .then(res => {
        this.setState({ config: res.data, fetching: false })
      })
      .catch(err => {
        if (err.response.status == 403) {
          props.history.push('/logout')
        }
      })
  }

  render() {
    return (
      <form className="container" onSubmit={this.onSubmit}>
        <h4 className="text-center">CBS Config</h4>
        <fieldset disabled={this.state.fetching}>
          {fields.map(f => (
            <div key={f} className="form-group">
              <input
                className="form-control"
                value={this.state.config[f] || ''}
                onChange={e => this.setState({ config: { ...this.state.config, [f]: e.target.value } })}
                placeholder={nametools(f)}
              />
            </div>
          ))}
          <div className="form-group">
            <input type="submit" className="btn btn-primary form-control" value="Save" />
          </div>
        </fieldset>
      </form>
    )
  }
}
