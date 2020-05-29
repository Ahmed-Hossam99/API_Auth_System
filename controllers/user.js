const bcrypt = require('bcrypt')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const cloud = require('../services/cloudinary')
const userModel = require('../models/user')


signToken = user => {
  return jwt.sign({
    user_id: user.id,
    expiresIn: "1d",
  }, keys.jwtSecret);
}
exports.signUp = async (req, res, next) => {
  try {
    // check if user is exist
    const user = await userModel.findOne({ "local.email": req.body.email })
    if (user) {
      return res.status(403).json({ // 403 meaning forbidden req because user exist
        message: 'email already exist !!'
      })
    }
    else {
      let result
      if (req.file) {
        console.log('one file')
        result = await cloud.uploads(req.file.path)
        console.log(result)
        fs.unlinkSync(req.file.path)
      }

      newUser = new userModel({
        method: 'local',
        local: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          profile: {
            profUrl: result === undefined ? 'http://res.cloudinary.com/hossam99/image/upload/v1590712258/zcv2aan8gufzbrfjfwc6.webp' : result.url,
            profId: result === undefined ? 'zcv2aan8gufzbrfjfwc6' : result.id
          }

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
    console.log(error)

    res.json({ error })
  }
}

//  signIn function
exports.signIn = async (req, res, next) => {
  // validation done from passport file 
  const token = signToken(req.user)
  res.status(200).json({ token })
}


exports.OAuthToken = async (req, res, next) => {
  // validation done from passport file 
  console.log(req.user)
  const user = req.user
  const token = signToken(req.user)
  res.status(200).json({ token, user })
}


exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(403).json({
        message: 'user not exist !!'
      })
    } else {
      if (req.body.name) {
        user.local.name = req.body.name
      }

      if (req.body.password) {
        user.local.password = req.body.password
      }
      if (req.file) {
        let result
        console.log('one file')
        result = await cloud.uploads(req.file.path)
        console.log(result)
        user.local.profile.profUrl = result.url
        user.local.profile.profId = result.Id
        fs.unlinkSync(req.file.path)

      }

      await user.save()
      res.status(200).json({
        user,
        message: "updated user done !!"
      })
    }
  } catch (error) {
    res.json.error
  }
}



// secret function
exports.secret = async (req, res, next) => {
  res.json({
    msg: "Welcome from Auth",
    user: req.user
  })
}





