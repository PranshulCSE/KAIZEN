const { body, validationResult } = require ('express-validator');

 const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

  const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email');

  const validatePassword = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[a-z]/)
  .withMessage('Password must contain lowercase letters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain uppercase letters')
  .matches(/[0-9]/)
  .withMessage('Password must contain numbers');

  const validateName = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ max: 50 })
  .withMessage('Name cannot be more than 50 characters');

 const validateOTP = body('otp')
  .isLength({ min: 6, max: 6 })
  .isNumeric()
  .withMessage('OTP must be 6 digits');

  module.exports={
    validate,
    validateEmail,
    validateName,
    validateOTP
  };