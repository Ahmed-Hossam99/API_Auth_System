const jwt = require('jsonwebtoken')
const keys = require('../config/keys')


exports.isAuth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    try {
      var authData = jwt.verify(token, keys.jwtSecret)
      req.user = authData.user
      next()
    } catch (err) {
      res.json(err)
    }
  } else {
    res.status(403).json({
      msg: "FOR bidden"
    })
  }
}