import React from 'react'

export default class AddUserForm extends React.Component {
  render() {
    return (
      <form>
        <fieldset>
          <div className="row">
            <div className="col">
              <input type="text" className="form-control" />
            </div>
            <div className="col">
              <input type="password" className="form-control" />
            </div>
            <div className="col">
              <input className="btn btn-primary form-control" type="submit" value="Add" />
            </div>
          </div>
        </fieldset>
      </form>
    )
  }
}
