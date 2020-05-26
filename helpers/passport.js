const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt')
const localStrategy = require('passport-local').Strategy
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const keys = require('../config/keys')
const userModel = require('../models/user')
const bcrypt = require('bcrypt')

// create jwt strategy to read token and (authrize to user inter protected links)
passport.use(new JwtStrategy({
  // 1)where the token will be contained .
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  // 2) the secret
  secretOrKey: keys.jwtSecret
},
  async (payload, done) => {
    try {
      // 1)find user of specific token  (user_id come from jwt.sign from function signup )
      const user = await userModel.findById(payload.user_id)
      if (!user) {
        return done(null, false)
      }
      done(null, user)
    } catch (errot) {
      return done(null, false)
    }
  }))



// pasport facebook OAuth strategy
passport.use('facebookToken', new FacebookTokenStrategy(
  {
    clientID: keys.facebookClientID,
    clientSecret: keys.facebookClientSecret
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('profile', profile);
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);

      const existingUser = await userModel.findOne({ "facebook.id": profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = new userModel({
        method: 'facebook',
        facebook: {
          id: profile.id,
          email: profile.emails[0].value
        }
      });

      await newUser.save();
      done(null, newUser);
    } catch (error) {
      done(error, false, error.message);
    }

  }
))


// passport google OAuth strategy 
passport.use('googleToken', new GooglePlusTokenStrategy(
  {
    // you must write clientID not clientId and the same about clientSecret 
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret

  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('accessToken =  ', accessToken)
      console.log('refreshToken =  ', refreshToken)
      console.log('profile =  ', profile)

      // check if the user is exist on DB
      const existingUser = await userModel.findOne({ "google.id": profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      // if not create new user 
      const newUser = new userModel({
        method: 'google',
        google: {
          id: profile.id,
          email: profile.emails[0].value
        }
      });
      await newUser.save();
      done(null, newUser);
    } catch (error) {
      done(error, false, error.message)
    }
  }
))




// Local Strategy to signin functionality 
passport.use(new localStrategy(
  {
    usernameField: 'email'
  },
  async (email, password, done) => {

    try {
      //  check if user given email 
      const user = await userModel.findOne({ "local.email": email })
      if (!user) {
        return done(null, false)
      }
      // check password is correct 
      // const isMatch = await userModel.isValidPassword(password);
      const isMatch = await bcrypt.compare(password, user.local.password)
      if (!isMatch) { return done(null, false) } // done like next , if here I don't write return so he will go to : done(null,user)
      if (!isMatch) {
        return done(null, false)
      }
      done(null, user)
    } catch (error) {
      done(error, false)
    }
  }));
