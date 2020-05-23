const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const { validationResult } = require('express-validator');
const userModel = require('../models/user')


exports.signUp = async (req, res, next) => {
  try {
    // check validation result 
    const errors = await validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });

    }
    // check if user is exist
    const user = await userModel.findOne({ email: req.body.email })
    if (user) {
      return res.status(403).json({ // 403 meaning forbidden req because user exist
        message: 'email already exist !!'
      })
    }
    else {
      // encrypt password
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(req.body.password, salt);
      // create User 
      newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      const userData = await newUser.save();
      res.status(201).json({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        request: {
          type: 'DELETE',
          url: 'http://localhost:3000/users/' + userData._id
        }
      })
    }

  } catch (error) {
    res.json({ error })
  }

}
//  signIn function

exports.signIn = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email })
  if (!user) {
    return res.status(401).json({
      message: 'eamil not found'
    })
  }
  else {
    const matchPassword = await bcrypt.compare(req.body.password, user.password)
    if (!matchPassword) {
      return res.status(401).json({//401 to un Auth status
        message: 'password not match  !!'
      })
    }
    else {
      let token = jwt.sign({ user }, keys.jwtSecret, { expiresIn: "1h" })
      return res.status(201).json({
        message: ' Auth successFull !!',
        token: token
      })
    }
  }
}





// secret function
exports.secret = async (req, res, next) => {

  res.json({
    msg: "Welcome from Auth",
    userId: req.user._id,
    user: req.user
  })
}

