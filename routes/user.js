const express = require('express');
const router = require('express-promise-router')();
const { body, check } = require('express-validator')
const { isAuth } = require('../helpers/auth')
const passport = require('passport')
require('../helpers/passport')

// validtion middlewares
const { signinValidationRules, signupValidationRules, validate } = require('../helpers/validation')

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogl = passport.authenticate('googleToken', { session: false })
const passportFacebook = passport.authenticate('facebookToken', { session: false })



// const router = express.Router();

const userController = require('../controllers/user')

// Post route to signup
router.route('/signup').post(signupValidationRules(), validate, userController.signUp)


// Post Route to signin function 
router.route('/signin').post(signinValidationRules(), validate, passportSignIn, userController.signIn)

router.route('/secret').get(passportJWT, userController.secret)

router.route('/oauth/google').post(passportGoogl, userController.OAuthToken);

router.route('/oauth/facebook').post(passportFacebook, userController.OAuthToken);



// git checkout -b name of paranch

// this link to get access token from google OAuth  
// https://developers.google.com/oauthplayground/

// this link to get access token from facebook OAuth  
// https://developers.facebook.com/tools/explorer/

module.exports = router



