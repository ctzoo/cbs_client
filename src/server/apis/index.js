const express = require('express')
const jwtMiddleware = require('express-jwt')
const jwt = require('jsonwebtoken')
const userDb = require('../storages/Users')

const router = express.Router()

router.use(
  jwtMiddleware({
    secret: 'cuitao_secret',
  }).unless(req => req.url === '/token')
)

router.use((err, req, res, next) => (err.name === 'UnauthorizedError' ? res.status(401).send('invalid token...') : next()))

router.post('/token', async (req, res, next) => {
  try {
    const user = req.body
    const suser = await userDb.get(user.username)
    if (suser.password === user.password) {
      res.json({ token: jwt.sign({ userId: user.username }, 'cuitao_secret') })
    } else {
      res.status(401).send('Username or Passwrod Error!')
    }
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(401).send('Username or Passwrod Error!')
    } else {
      next(err)
    }
  }
})

router.get('/test', (req, res) => {
  res.send('ok')
})

let users = [{ username: 'admin', password: 'admin' }, { username: 'cuitao', password: 'pwd' }]
const userRouter = express.Router()
router.use('/users', userRouter)
userRouter
  .route('/')
  .get((req, res, next) => {
    userDb
      .all()
      .then(us => res.json(us))
      .catch(next)
  })
  .post((req, res, next) => {
    userDb
      .put({ username: req.body.username, password: req.body.password })
      .then(() => res.sendStatus(200))
      .catch(next)
  })

userRouter
  .route('/:username')
  .get((req, res, next) => {
    userDb
      .get(req.params.username)
      .then(user => (user ? res.json(user) : res.sendStatus(404)))
      .catch(next)
  })
  .delete((req, res, next) => {
    userDb
      .del(req.params.username)
      .then(() => res.sendStatus(200))
      .catch(next)
  })
  .put((req, res, next) => {
    userDb
      .get(req.params.username)
      .then(user => (user ? userDb.put({ ...user, password: req.body.password }).then(() => res.sendStatus(200)) : res.sendStatus(404)))
      .catch(next)
  })
module.exports = router
