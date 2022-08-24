const db = require('../models/dbModel.js');
import { RequestHandler } from 'express';

type dbControllerType = {
  queryExperimentData: RequestHandler
  queryListofExperiments: RequestHandler
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
	}
};

//control data and candidate data for a given experiment

export default dbController;
