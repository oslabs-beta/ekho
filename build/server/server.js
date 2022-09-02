"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const apiController_1 = __importDefault(require("./controllers/apiController"));
const dbController_1 = __importDefault(require("./controllers/dbController"));
// JEC: changed from 3000 to 443 - port 443 is standard for HTTPS (secure); port 80 is standard for HTTP (plain text)
// https://www.techopedia.com/definition/15709/port-80#:~:text=Port%2080%20is%20the%20port,and%20receive%20unencrypted%20web%20pages.
const PORT = 443;
const server = (0, express_1.default)();
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: true }));
// JEC: temp static serving of frontend for testing - probably want to change
server.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
/* what are the routes we need? shouldn't be a ton:
* - We accept POST requests from the legacy stack for each trial
* - We accept responses from the microservice stack for each trial, but that's not a separate route
* - For the visualization side of things, we accept some complex inputs and query the DB
* so... just 2 then?
* don't think we need a routes folder. we can refactor later if we need to
*/
server.post('/', (req, res, next) => {
    res.sendStatus(200);
    next();
}, apiController_1.default.validateBody, apiController_1.default.structureURI, apiController_1.default.callCandidateMicroservice, 
/* perform comparison logic  */
apiController_1.default.compareResults, 
/* commit response to DB */
dbController_1.default.publishResults, (req, res) => console.log('trial complete'));
/* -----------FRONTEND HANDLERS----------- */
//create a cache to store all documents from the experimentName query. 
// Store the cache using closure to prevent global updates
const closedCache = () => {
    let cache = [];
    return function updateCache(query) {
        if (!query)
            return cache;
        else {
            cache = query;
            return cache;
        }
    };
};
// handles requests for a list of experiments within a given date range. 
// *Aggregate all the data for that experiment and provide to user???
server.get('/experiments', dbController_1.default.queryListOfExperiments, (req, res) => {
    res.status(200).set('Access-Control-Allow-Origin', '*').json(res.locals.experiments);
});
// handles requests for all data for a given experimentName
server.get('/experiment/data', dbController_1.default.queryExperimentData, (req, res) => {
    closedCache(res.locals.experimentData);
    res.status(200).json(res.locals.experimentData);
});
// handles requests to filter experimentData by Context
server.post('/experiment/context', (req, res) => {
    // create a temporary array in memory
    const matchingContext = [];
    const currentCache = closedCache();
    // iterate through the cache array
    for (const obj of currentCache) {
        // if object has context matching the string passed in body, push the object into the temp array
        // expect input in req.query
        if (obj.Context === req.body.Context)
            matchingContext.push(obj);
    }
    ;
    // send a response with the temp array stringified
    res.status(200).json(matchingContext);
});
/* ------------FRONTEND HANDLERS---------------------- */
// catch-all route handler for any requests to an unknown route
server.use('*', (req, res) => res.status(404).send('Invalid route.'));
/**
 * express error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
  * Note: we aren't sending back error messages, so all we're doing is logging the error.
  */
const globalErrorHandler = (err, req, res, next) => {
    const defaultErr = 'Express error handler caught unknown middleware error';
    const error = err || defaultErr;
    console.log(error);
};
server.use(globalErrorHandler);
// NK: We need to export the listener so Jest can run it.
// module.exports = server.listen(PORT, () => {
//   console.log(`Server listening on port: ${PORT}...`);
// });
exports.default = server.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`);
});
