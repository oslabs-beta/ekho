// NK: I still don't know when/why node-fetch is ever required. Let's try without.
// import fetch from 'node-fetch';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { json, RequestHandler } from 'express';
import createErr from '../utils/errorHandler';
import {
  Args,
  ArgsQuery,
  LegacyBody,
  Experiment,
} from '../types';

type ApiControllerType = {
  validateBody: RequestHandler,
  structureURI: RequestHandler,
  callCandidateMicroservice: RequestHandler,
  compareResults: RequestHandler,
};

const apiController: ApiControllerType = {

  validateBody: (req, res, next) => {
    try {
      const { body }: { body: LegacyBody } = req;
      console.log(body);
      if (!body) throw new Error('request missing body');
      return next();
    } catch (err) {
      return next(createErr('apiController', 'validateBody', err));
    }
  },

  structureURI: (req, res, next) => {
    const addQueryParams = (uri: string, queryObj: ArgsQuery) => {
      // takes in an object and a URI
      // returns the URI with all keys and values related with key=value and concatenated with &
      const queryKeys = Object.keys(queryObj);
      const queryParams: string[] = [];
      queryKeys.forEach(el => {
        queryParams.push(`${el}=${queryObj[el]}`);
      });
      const queryStr = queryParams.join('&');
      return `${uri}?${queryStr}`;
    };

    // sanitizing inputs doesn't seem necessary I think, based on testing.
    // console.log(addQueryParams('http://example.com', { cat: 'foo', dog: '\; console.log(do bad things)' }));

    const substituteParams = function (uri: string, paramsArr: string[]) {
      let moddedUri = uri;
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
    // console.log(substituteParams('http://example.com/$1/$2/$3/test/$4/$5', ['foo', ';console.log(\'do bad things\')', 'baz'])); // expect http://example.com/foo/';console.log(\'do bad things\')'/test/baz

    try {
      // TODO: figure out how to validate the YAML via TypeScript. There's a separate task for this.
      const doc: any[] = yaml.loadAll(fs.readFileSync(path.join(__dirname, '../experiments.yaml'), 'utf-8'));
      console.log(doc);
      // find the right experiment by looking for one with a matching name
      let experiment: Experiment;
      for (let i = 0; i < doc.length; i++) {
        if (doc[i].name === req.body.name) {
          experiment = doc[i];
          break;
        }
      }
      console.log(experiment);
      if (!experiment) throw new Error(`No experiment found matching name ${req.body.name}`);

      let uri = experiment.apiEndpoint;
      const { args }: { args: Args } = req.body;
      uri = (Object.hasOwn(args, 'params')) ? substituteParams(uri, args.params) : uri;
      uri = (Object.hasOwn(args, 'query')) ? addQueryParams(uri, args.query) : uri;

      res.locals.experiment = experiment;
      res.locals.uri = uri;
      return next();
    } catch (err) {
      return next(createErr('apiController', 'structureUri', err));
    }
  },

  callCandidateMicroservice: async (req, res, next) => {
    const { experiment, uri } = res.locals;
    const { args } = req.body;
    // Figure out if this trial should run
    if (experiment.enabledPct < Math.random()) return;

    // TODO: implement flagged mismatch rules here, or maybe later when we're sending to the DB.
    try {
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
      return next();
    } catch (err) {
      return next(createErr('apiController', 'callCandidateMicroservice', err));
    }
  },

  compareResults:(req,res,next) => {

   
   try{
    //choose faster runtime
    if(req.body.runtime < res.locals.candidateRuntime) res.locals.fasterRuntime = 'legacy';
    else res.locals.fasterRuntime = 'microservice'
    // validate comparison
    res.locals.mismatch = JSON.stringify(req.body.result) === JSON.stringify(res.locals.candidateResult); 
    return next();
   } catch(err){
    return next(createErr('apiController', 'compareResults', err));
   }
  },

};

export default apiController;
