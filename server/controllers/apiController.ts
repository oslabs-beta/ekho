// NK: I still don't know when/why node-fetch is ever required. Let's try without.
// import fetch from 'node-fetch';
import { RequestHandler } from 'express';
import createErr from '../utils/errorHandler';
import experiments from '../utils/yamlParser';
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
    const checkRequiredProps = (body: LegacyBody) => {
      const missingFields = [];
      if (!Object.hasOwn(body, 'name')) missingFields.push('name');
      if (!Object.hasOwn(body, 'args')) missingFields.push('args');
      if (!Object.hasOwn(body, 'runtime')) missingFields.push('runtime');
      if (!Object.hasOwn(body, 'result')) missingFields.push('result');
      if (missingFields.length) throw new Error(`missing required field(s): ${missingFields.join(', ')}`);
    };

    const checkTypes = (body: LegacyBody) => {
      const { args } = body;
      if (typeof args !== 'object' || Array.isArray(args)) return 'args must be an object containing at least 1 property: body, params, or query';
      if (!Object.hasOwn(args, 'query')
        && !Object.hasOwn(args, 'params')
        && !Object.hasOwn(args, 'body')) return 'args must contain at least 1 property: body, params, or query';
      if (Object.hasOwn(args, 'query') && (typeof args.query !== 'object' || Array.isArray(args.query))) return 'if provided, query must be an object representing keys/values to be passed as query parameters';
      if (Object.hasOwn(args, 'params') && !Array.isArray(args.params)) return 'if provided, params must be an array';
      if (Object.hasOwn(args, 'body') && (typeof args.body !== 'object' || Array.isArray(args.body))) return 'if provided, body must be an object that will be passed on as the request body';
      if (Object.hasOwn(body, 'context') && (typeof body.context !== 'object' || Array.isArray(body.context))) return 'if provided, context must be an object';
      if (typeof body.runtime !== 'number') return 'runtime should be a number representing function runtime in ms';
    };

    try {
      const { body }: { body: LegacyBody } = req;
      if (!body) throw new Error('request missing body');
      checkRequiredProps(body);
      const typeError = checkTypes(body);
      if (typeError) throw new Error(typeError);
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

    const substituteParams = function (uri: string, paramsArr: string[]) {
      let moddedUri = uri;
      paramsArr.forEach((el, idx) => {
        const moddedUriCopy = moddedUri;
        moddedUri = moddedUri.replaceAll(`$${idx + 1}`, `${el}`);
        if (moddedUri === moddedUriCopy) throw new Error(`No placeholder $${idx + 1} found for param ${el}`);
      });

      // Remove any remaining placeholders in the URI
      moddedUri = moddedUri.replaceAll(/\/\$[0-9]+/g, '');
      return moddedUri;
    };

    try {
      // TODO: figure out how to validate the YAML via TypeScript. There's a separate task for this.
      
      // find the right experiment by looking for one with a matching name
      let experiment: Experiment;
      for (let i = 0; i < experiments.length; i++) {
        if (experiments[i].name === req.body.name) {
          experiment = experiments[i];
          break;
        }
      }
      if (!experiment) throw new Error(`No experiment found matching name ${req.body.name}`);

      let uri = experiment.apiEndpoint;
      const { args }: { args: Args } = req.body;
      uri = (Object.hasOwn(args, 'params')) ? substituteParams(uri, args.params) : uri;
      uri = (Object.hasOwn(args, 'query')) ? addQueryParams(uri, args.query) : uri;

      res.locals.experiment = experiment;
      res.locals.uri = encodeURI(uri);
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
    // validate comparison
    res.locals.mismatch = JSON.stringify(req.body.result) === JSON.stringify(res.locals.candidateResult); 
    //test to see where the mismatch is if it exists
    if(!res.locals.mismatch){
      //
      //find the mismatch and record it
      const mismatches: any[] = [];
      //must be same datatype
      //differeniate by datatype
      //if array or obj treat differently,
      //if num,string,boolean
    }


    //
    return next();
   } catch(err){
    return next(createErr('apiController', 'compareResults', err));
   }
  },

};

export default apiController;
