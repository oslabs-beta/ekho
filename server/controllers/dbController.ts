const db = require('../models/dbModel.js');
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

type DbControllerType = {
    publishResults:  RequestHandler,
}
const dbController: DbControllerType = {
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
        }
        catch(err){
            return next(createErr('dbController', 'publishResults', err));
        }
        return next();
    }
};

export default dbController;
