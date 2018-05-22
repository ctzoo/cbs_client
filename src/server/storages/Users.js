const level = require('level')

const db = level('./storage_users')

db.get('admin', err => {
  if (err && err.notFound) {
    db.put('s_admin', JSON.stringify({ username: 'admin', password: 'admin' }), () => {})
  }
})

module.exports = {
  get(username) {
    return new Promise((resolve, reject) => {
      const key = username === 'admin' ? 's_admin' : 'u_' + username
      db.get(key, (err, value) => {
        if (err) {
          if (err.name === 'NotFoundError') {
            resolve()
          } else {
            reject(err)
          }
        } else {
          resolve(JSON.parse(value))
        }
      })
    })
  },
  put(user) {
    return new Promise((resolve, reject) => {
      const key = user.username === 'admin' ? 's_admin' : 'u_' + user.username
      db.put(key, JSON.stringify(user), err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  del(username) {
    return db.del('u_' + username)
  },
  all() {
    return new Promise((resolve, reject) => {
      const stream = db.createValueStream()
      const sets = []
      stream.on('data', user => {
        const ou = JSON.parse(user)
        if (ou.username !== 'admin') {
          sets.push(ou)
        }
      })
      stream.on('end', () => resolve(sets))
      stream.on('error', err => reject(err))
    })
  },
}
