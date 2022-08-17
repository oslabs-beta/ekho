import path from 'path';

import express from 'express';
import apiController from './controllers/apiController.js';
import dbController from './controllers/dbController.js';


// TODO: remove this once we confirm that dotenv is working properly.
console.log(process.env);

const PORT = 3000;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

/* what are the routes we need? shouldn't be a ton:
* - We accept POST requests from the legacy stack for each trial
* - We accept responses from the microservice stack for each trial, but that's not a separate route
* - For the visualization side of things, we accept some complex inputs and query the DB
* so... just 2 then?
* don't think we need a routes folder. we can refactor later if we need to
*/

server.post(
  '/',
  apiController.validateBody,
  // As soon as the body is validated, send a response back to minimize performance impact
  // TODO: should we send the status back before validateBody to improve speed?
  // Does the legacy app need to know that the input was invalid?
  (req, res) => res.sendStatus(200)
  /* pass request to API */
  /* perform comparison logic  */
  /* commit response to DB */
);

// catch-all route handler for any requests to an unknown route
server.use('*', (req, res) => res.status(404).send('This is not a valid route.'));

/**
 * express error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 */
server.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

// TODO: NK: I don't think exporting the server file does anything, but I could be wrong.
// export default server;
