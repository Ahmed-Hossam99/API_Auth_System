const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const { validationResult } = require('express-validator');
const userModel = require('../models/user')

signToken = user => {
  return jwt.sign({
    user_id: user.id,
    expiresIn: "1d",
  }, keys.jwtSecret);
}
exports.signUp = async (req, res, next) => {
  try {
    // check validation result 
    const errors = await validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // check if user is exist
    const user = await userModel.findOne({ "local.email": req.body.email })
    if (user) {
      return res.status(403).json({ // 403 meaning forbidden req because user exist
        message: 'email already exist !!'
      })
    }
    else {
      newUser = new userModel({
        method: 'local',
        local: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        },

      })
      const userData = await newUser.save();
      const token = signToken(userData);
      res.status(201).json({
        userData,
        token,

      })
    }
  } catch (error) {
    res.json({ error })
  }
}

//  signIn function
exports.signIn = async (req, res, next) => {
  // validation done from passport file 
  const token = signToken(req.user)
  res.status(200).json({ token })
}

exports.googleoAuth = async (req, res, next) => {
  // validation done from passport file 
  console.log(req.user)
  const user = req.user
  const token = signToken(req.user)
  res.status(200).json({ token, user })
}



// secret function
exports.secret = async (req, res, next) => {
  res.json({
    msg: "Welcome from Auth",
    user: req.user
  })
}





