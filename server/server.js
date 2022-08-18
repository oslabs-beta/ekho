// import path from 'path';
// import 'dotenv/config';
// import express from 'express';
// import apiController from './controllers/apiController.js';
// import dbController from './controllers/dbController.js';

const path = require('path');
require('dotenv').config();
const express = require('express');
const apiController = require('./controllers/apiController');
const dbController = require('./controllers/dbController');

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
  (req, res, next) => {
    res.sendStatus(200)
    return next()
  },
  apiController.validateBody,
  apiController.callCandidateMicroservice
  /* perform comparison logic  */
  /* commit response to DB */
);

// catch-all route handler for any requests to an unknown route
server.use('*', (req, res) => res.status(404).send('This is not a valid route.'));

/**
 * express error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 * Note: we aren't sending back error messages, so all we're doing is logging the error.
 */
server.use((err, req, res, next) => {
  const defaultErr = 'Express error handler caught unknown middleware error';
  const error = err || defaultErr;
  console.log(error);
  return;
});

// NK: We need to export the listener so Jest can run it.
module.exports = server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});