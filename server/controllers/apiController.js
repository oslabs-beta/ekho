// NK: I still don't know when/why node-fetch is ever required. Let's try without.
// import fetch from 'node-fetch';
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const createErr = require('../utils/errorHandler');
const { checkRequiredProps, checkTypes } = require('../utils/bodyValidator');

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
  const addQueryParams = (uri, queryObj) => {
    // takes in an object and a URI
    // returns the URI with all keys and values related with key=value and concatenated with &
    const queryKeys = Object.keys(queryObj);
    const queryParams = [];
    queryKeys.forEach(el => {
      queryParams.push(`${el}=${queryObj[el]}`);
    });
    const queryStr = queryParams.join('&');
    return `${uri}?${queryStr}`;
  };

  // sanitizing inputs doesn't seem necessary I think, based on testing.
  // console.log(addQueryParams('http://example.com', { cat: 'foo', dog: '\; console.log(do bad things)' }));

  const substituteParams = function (uri, paramsArr) {
    // iterate through the paramsArr
    //  for every argument, iterate through the entire URI and find matches on $ index + 1
    //  replace each match with a sanitized version of the current element
    //  if no match is found, throw an error
    let moddedUri = uri;
    // in the strange case that an API has more than 9 parameters, we can replace from the end
    paramsArr.forEach((el, idx) => {
      const moddedUriCopy = moddedUri;
      moddedUri = moddedUri.replaceAll(`$${idx + 1}/`, `${el}/`);
      if (moddedUri === moddedUriCopy) throw new Error(`No placeholder $${idx + 1} found for param ${el}`);
    });
    // Remove any remaining placeholders in the URI
    moddedUri = moddedUri.replaceAll(/\/\$[0-9]+/g, '');
    return moddedUri;
  };

  // console.log(substituteParams('http://example.com', ['foo'])); // expect error - too many params
  // console.log(substituteParams('http://example.com/$1/', ['foo'])); // expect http://example.com/foo/
  // console.log(substituteParams('http://example.com/$1/$2/$3/test/$4/$5', ['foo', 'bar', 'baz'])); // expect http://example.com/foo/bar/test/baz
  // console.log(substituteParams('http://example.com/$1/$2/$3/test/$4/$5', ['foo', ';console.log(\'do bad things\')', 'baz'])); // expect http://example.com/foo/bar/test/baz

  try {
    // TODO: think about refactoring "finding the experiment" into its own piece of middleware
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

    // structure the URI for calling the microservice
    let uri = experiment.apiEndpoint;
    const { args } = req.body;
    console.log(uri);
    uri = (Object.hasOwn(args, 'params')) ? substituteParams(uri, args.params) : uri;
    console.log(uri);
    uri = (Object.hasOwn(args, 'query')) ? addQueryParams(uri, args.query) : uri;
    console.log(uri);

    const start = Date.now();
    const candidateResponse = await fetch(uri, {
      method: experiment.method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      ...(Object.hasOwn(args, 'body') && { body: JSON.stringify(args.body) }),
    });

    const end = Date.now();
    const response = await candidateResponse.json();
    console.log(candidateResponse);
    console.log(res);
    res.locals.candidateRuntime = end - start;
    res.locals.candidateStatus = candidateResponse.status; // NK: don't know if this is right
    res.locals.candidateResult = response;
    res.locals.experiment = experiment;
    return next();
  } catch (err) {
    return next(createErr('apiController', 'callCandidateMicroservice', err));
  }
};

module.exports = apiController;
