const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt')
const localStrategy = require('passport-local').Strategy
const keys = require('../config/keys')
const userModel = require('../models/user')
const bcrypt = require('bcrypt')

// create jwt strategy to read token and (authrize to user inter protected links)
passport.use(new JwtStrategy({
  // 1)where the token will be contained .
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  // 2) the secret
  secretOrKey: keys.jwtSecret
  // secretOrKey: keys.jwtSecret
},
  async (payload, done) => {
    try {
      // 1)find user of specific token  (user_id come from jwt.sign from function signup )
      const user = await userModel.findById(payload.user_id)
      // 2)find user dosen't  exist
      if (!user) {
        return done(null, false)
      }
      // 3)   return user 
      done(null, user)
    } catch (errot) {
      return done(null, false)
    }


  }))
// Local Strategy ti signin functionality 
passport.use(new localStrategy(
  {
    usernameField: 'email'
  },
  async (email, password, done) => {

    try {
      //  check if user given email 
      const user = await userModel.findOne({ email })
      if (!user) {
        return done(null, false)
      }
      // check password is correct 
      // const isMatch = await userModel.isValidPassword(password);
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) { return done(null, false) } // done like next , if here I don't write return so he will go to : done(null,user)
      if (!isMatch) {
        return done(null, false)
      }
      done(null, user)
    } catch (error) {
      done(error, false)
    }
  }));
