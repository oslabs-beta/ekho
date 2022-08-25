const db = require('../models/dbModel');
const mongoose = require('mongoose')
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
  DBBody,
} from '../types';

type dbControllerType = {
  queryExperimentData: RequestHandler
  queryListOfExperiments: RequestHandler
	publishResults:  RequestHandler
}

const dbController: dbControllerType = {
	//query all documents with experimentName matching the experimentName in the request body
	//***expect input in req.query as an object
	queryExperimentData: async (req, res, next) => {
		try{
			const { experimentName } = req.body;
			const queryResult: object[] = await db.Results.find({experimentName: experimentName});
			res.locals.experimentData = queryResult;
			return next();
		}
		catch(err){
			console.log('queryExperimentData failed');
			return next(err);
		}
	},
	queryListOfExperiments: async (req, res, next) => {
		try{
			const queryResult: string[] = await db.Results.distinct('experimentName')
      res.locals.experiments = queryResult;
      return next();
		}
		catch(err){
			console.log('queryListofExperiments failed');
			return next(err);
		}
	},
	publishResults: async (req, res, next) => {
		const DBBody: DBBody = {
				experimentName: req.body.name,
				context: req.body.context,
				resultLegacy: JSON.stringify(req.body.result) ,
				resultMS: JSON.stringify(res.locals.candidateResult),
				legacyTime: req.body.runtime,
				msTime: res.locals.candidateRuntime,
				mismatch: res.locals.mismatch
		}
		try{
				console.log(DBBody);
				await db.Results.create(DBBody);
				console.log('experiment added to DB')
		}
		catch(err){
				return next(createErr('dbController', 'publishResults', err));
		}
		return next();
    }  
};

export default dbController;
