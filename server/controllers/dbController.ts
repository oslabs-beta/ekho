import Results from '../models/dbModel';
// const models = require('../models/dbModel');
import { RequestHandler } from 'express';
import { Error } from 'mongoose'
import createErr from '../utils/errorHandler';

type DbControllerType = {
  getExperiments: RequestHandler,
};

const dbController: DbControllerType = {

  getExperiments: (req, res, next) => {
    Results.find({})
      .then((queryRes: Response) => {
        console.log(queryRes);
        res.locals.experiments = queryRes;
        return next();
      })
      .catch((err: Error) => { // JEC: err as any type? 
        return next(createErr('dbController', 'getExperiments', JSON.stringify(err)));
      })
  }
};

export default dbController;
