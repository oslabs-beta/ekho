import path from 'path';
import 'dotenv/config';
import express from 'express';
import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler, application } from 'express';
import { ServerApiVersion } from 'mongodb';
import apiController from './controllers/apiController';
import dbController from './controllers/dbController';

// JEC: changed from 3000 to 443 - port 443 is standard for HTTPS (secure); port 80 is standard for HTTP (plain text)
// https://www.techopedia.com/definition/15709/port-80#:~:text=Port%2080%20is%20the%20port,and%20receive%20unencrypted%20web%20pages.
const PORT = 443;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// JEC: temp static serving of frontend for testing - probably want to change
server.use(express.static(path.join(__dirname, '../../public')));

/* what are the routes we need? shouldn't be a ton:
* - We accept POST requests from the legacy stack for each trial
* - We accept responses from the microservice stack for each trial, but that's not a separate route
* - For the visualization side of things, we accept some complex inputs and query the DB
* so... just 2 then?
* don't think we need a routes folder. we can refactor later if we need to
*/

server.post(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200);
    next();
  },
  apiController.validateBody,
  apiController.findExperiment,
  apiController.structureURI,
  apiController.callCandidateMicroservice,
  apiController.compareResults,
  dbController.publishResults,
  (req: Request, res: Response) => {
    // console.log('trial complete');
  },
);

/* -----------FRONTEND HANDLERS----------- */
//create a cache to store all documents from the experimentName query. 
// Store the cache using closure to prevent global updates
const closedCache: Function = () => {
  let cache: object[] = [];
  return function updateCache(query?: object[]) {
    if (!query) return cache;
    else {
      cache = query;
      return cache;
    }
  };
};

// handles requests for a list of experiments within a given date range. 
// *Aggregate all the data for that experiment and provide to user???
server.get('/experiments', dbController.queryListOfExperiments, (req: Request, res: Response) => {
  res.status(200).set('Access-Control-Allow-Origin', '*').json(res.locals.experiments);
});

// handles requests for all data for a given experimentName
server.get('/experiment/data', dbController.queryExperimentData, (req: Request, res: Response) => {
  closedCache(res.locals.experimentData);
  res.status(200).json(res.locals.experimentData);
});

// handles requests to filter experimentData by Context
server.post('/experiment/context', (req: Request, res: Response) => {
  // create a temporary array in memory
  const matchingContext: object[] = [];
  const currentCache = closedCache();
  // iterate through the cache array
  for (const obj of currentCache){
    // if object has context matching the string passed in body, push the object into the temp array
    // expect input in req.query
    if (obj.Context === req.body.Context) matchingContext.push(obj);
  };
  // send a response with the temp array stringified
  res.status(200).json(matchingContext);
});
/* ------------FRONTEND HANDLERS---------------------- */

// catch-all route handler for any requests to an unknown route
server.use('*', (req: Request, res: Response) => res.status(404).send('Invalid route.'));

/**
 * express error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
  * Note: we aren't sending back error messages, so all we're doing is logging the error.
  */
const globalErrorHandler: ErrorRequestHandler = (err: string, req, res, next) => {
  const defaultErr = 'Express error handler caught unknown middleware error';
  const error = err || defaultErr;
  console.log(error);
};

server.use(globalErrorHandler);

// NK: We need to export the listener so Jest can run it.
// module.exports = server.listen(PORT, () => {
//   console.log(`Server listening on port: ${PORT}...`);
// });

module.exports = server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
