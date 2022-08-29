import { RequestHandler } from 'express';
import db from '../models/dbModel';
import createErr from '../utils/errorHandler';
import { DBBody } from '../types';

type DbControllerType = {
  queryExperimentData: RequestHandler
  queryListOfExperiments: RequestHandler
  publishResults: RequestHandler
};

const dbController: DbControllerType = {
  // query all documents with experimentName matching the experimentName in the request body
  // ***expect input in req.query as an object
  queryExperimentData: async (req, res, next) => {
    try {
      const { experimentName } = req.query;
      const queryResult: object[] = await db.find({ experimentName });
      res.locals.experimentData = queryResult;
      return next();
    } catch (err) {
      console.log('queryExperimentData failed');
      return next(err);
    }
  },
  queryListOfExperiments: async (req, res, next) => {
    try {
      const queryResult: string[] = await db.distinct('experimentName');
      res.locals.experiments = queryResult;
      return next();
    } catch (err) {
      console.log('queryListofExperiments failed');
      return next(err);
    }
  },
  publishResults: async (req, res, next) => {
    const dbBody: DBBody = {
      experimentName: req.body.name,
      context: req.body.context,
      resultLegacy: JSON.stringify(req.body.result),
      resultMS: JSON.stringify(res.locals.candidateResult),
      legacyTime: req.body.runtime,
      msTime: res.locals.candidateRuntime,
      mismatch: res.locals.mismatch,
    };
    try {
      await db.create(dbBody);
      console.log('experiment added to DB');
      return next();
    } catch (err) {
      return next(createErr('dbController', 'publishResults', err));
    }
  },
};

export default dbController;
