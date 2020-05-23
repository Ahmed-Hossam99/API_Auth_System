const express = require('express');
const router = require('express-promise-router')();
const { body, check } = require('express-validator')
const { isAuth } = require('../helpers/auth')


// const router = express.Router();

const userController = require('../controllers/user')

// Post route to signup
router.route('/signup').post([
  check('email')
    .isEmail()
    .withMessage('please enter valid e-mail')
    .normalizeEmail(),

  body('password', 'Password has to be valid.')
    .isLength({ min: 5 })
    .trim(),
  // .isAlphanumeric()
  body('name', ' Name must be entered . ')
    .isLength({ min: 5 })
    .trim()
], userController.signUp)


// Post Route to signin function 
router.route('/signin').post(userController.signIn)

router.route('/secret').get(isAuth, userController.secret)


// git checkout -b name of paranch

module.exports = router



