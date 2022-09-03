"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbModel_1 = __importDefault(require("../models/dbModel"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const dbController = {
    // query all documents with experimentName matching the experimentName in the request body
    // ***expect input in req.query as an object
    queryExperimentData: async (req, res, next) => {
        try {
            const { experimentName } = req.query;
            const queryResult = await dbModel_1.default.find({ experimentName });
            res.locals.experimentData = queryResult;
            return next();
        }
        catch (err) {
            console.log('queryExperimentData failed');
            return next(err);
        }
    },
    queryListOfExperiments: async (req, res, next) => {
        try {
            const queryResult = await dbModel_1.default.distinct('experimentName');
            res.locals.experiments = queryResult;
            return next();
        }
        catch (err) {
            console.log('queryListofExperiments failed');
            return next(err);
        }
    },
    publishResults: async (req, res, next) => {
        const dbBody = {
            experimentName: req.body.name,
            context: req.body.context,
            resultLegacy: JSON.stringify(req.body.result),
            resultMS: JSON.stringify(res.locals.candidateResult),
            legacyTime: req.body.runtime,
            msTime: res.locals.candidateRuntime,
            mismatch: res.locals.mismatch,
            createdAt: new Date(Date.now())
        };
        try {
            await dbModel_1.default.create(dbBody);
            console.log('experiment added to DB');
            return next();
        }
        catch (err) {
            return next((0, errorHandler_1.default)('dbController', 'publishResults', err));
        }
    },
};
exports.default = dbController;
