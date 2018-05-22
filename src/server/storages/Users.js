const level = require('level')

db = level('./users_storage')

db.get('admin', (err, value) => {
  if (err && err.name == 'NotFoundError') {
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
      stream.on('data', user => sets.push(JSON.parse(user)))
      stream.on('end', () => resolve(sets))
      stream.on('error', err => reject(err))
    })
  },
}
