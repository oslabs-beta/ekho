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
  queryListofExperiments: RequestHandler
	publishResults:  RequestHandler
}

const dbController: dbControllerType = {
	//query all documents with experimentName matching the experimentName in the request body
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
	queryListofExperiments: async (req, res, next) => {
		try{
			const { experimentName, dateStart, dateEnd } = req.body;
			const queryResult: object[] = await db.Results.find()
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
				resultLegacy: req.body.result ,
				resultMS: res.locals.candidateResult,
				legacyTime: req.body.runtime,
				msTime: res.locals.candidateRuntime,
				mismatch: res.locals.mismatch
		}
		try{
				db.Results.insertOne(DBBody);
				console.log('experiment added to DB')
		}
		catch(err){
				return next(createErr('dbController', 'publishResults', err));
		}
		return next();
}
};

export default dbController;
