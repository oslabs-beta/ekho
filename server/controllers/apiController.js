// NK: I still don't know when/why node-fetch is ever required. Let's try without.
// import fetch from 'node-fetch';
const createErr = require('../utils/errorHandler');
const { checkRequiredProps, checkTypes } = require('../utils/bodyValidator');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');


const apiController = {};

apiController.validateBody = (req, res, next) => {
  try {
    const missingProps = checkRequiredProps(req.body);
    if (missingProps) throw new Error(missingProps);
    const invalidTypes = checkTypes(req.body);
    if (invalidTypes) throw new Error(invalidTypes);
    return next();
  } catch (err) {
    return next(createErr('apiController', 'validateBody', err));
  }
};

apiController.callCandidateMicroservice = async (req, res, next) => {
  try {
    const doc = yaml.loadAll(fs.readFileSync(path.join(__dirname, '../experiments.yaml'), 'utf-8'));
    console.log(doc);
    // find the right experiment by looking for one with a matching name
    let experiment;
    for (let i = 0; i < doc.length; i++) {
      if (doc[i].name === req.body.name) {
        experiment = doc[i];
        break;
      }
    }

    if (!experiment) throw new Error(`No experiment found matching name ${req.body.name}`);

    // Figure out if this trial should run
    if (experiment.enabledPct < Math.random()) return;

    // TODO: implement flagged mismatch rules here, or maybe later when we're sending to the DB.

    // structure the URL for calling the microservice
    
    // call the microservice with the correct input

    const candidateResult = await fetch()

  } catch (err) {
    return next(createErr('apiController', 'sendApiRequest', err));
  }
}

module.exports = apiController;
