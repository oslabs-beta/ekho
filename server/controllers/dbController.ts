// import models from '../models/dbModel';
const models = require('../models/dbModels');
import { RequestHandler } from 'express';
import createErr from '../utils/errorHandler';

type DbControllerType = {
  getExperiments: RequestHandler,
};

const dbController: DbControllerType = {

  getExperiments: (req, res, next) => {
    models.Results.find({})
      .then((queryRes: Response) => {
        console.log(queryRes);
        res.locals.experiments = queryRes;
        return next();
      })
      .catch(err  => { // JEC: err as any type? 
        return next(createErr('dbController', 'getExperiments', err));
      })
  }
};

export default dbController;
