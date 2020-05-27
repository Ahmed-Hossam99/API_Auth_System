const { body, validationResult, check } = require('express-validator')

const signupValidationRules = () => {
  return [
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
  ]
}
const signinValidationRules = () => {
  return [
    check('email')
      .isEmail()
      .withMessage('please enter valid e-mail')
      .normalizeEmail(),

    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .trim(),
  ]
}


// this to show error if exist 
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  signinValidationRules,
  signupValidationRules,
  validate,
}




