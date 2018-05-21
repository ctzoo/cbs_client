const express = require('express')
const jwtMiddleware = require('express-jwt')
const jwt = require('jsonwebtoken')

const router = express.Router()
router.use(
  jwtMiddleware({
    secret: 'cuitao_secret',
  }).unless(req => req.url === '/token')
)

router.use((err, req, res, next) => (err.name === 'UnauthorizedError' ? res.status(401).send('invalid token...') : next()))
router.post('/token', (req, res) => {
  const user = req.body
  if (user) {
    res.json({ token: jwt.sign({ userId: user.username }, 'cuitao_secret') })
  } else {
    res.json({ token: jwt.sign({ userId: 'abc' }, 'cuitao_secret') })
  }
})

router.get('/test', (req, res) => {
  res.json({ msg: 'Hello!' })
})
module.exports = router
