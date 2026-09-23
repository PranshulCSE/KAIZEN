const { validationResult } = require( 'express-validator');

 const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path, // FIX Bug #3: express-validator v7 uses `path` not `param`
        message: err.msg
      }))
    });
  };
};
module.exports={validate};