// NK: I still don't know when/why node-fetch is ever required. Let's try without.
// import fetch from 'node-fetch';
const createErr = require('../utils/errorHandler.js');
const { checkRequiredProps, checkTypes } = require('../utils/bodyValidator.js');

const apiController = {};

apiController.validateBody = (req, res, next) => {
  try {
    const missingProps = checkRequiredProps(req.body);
    if (missingProps) throw new Error(missingProps);
    const invalidTypes = checkTypes(req.body);
    if (invalidTypes) throw new Error(invalidTypes);
    return next();
  } catch (err) {
    console.log(err);
    return next(createErr('apiController', 'validateBody', err, 400));
  }
};

module.exports = apiController;
