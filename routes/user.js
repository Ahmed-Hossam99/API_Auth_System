const express = require('express');
const router = require('express-promise-router')();
const { multerConfigImage } = require('../services/multer')
const cloud = require('../services/cloudinary')
const { body, check } = require('express-validator')
const { isAuth } = require('../helpers/auth')
const { signinValidationRules, signupValidationRules, validate } = require('../helpers/validation')
const passport = require('passport')
require('../helpers/passport')

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogl = passport.authenticate('googleToken', { session: false })
const passportFacebook = passport.authenticate('facebookToken', { session: false })



// const router = express.Router();

const userController = require('../controllers/user')

// Post route to signup
router.route('/signup').post(multerConfigImage, signupValidationRules(), validate, userController.signUp)


// Post Route to signin function 
router.route('/signin').post(signinValidationRules(), validate, passportSignIn, userController.signIn)


router.route('/oauth/google').post(passportGoogl, userController.OAuthToken);

router.route('/oauth/facebook').post(passportFacebook, userController.OAuthToken);

router.route('/secret').get(passportJWT, userController.secret)

router.route('/:userId').put(passportJWT, multerConfigImage, userController.updateUser)

// git checkout -b name of paranch

// this link to get access token from google OAuth  
// https://developers.google.com/oauthplayground/

// this link to get access token from facebook OAuth  
// https://developers.facebook.com/tools/explorer/

module.exports = router



